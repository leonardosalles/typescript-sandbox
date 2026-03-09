"use client";

import { useState } from "react";

type SeatStatus = "available" | "occupied" | "selected" | "exit" | "business";

interface Seat {
  id: string;
  row: number;
  col: string;
  status: SeatStatus;
}

interface SeatMapProps {
  flightNumber?: string;
  origin?: string;
  destination?: string;
  totalSeats?: number;
  availableSeats?: number;
  occupiedSeats?: number;
  rows?: number;
  seatsPerRow?: number;
  exitRows?: number[];
  businessClassRows?: number;
}

function generateSeats(
  rows: number,
  seatsPerRow: number,
  availableCount: number,
  exitRows: number[],
  businessClassRows: number,
): Seat[] {
  const cols = ["A", "B", "C", "D", "E", "F"].slice(0, seatsPerRow);
  const seats: Seat[] = [];
  let availableRemaining = availableCount;
  const totalSeats = rows * seatsPerRow;
  const occupiedCount = totalSeats - availableCount;
  let occupiedAssigned = 0;

  for (let row = 1; row <= rows; row++) {
    for (const col of cols) {
      const id = `${row}${col}`;
      let status: SeatStatus;

      if (row <= businessClassRows) {
        status = "business";
      } else if (exitRows.includes(row)) {
        status = "exit";
      } else if (availableRemaining > 0) {
        const shouldBeAvailable =
          occupiedAssigned >= occupiedCount ||
          (availableRemaining /
            (availableRemaining + (occupiedCount - occupiedAssigned)) >
            0.5 &&
            (row + col.charCodeAt(0)) % 3 !== 0);

        if (shouldBeAvailable) {
          status = "available";
          availableRemaining--;
        } else {
          status = "occupied";
          occupiedAssigned++;
        }
      } else {
        status = "occupied";
        occupiedAssigned++;
      }

      seats.push({ id, row, col, status });
    }
  }
  return seats;
}

export default function SeatMap({
  flightNumber = "LA3042",
  origin = "GRU",
  destination = "GIG",
  totalSeats = 150,
  availableSeats = 42,
  rows = 25,
  seatsPerRow = 6,
  exitRows = [12, 13],
  businessClassRows = 3,
}: SeatMapProps) {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const occupiedSeats = totalSeats - availableSeats;

  const seats = generateSeats(
    rows,
    seatsPerRow,
    availableSeats,
    exitRows,
    businessClassRows,
  );

  const cols = ["A", "B", "C", "D", "E", "F"].slice(0, seatsPerRow);
  const leftCols = cols.slice(0, seatsPerRow / 2);
  const rightCols = cols.slice(seatsPerRow / 2);

  const getSeatByPos = (row: number, col: string) =>
    seats.find((s) => s.row === row && s.col === col);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "occupied") return;
    setSelectedSeat(selectedSeat === seat.id ? null : seat.id);
  };

  const getSeatColor = (seat: Seat) => {
    if (selectedSeat === seat.id)
      return "bg-blue-500 border-blue-700 text-white scale-110 shadow-lg";
    switch (seat.status) {
      case "available":
        return "bg-emerald-100 border-emerald-400 text-emerald-800 hover:bg-emerald-300 cursor-pointer";
      case "occupied":
        return "bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed";
      case "exit":
        return "bg-amber-100 border-amber-400 text-amber-800 hover:bg-amber-200 cursor-pointer";
      case "business":
        return "bg-indigo-100 border-indigo-400 text-indigo-800 hover:bg-indigo-200 cursor-pointer";
      default:
        return "";
    }
  };

  const occupancyRate = Math.round((occupiedSeats / totalSeats) * 100);

  return (
    <div className="font-sans bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">
              Flight
            </p>
            <p className="text-2xl font-bold tracking-tight">{flightNumber}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-xl font-bold">{origin}</p>
              <p className="text-slate-400 text-xs">Origin</p>
            </div>
            <div className="text-slate-500 text-2xl">→</div>
            <div className="text-center">
              <p className="text-xl font-bold">{destination}</p>
              <p className="text-slate-400 text-xs">Destination</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-slate-200 bg-slate-50 border-b border-slate-200">
        <div className="px-4 py-3 text-center">
          <p className="text-2xl font-bold text-slate-800">{totalSeats}</p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">
            Total Seats
          </p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-2xl font-bold text-emerald-600">
            {availableSeats}
          </p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">
            Available
          </p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-2xl font-bold text-slate-500">{occupiedSeats}</p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">
            Occupied
          </p>
        </div>
      </div>

      <div className="px-6 py-3 bg-white border-b border-slate-100">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Occupancy</span>
          <span>{occupancyRate}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all"
            style={{ width: `${occupancyRate}%` }}
          />
        </div>
      </div>

      <div className="px-4 py-5 overflow-auto">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-8 bg-slate-200 rounded-t-full flex items-center justify-center">
            <span className="text-xs text-slate-400">NOSE</span>
          </div>
        </div>

        <div className="flex items-center gap-1 justify-center mb-2">
          <div className="w-8" />
          <div className="flex gap-1">
            {leftCols.map((col) => (
              <div
                key={col}
                className="w-8 text-center text-xs font-bold text-slate-400"
              >
                {col}
              </div>
            ))}
          </div>
          <div className="w-6" />
          <div className="flex gap-1">
            {rightCols.map((col) => (
              <div
                key={col}
                className="w-8 text-center text-xs font-bold text-slate-400"
              >
                {col}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1 items-center">
          {Array.from({ length: rows }, (_, i) => i + 1).map((row) => {
            const isExitRow = exitRows.includes(row);
            const isBusinessClass = row <= businessClassRows;

            return (
              <div key={row}>
                {isExitRow && (
                  <div className="flex items-center gap-2 my-1 justify-center">
                    <div className="flex-1 h-px bg-amber-300 max-w-xs" />
                    <span className="text-xs text-amber-600 font-medium px-2">
                      EXIT ROW
                    </span>
                    <div className="flex-1 h-px bg-amber-300 max-w-xs" />
                  </div>
                )}
                {isBusinessClass && row === 1 && (
                  <div className="flex items-center gap-2 mb-1 justify-center">
                    <div className="flex-1 h-px bg-indigo-300 max-w-xs" />
                    <span className="text-xs text-indigo-600 font-medium px-2">
                      BUSINESS
                    </span>
                    <div className="flex-1 h-px bg-indigo-300 max-w-xs" />
                  </div>
                )}
                {isBusinessClass && row === businessClassRows + 1 && (
                  <div className="flex items-center gap-2 mb-1 justify-center">
                    <div className="flex-1 h-px bg-slate-300 max-w-xs" />
                    <span className="text-xs text-slate-500 font-medium px-2">
                      ECONOMY
                    </span>
                    <div className="flex-1 h-px bg-slate-300 max-w-xs" />
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <div className="w-8 text-center text-xs text-slate-400 font-mono">
                    {row}
                  </div>
                  <div className="flex gap-1">
                    {leftCols.map((col) => {
                      const seat = getSeatByPos(row, col);
                      if (!seat) return null;
                      return (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          className={`w-8 h-7 rounded-t-lg border text-xs font-medium transition-all duration-150 ${getSeatColor(seat)}`}
                          title={`Seat ${seat.id} - ${seat.status}`}
                        >
                          {selectedSeat === seat.id ? "LS" : ""}
                        </button>
                      );
                    })}
                  </div>
                  <div className="w-6 text-center text-slate-200 text-xs">
                    |
                  </div>
                  <div className="flex gap-1">
                    {rightCols.map((col) => {
                      const seat = getSeatByPos(row, col);
                      if (!seat) return null;
                      return (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          className={`w-8 h-7 rounded-t-lg border text-xs font-medium transition-all duration-150 ${getSeatColor(seat)}`}
                          title={`Seat ${seat.id} - ${seat.status}`}
                        >
                          {selectedSeat === seat.id ? "LS" : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedSeat && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-blue-800 font-semibold text-sm">
              Seat <span className="text-blue-600">{selectedSeat}</span>{" "}
              selected
            </p>
            <p className="text-blue-500 text-xs mt-0.5">
              Click again to deselect
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3 justify-center">
          {[
            { color: "bg-emerald-100 border-emerald-400", label: "Available" },
            { color: "bg-slate-300 border-slate-400", label: "Occupied" },
            { color: "bg-blue-500 border-blue-700", label: "Selected" },
            { color: "bg-amber-100 border-amber-400", label: "Exit Row" },
            { color: "bg-indigo-100 border-indigo-400", label: "Business" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-5 h-4 rounded-t border ${color}`} />
              <span className="text-xs text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
