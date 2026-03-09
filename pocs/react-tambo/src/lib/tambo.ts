import { z } from "zod";
import type { TamboComponent } from "@tambo-ai/react";
import SeatMap from "@/components/seat-map";
import FlightDuration from "@/components/flight-duration";

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

const FlightDurationPropsSchema = z.object({
  flightNumber: z.string().optional().default("LA3042"),
  origin: z.string().optional().default("GRU"),
  destination: z.string().optional().default("GIG"),
  originCity: z.string().optional().default("São Paulo"),
  destinationCity: z.string().optional().default("Rio de Janeiro"),
  departureTime: z.string().optional().default("14:35"),
  arrivalTime: z.string().optional().default("15:40"),
  duration: z.string().optional().default("1h 05min"),
  date: z.string().optional().default("Mar 9, 2026"),
});

export const flightDurationTamboComponent: TamboComponent = {
  name: "FlightDuration",
  description: `ALWAYS render this component immediately when the user asks about flight duration, how long the flight takes, departure time, arrival time, flight schedule, or anything related to flight timing. Do NOT ask clarifying questions — use default values if no specific data is provided. Render immediately.`,
  component: FlightDuration,
  propsSchema: FlightDurationPropsSchema,
};
