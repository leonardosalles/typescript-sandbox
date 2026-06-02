import { RefObject, useEffect, useRef } from "react";
import { GuitarSpec } from "../../domain/GuitarSpec";
import { GuitarScene } from "../three/GuitarScene";

export function useGuitarScene(
  hostRef: RefObject<HTMLDivElement | null>,
  spec: GuitarSpec,
  progress: number,
): void {
  const sceneRef = useRef<GuitarScene | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;

    sceneRef.current = new GuitarScene(hostRef.current);

    return () => {
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [hostRef]);

  useEffect(() => {
    sceneRef.current?.renderSpec(spec, progress);
  }, [spec, progress]);
}
