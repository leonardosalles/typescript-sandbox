import { useRef } from "react";
import { GuitarSpec } from "../../domain/GuitarSpec";
import { useGuitarScene } from "../hooks/useGuitarScene";

type Props = {
  spec: GuitarSpec;
  progress: number;
};

export function GuitarViewport({ spec, progress }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  useGuitarScene(hostRef, spec, progress);

  return (
    <section className="viewport-shell">
      <div className="viewport-topline">
        <span>{spec.model}</span>
        <strong>{progress}%</strong>
      </div>
      <div ref={hostRef} className="guitar-canvas" />
      <div className="stage-rail">
        <div style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}
