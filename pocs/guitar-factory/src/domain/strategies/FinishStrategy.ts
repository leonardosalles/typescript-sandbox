import { GuitarSpec } from "../GuitarSpec";
import { Finish } from "../GuitarTypes";

export type VisualFinish = {
  bodyColor: string;
  accentColor: string;
  roughness: number;
  metalness: number;
};

export interface FinishStrategy {
  visual(spec: GuitarSpec): VisualFinish;
}

export class LacquerFinishStrategy implements FinishStrategy {
  visual(spec: GuitarSpec): VisualFinish {
    const palette = new Map<Finish, VisualFinish>([
      [
        Finish.Sunburst,
        {
          bodyColor: "#b85b2d",
          accentColor: "#2b1712",
          roughness: 0.32,
          metalness: 0.08,
        },
      ],
      [
        Finish.OceanBlue,
        {
          bodyColor: "#1f8fbf",
          accentColor: "#f2d38b",
          roughness: 0.28,
          metalness: 0.12,
        },
      ],
      [
        Finish.RacingGreen,
        {
          bodyColor: "#12614b",
          accentColor: "#f5f0dc",
          roughness: 0.34,
          metalness: 0.1,
        },
      ],
      [
        Finish.MatteBlack,
        {
          bodyColor: "#111318",
          accentColor: "#d8d0bd",
          roughness: 0.72,
          metalness: 0.05,
        },
      ],
      [
        Finish.Natural,
        {
          bodyColor: "#c99b5f",
          accentColor: "#4f2c1b",
          roughness: 0.45,
          metalness: 0.04,
        },
      ],
    ]);

    const visual = palette.get(spec.finish);
    if (!visual) throw new Error(`No visual finish for ${spec.finish}`);

    return visual;
  }
}
