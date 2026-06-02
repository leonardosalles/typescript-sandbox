import * as THREE from "three";
import lesPaulUrl from "../../assets/guitar-tele.png";
import stratUrl from "../../assets/guitar-strat.png";
import teleUrl from "../../assets/guitar-les-paul.png";
import { defaultElectricSpec } from "../../domain/defaultGuitarSpecs";
import { GuitarSpec } from "../../domain/GuitarSpec";
import { BodyShape, Finish } from "../../domain/GuitarTypes";
import { LacquerFinishStrategy } from "../../domain/strategies/FinishStrategy";
import { MagneticPickupStrategy } from "../../domain/strategies/PickupStrategy";

const assetByShape: Record<string, string> = {
  [BodyShape.Strat]: stratUrl,
  [BodyShape.LesPaul]: lesPaulUrl,
  [BodyShape.Tele]: teleUrl,
  [BodyShape.Dreadnought]: stratUrl,
  [BodyShape.JazzBass]: stratUrl,
};

export class GuitarScene {
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  private readonly renderer: THREE.WebGLRenderer;
  private readonly guitar = new THREE.Group();
  private readonly finish = new LacquerFinishStrategy();
  private readonly pickups = new MagneticPickupStrategy();
  private readonly loader = new THREE.TextureLoader();
  private readonly textures = new Map<string, THREE.Texture>();
  private frame = 0;
  private progress = 0;
  private activeKey = "";
  private spec = defaultElectricSpec();

  constructor(private readonly host: HTMLDivElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.className = "interactive-guitar";
    this.host.appendChild(this.renderer.domElement);
    this.camera.position.set(0, 0.08, 11.6);
    this.scene.add(this.guitar);
    this.scene.add(new THREE.AmbientLight("#ffffff", 1.4));
    this.resize();
    window.addEventListener("resize", this.resize);
    this.renderSpec(this.spec, 0);
    this.animate();
  }

  renderSpec(spec: GuitarSpec, progress: number): void {
    this.spec = spec;
    this.progress = progress / 100;
    this.rebuild();
  }

  dispose(): void {
    window.removeEventListener("resize", this.resize);
    cancelAnimationFrame(this.frame);
    this.textures.forEach((texture) => texture.dispose());
    this.renderer.dispose();
    this.host.replaceChildren();
  }

  private rebuild(): void {
    const asset = assetByShape[this.spec.bodyShape] ?? stratUrl;
    const key = `${asset}:${this.spec.finish}:${this.progress}`;

    if (key === this.activeKey) return;

    this.activeKey = key;
    this.loadTexture(asset, (texture) => {
      this.guitar.clear();
      this.addFrontTexture(this.tintTexture(texture));
      this.addGlow();
    });
  }

  private loadTexture(
    asset: string,
    ready: (texture: THREE.Texture) => void,
  ): void {
    const cached = this.textures.get(asset);

    if (cached) {
      ready(cached);
      return;
    }

    this.loader.load(asset, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      this.textures.set(asset, texture);
      ready(texture);
    });
  }

  private addFrontTexture(texture: THREE.Texture): void {
    const image = texture.image as { width: number; height: number };
    const height = 6.7;
    const width = height * (image.width / image.height);
    const front = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.04,
        side: THREE.DoubleSide,
      }),
    );

    front.position.set(0, 0.08, 0);
    this.guitar.add(front);
  }

  private tintTexture(texture: THREE.Texture): THREE.Texture {
    if (this.spec.finish === Finish.Natural) return texture;

    const image = texture.image as HTMLImageElement;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) return texture;

    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);

    const target = new THREE.Color(this.finish.visual(this.spec).bodyColor);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = pixels.data;

    for (let index = 0; index < data.length; index += 4) {
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const alpha = data[index + 3];
      const max = Math.max(red, green, blue);
      const min = Math.min(red, green, blue);
      const isBrightBodyPaint = alpha > 20 && max > 145 && max - min < 76;

      if (isBrightBodyPaint) {
        const shade = Math.max(0.36, max / 255);
        data[index] = Math.round(target.r * 255 * shade);
        data[index + 1] = Math.round(target.g * 255 * shade);
        data[index + 2] = Math.round(target.b * 255 * shade);
      }
    }

    context.putImageData(pixels, 0, 0);

    const tinted = new THREE.CanvasTexture(canvas);
    tinted.colorSpace = THREE.SRGBColorSpace;
    tinted.anisotropy = 8;

    return tinted;
  }

  private addGlow(): void {
    const visual = this.finish.visual(this.spec);
    const tone = this.pickups.tone(this.spec);
    const glow = new THREE.Mesh(
      new THREE.RingGeometry(1.85, 2.02, 96),
      new THREE.MeshBasicMaterial({
        color: visual.accentColor,
        transparent: true,
        opacity: 0.06 + this.progress * 0.12 + tone.output / 1500,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );

    glow.position.set(0, -2.05, -0.1);
    glow.scale.set(1.24, 0.82, 1);
    this.guitar.add(glow);
  }

  private readonly resize = (): void => {
    const { width, height } = this.host.getBoundingClientRect();
    const safeWidth = Math.max(width, 320);
    const safeHeight = Math.max(height, 380);

    this.camera.aspect = safeWidth / safeHeight;
    this.camera.position.z = safeWidth < 520 ? 13.2 : 11.6;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(safeWidth, safeHeight, false);
  };

  private animate = (): void => {
    this.frame = requestAnimationFrame(this.animate);
    const time = performance.now() * 0.001;
    const reveal = 0.78 + this.progress * 0.06;

    this.guitar.rotation.z = -0.025 + Math.sin(time * 0.45) * 0.006;
    this.guitar.scale.setScalar(reveal);
    this.guitar.position.y = Math.sin(time * 0.9) * 0.025;
    this.renderer.render(this.scene, this.camera);
  };
}
