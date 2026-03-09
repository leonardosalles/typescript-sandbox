"use client";

import React from "react";
import "./globals.css";
import { TamboProvider } from "@tambo-ai/react";
import {
  flightDurationTamboComponent,
  seatMapTamboComponent,
} from "@/lib/tambo";
import { MOCK_FLIGHT } from "@/lib/mockData";

const tamboComponents = [seatMapTamboComponent, flightDurationTamboComponent];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Tambo Flight Assistant</title>
        <meta name="description" content="A demo of Tambo with React" />
      </head>
      <body>
        <TamboProvider
          apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
          components={tamboComponents}
          userKey="poc-user"
          contextHelpers={{
            flightData: () => `
              The user's current flight data is:
              - Flight number: ${MOCK_FLIGHT.flightNumber}
              - Route: ${MOCK_FLIGHT.origin} → ${MOCK_FLIGHT.destination}
              - Departure: ${MOCK_FLIGHT.departureTime}, Arrival: ${MOCK_FLIGHT.arrivalTime}
              - Total seats: ${MOCK_FLIGHT.totalSeats}
              - Available seats: ${MOCK_FLIGHT.availableSeats}
              - Occupied seats: ${MOCK_FLIGHT.totalSeats - MOCK_FLIGHT.availableSeats}
              - Rows: ${MOCK_FLIGHT.rows}, Seats per row: ${MOCK_FLIGHT.seatsPerRow}
              - Exit rows: ${MOCK_FLIGHT.exitRows.join(", ")}
              - Business class rows: 1 to ${MOCK_FLIGHT.businessClassRows}
              Always use this exact data when answering questions about seats or rendering the seat map.
            `,
          }}
        >
          {children}
        </TamboProvider>
      </body>
    </html>
  );
}
