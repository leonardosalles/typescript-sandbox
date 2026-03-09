"use client";

import React, { useMemo, useEffect, useRef } from "react";
import { useTambo, useTamboThreadInput } from "@tambo-ai/react";
import type { TamboComponentContent } from "@tambo-ai/react";
import { MOCK_FLIGHT } from "@/lib/mockData";
import PlaneIcon from "@/components/PlaneIcon";

function parseFlightInfo(
  messages: { role: string; content: { type: string; text?: string }[] }[],
) {
  for (const msg of [...messages].reverse()) {
    if (msg.role !== "assistant") continue;
    const text = msg.content
      .filter((p) => p.type === "text")
      .map((p) => p.text ?? "")
      .join(" ");

    const flight = text.match(/Flight[:\s]+([A-Z0-9]+)/i)?.[1];
    const route = text.match(/\(([A-Z]{3})\s*[→\-–>]+\s*([A-Z]{3})\)/);
    const total = text.match(/Total seats[:\s]+(\d+)/i)?.[1];
    const available = text.match(/Available seats[:\s]+(\d+)/i)?.[1];

    if (flight || route || total || available) {
      return {
        flight: flight ?? MOCK_FLIGHT.flightNumber,
        origin: route?.[1] ?? MOCK_FLIGHT.origin,
        destination: route?.[2] ?? MOCK_FLIGHT.destination,
        totalSeats: total ? parseInt(total) : MOCK_FLIGHT.totalSeats,
        availableSeats: available
          ? parseInt(available)
          : MOCK_FLIGHT.availableSeats,
      };
    }
  }
  return {
    flight: MOCK_FLIGHT.flightNumber,
    origin: MOCK_FLIGHT.origin,
    destination: MOCK_FLIGHT.destination,
    totalSeats: MOCK_FLIGHT.totalSeats,
    availableSeats: MOCK_FLIGHT.availableSeats,
  };
}

export default function ChatPage() {
  const { messages, isStreaming, isWaiting } = useTambo();
  const { value, setValue, submit, isPending } = useTamboThreadInput();

  const flightInfo = useMemo(
    () => parseFlightInfo(messages as Parameters<typeof parseFlightInfo>[0]),
    [messages],
  );

  const bottomRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const hasComponent = lastMessage?.content?.some(
      (p) => p.type === "component",
    );
    if (hasComponent && componentRef.current) {
      componentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming, isWaiting]);

  const occupancy = Math.round(
    ((flightInfo.totalSeats - flightInfo.availableSeats) /
      flightInfo.totalSeats) *
      100,
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isPending) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <main className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <PlaneIcon className="w-5 h-5 text-slate-700" />
            Flight Assistant
          </h1>
          <p className="text-slate-500 text-xs">Tambo Generative UI</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-800">
              Leonardo Salles
            </p>
            <p className="text-xs text-slate-400">Passenger</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
            LS
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center mt-16">
              <h2 className="text-slate-700 font-semibold text-xl mb-2">
                Ask about your flight
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                Try asking something like:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "How many seats do we have?",
                  "Show me seat availability",
                  "Seats available in my flight",
                  "What's the seat layout?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setValue(suggestion)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => {
            const isUser = message.role === "user";

            const textContent = message.content
              .filter((p) => p.type === "text")
              .map((p) => ("text" in p ? String(p.text) : ""))
              .join(" ");

            const componentBlocks = message.content.filter(
              (p): p is TamboComponentContent => p.type === "component",
            );

            const hasComponent = componentBlocks.length > 0;

            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"} gap-3`}
              >
                {!isUser && (
                  <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">AI</span>
                  </div>
                )}

                <div
                  className={`max-w-2xl w-full ${isUser ? "items-end" : "items-start"} flex flex-col gap-2`}
                >
                  {textContent && (
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm ${
                        isUser
                          ? "bg-slate-800 text-white rounded-tr-sm"
                          : "bg-white text-slate-700 border border-slate-200 rounded-tl-sm shadow-sm"
                      }`}
                    >
                      {textContent}
                    </div>
                  )}
                  {componentBlocks.map((block, i) =>
                    block.renderedComponent ? (
                      // ref on first component block of the last message
                      <div
                        key={i}
                        ref={i === 0 && hasComponent ? componentRef : undefined}
                        className="w-full mt-1"
                      >
                        {block.renderedComponent}
                      </div>
                    ) : null,
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">LS</span>
                  </div>
                )}
              </div>
            );
          })}

          {(isPending || isStreaming || isWaiting) && (
            <div className="flex justify-start gap-3">
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">AI</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center h-5">
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="flex-shrink-0 bg-white border-t border-slate-200">
        <div className="border-b border-blue-100 bg-blue-50 px-4 py-2">
          <div className="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <PlaneIcon className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-xs text-blue-400 uppercase tracking-widest font-medium leading-none mb-0.5">
                  Next flight
                </p>
                <p className="text-blue-800 font-semibold text-sm">
                  {flightInfo.flight} — {flightInfo.origin} →{" "}
                  {flightInfo.destination}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="text-center">
                <p className="text-blue-800 font-bold">
                  {flightInfo.availableSeats}
                </p>
                <p className="text-blue-400 text-xs">Available</p>
              </div>
              <div className="text-center">
                <p className="text-blue-800 font-bold">
                  {flightInfo.totalSeats}
                </p>
                <p className="text-blue-400 text-xs">Total</p>
              </div>
              <div className="w-20">
                <div className="flex justify-between text-xs text-blue-400 mb-0.5">
                  <span>Occupancy</span>
                  <span>{occupancy}%</span>
                </div>
                <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full transition-all duration-500"
                    style={{ width: `${occupancy}%` }}
                  />
                </div>
              </div>
              <div className="px-2 py-1 bg-emerald-100 rounded-full">
                <p className="text-emerald-700 text-xs font-medium">On Time</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about seats, availability, flight layout..."
              disabled={isPending}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent disabled:opacity-50 transition-all"
            />
            <button
              onClick={() => submit()}
              disabled={isPending || !value.trim()}
              className="px-5 py-3 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
