import { useMemo, useState } from "react";
import { FixedClock } from "../application/Clock";
import { SequentialOrderIdGenerator } from "../application/OrderIdGenerator";
import { TicketSeller } from "../application/TicketSeller";
import { MaximumCapacityPolicy } from "../domain/policies/MaximumCapacityPolicy";
import { SeatSelection } from "../domain/SeatSelection";
import { SeatSnapshot, SeatStatus, SaleChannel } from "../domain/TicketTypes";
import { TicketOrder } from "../domain/TicketOrder";
import { SeatNumber } from "../domain/value-objects/SeatNumber";
import { ShowId } from "../domain/value-objects/ShowId";
import { ZoneName } from "../domain/value-objects/ZoneName";
import { jazzNight, rockFestival } from "../fixtures/TicketFixtures";
import { InMemoryShowRepository } from "../infrastructure/InMemoryShowRepository";

type AppServices = {
  readonly repository: InMemoryShowRepository;
  readonly seller: TicketSeller;
};

function createServices(): AppServices {
  const repository = new InMemoryShowRepository([rockFestival(), jazzNight()]);

  return {
    repository,
    seller: new TicketSeller(
      repository,
      new MaximumCapacityPolicy(),
      new SequentialOrderIdGenerator("WEB"),
      new FixedClock(new Date("2026-06-09T12:00:00.000Z")),
    ),
  };
}

function seatKey(seat: SeatSnapshot): string {
  return `${seat.zone}::${seat.seatNumber}`;
}

function channelLabel(channel: SaleChannel): string {
  switch (channel) {
    case SaleChannel.BoxOffice:
      return "Box office";
    case SaleChannel.Online:
      return "Online";
    case SaleChannel.Partner:
      return "Partner";
  }
}

export function App() {
  const services = useMemo(() => createServices(), []);
  const shows = services.repository.all();
  const [selectedShowId, setSelectedShowId] = useState(
    shows[0]?.id.asString() ?? "",
  );
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState("Leonardo Salles");
  const [channel, setChannel] = useState<SaleChannel>(SaleChannel.Online);
  const [orders, setOrders] = useState<TicketOrder[]>([]);
  const [message, setMessage] = useState("Ready to sell tickets");
  const [renderVersion, setRenderVersion] = useState(0);

  const selectedShow = services.repository.findById(new ShowId(selectedShowId));
  const availableShows = services.repository.all();
  const seats = selectedShow?.seatSnapshots() ?? [];
  const zones = selectedShow?.capacitySnapshots() ?? [];
  const selectedSeatInputs = selectedSeats.map((key) => {
    const [zone, seatNumber] = key.split("::");
    return { zone, seatNumber };
  });

  const quotedTotal = (() => {
    if (!selectedShow || selectedSeatInputs.length === 0) {
      return "$0.00";
    }

    try {
      const selections = selectedSeatInputs.map(
        (seat) =>
          new SeatSelection(
            new ZoneName(seat.zone),
            new SeatNumber(seat.seatNumber),
          ),
      );
      return selectedShow.quote(selections).format();
    } catch {
      return "$0.00";
    }
  })();

  function switchShow(showId: string): void {
    setSelectedShowId(showId);
    setSelectedSeats([]);
    setMessage("Ready to sell tickets");
  }

  function toggleSeat(seat: SeatSnapshot): void {
    if (seat.status === SeatStatus.Sold) {
      return;
    }

    const key = seatKey(seat);
    setSelectedSeats((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  }

  function sellTickets(): void {
    try {
      const order = services.seller.sell({
        showId: selectedShowId,
        customerName,
        channel,
        seats: selectedSeatInputs,
      });

      setOrders((current) => [order, ...current]);
      setSelectedSeats([]);
      setMessage(`Sold ${order.tickets.length} ticket(s) in ${order.id}`);
      setRenderVersion((current) => current + 1);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not sell tickets",
      );
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 text-zinc-950">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[280px_1fr_360px]">
        <aside className="space-y-4">
          <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <h1 className="text-xl font-semibold">Ticket System POC</h1>
            <p className="mt-1 text-sm text-zinc-500">
              OOAD ticket sales workbench
            </p>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Shows
            </h2>
            <div className="mt-3 space-y-2">
              {availableShows.map((show) => (
                <button
                  key={show.id.asString()}
                  className={`w-full rounded-md border px-3 py-3 text-left transition ${
                    show.id.asString() === selectedShowId
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-zinc-200 bg-white hover:border-zinc-400"
                  }`}
                  onClick={() => switchShow(show.id.asString())}
                  type="button"
                >
                  <span className="block text-sm font-semibold">
                    {show.title}
                  </span>
                  <span className="mt-1 block text-xs opacity-75">
                    {show.startsAt.toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Capacity
            </h2>
            <div className="mt-3 space-y-3">
              {zones.map((zone) => (
                <div key={`${zone.zone}-${renderVersion}`}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{zone.zone}</span>
                    <span className="text-zinc-500">
                      {zone.available}/{zone.capacity}
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-zinc-100">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{
                        width: `${(zone.available / zone.capacity) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{selectedShow?.title}</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Choose exact seats by venue zone
              </p>
            </div>
            <div className="rounded-md bg-zinc-100 px-3 py-2 text-sm font-semibold">
              {selectedSeats.length} selected
            </div>
          </div>

          <div className="mt-5 space-y-6">
            {zones.map((zone) => {
              const zoneSeats = seats
                .filter((seat) => seat.zone === zone.zone)
                .sort((left, right) =>
                  left.seatNumber.localeCompare(right.seatNumber),
                );

              return (
                <div key={zone.zone}>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{zone.zone}</h3>
                    <span className="text-xs text-zinc-500">
                      {zone.available} available
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
                    {zoneSeats.map((seat) => {
                      const key = seatKey(seat);
                      const isSelected = selectedSeats.includes(key);
                      const isSold = seat.status === SeatStatus.Sold;

                      return (
                        <button
                          key={`${key}-${renderVersion}`}
                          className={`aspect-square rounded-md border text-sm font-semibold transition ${
                            isSold
                              ? "cursor-not-allowed border-zinc-200 bg-zinc-200 text-zinc-400"
                              : isSelected
                                ? "border-emerald-700 bg-emerald-600 text-white"
                                : "border-zinc-300 bg-white text-zinc-800 hover:border-emerald-500"
                          }`}
                          disabled={isSold}
                          onClick={() => toggleSeat(seat)}
                          type="button"
                        >
                          {seat.seatNumber}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Sale
            </h2>

            <label
              className="mt-4 block text-sm font-medium"
              htmlFor="customerName"
            >
              Customer
            </label>
            <input
              id="customerName"
              className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950"
              onChange={(event) => setCustomerName(event.target.value)}
              value={customerName}
            />

            <label className="mt-4 block text-sm font-medium" htmlFor="channel">
              Channel
            </label>
            <select
              id="channel"
              className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950"
              onChange={(event) =>
                setChannel(event.target.value as SaleChannel)
              }
              value={channel}
            >
              {Object.values(SaleChannel).map((saleChannel) => (
                <option key={saleChannel} value={saleChannel}>
                  {channelLabel(saleChannel)}
                </option>
              ))}
            </select>

            <div className="mt-4 rounded-md bg-zinc-100 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Tickets</span>
                <span className="font-semibold">{selectedSeats.length}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-zinc-500">Total</span>
                <span className="font-semibold">{quotedTotal}</span>
              </div>
            </div>

            <button
              className="mt-4 w-full rounded-md bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
              disabled={selectedSeats.length === 0}
              onClick={sellTickets}
              type="button"
            >
              Sell tickets
            </button>

            <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {message}
            </p>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Orders
            </h2>
            <div className="mt-3 space-y-3">
              {orders.length === 0 ? (
                <p className="text-sm text-zinc-500">No orders yet</p>
              ) : (
                orders.map((order) => (
                  <article
                    key={order.id}
                    className="rounded-md border border-zinc-200 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold">{order.id}</h3>
                      <span className="text-sm font-semibold">
                        {order.total().format()}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">
                      {order.customerName} · {channelLabel(order.channel)}
                    </p>
                    <p className="mt-2 text-sm text-zinc-700">
                      {order.tickets
                        .map((ticket) => ticket.seatLabel)
                        .join(", ")}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
