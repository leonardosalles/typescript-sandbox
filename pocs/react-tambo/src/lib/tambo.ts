import { z } from "zod";
import type { TamboComponent } from "@tambo-ai/react";
import SeatMap from "@/components/SeatMap";

const SeatMapPropsSchema = z.object({
  flightNumber: z.string().optional().default("LA3042"),
  origin: z.string().optional().default("GRU"),
  destination: z.string().optional().default("GIG"),
  totalSeats: z.number().optional().default(150),
  availableSeats: z.number().optional().default(42),
  rows: z.number().optional().default(25),
  seatsPerRow: z.number().optional().default(6),
  exitRows: z.array(z.number()).optional().default([12, 13]),
  businessClassRows: z.number().optional().default(3),
});

export const seatMapTamboComponent: TamboComponent = {
  name: "SeatMap",
  description: `ALWAYS render this component immediately when the user asks anything about seats, seat availability, seat map, seat layout, how many seats, available seats, or occupied seats in a flight. Do NOT ask clarifying questions — use default values if no specific flight data is provided. Render immediately.`,
  component: SeatMap,
  propsSchema: SeatMapPropsSchema,
};
