"use client";

interface FlightDurationProps {
  flightNumber?: string;
  origin?: string;
  destination?: string;
  originCity?: string;
  destinationCity?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  date?: string;
}

export default function FlightDuration({
  flightNumber,
  origin,
  destination,
  originCity,
  destinationCity,
  departureTime,
  arrivalTime,
  duration,
  date,
}: FlightDurationProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-lg w-full">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 text-white flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-0.5">
            Flight
          </p>
          <p className="text-xl font-bold tracking-tight">{flightNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-0.5">
            Date
          </p>
          <p className="text-sm font-medium">{date}</p>
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-2 min-w-[72px]">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-slate-700"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
            <p className="text-2xl font-bold text-slate-800 tabular-nums">
              {departureTime}
            </p>
            <p className="text-lg font-bold text-slate-700">{origin}</p>
            <p className="text-xs text-slate-400 text-center leading-tight">
              {originCity}
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex items-center gap-1 px-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-px bg-slate-300"
                  style={{
                    borderTop: "2px dashed #cbd5e1",
                    background: "none",
                  }}
                />
              ))}
            </div>
            <div className="bg-slate-100 border border-slate-200 rounded-full px-3 py-1">
              <p className="text-xs font-semibold text-slate-600 tabular-nums">
                {duration}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 min-w-[72px]">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-slate-400"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
            <p className="text-2xl font-bold text-slate-800 tabular-nums">
              {arrivalTime}
            </p>
            <p className="text-lg font-bold text-slate-700">{destination}</p>
            <p className="text-xs text-slate-400 text-center leading-tight">
              {destinationCity}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 flex items-center justify-center gap-1">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-3.5 h-3.5 text-slate-400"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-xs text-slate-500">
          Total flight duration:{" "}
          <span className="font-semibold text-slate-700">{duration}</span>
        </p>
      </div>
    </div>
  );
}
