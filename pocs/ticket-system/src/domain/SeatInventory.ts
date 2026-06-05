import { HashTable } from "./collections/HashTable";
import { StringHashFunction } from "./collections/HashFunction";
import { Seat } from "./Seat";
import { SeatSelection } from "./SeatSelection";
import { CapacitySnapshot, SeatSnapshot } from "./TicketTypes";
import { SeatNumber } from "./value-objects/SeatNumber";
import { VenueZone } from "./VenueZone";

export class SeatInventory {
  private readonly zones: HashTable<string, VenueZone>;
  private readonly seats: HashTable<string, Seat>;

  constructor(zones: VenueZone[], seatNumbersByZone: Map<string, string[]>) {
    const stringHash = new StringHashFunction();
    this.zones = new HashTable<string, VenueZone>(stringHash, stringHash);
    this.seats = new HashTable<string, Seat>(stringHash, stringHash);

    for (const zone of zones) {
      const zoneKey = zone.name.asString();
      const seatNumbers = seatNumbersByZone.get(zoneKey) ?? [];

      if (seatNumbers.length !== zone.capacity) {
        throw new Error(
          `Zone ${zoneKey} expected ${zone.capacity} seats but received ${seatNumbers.length}`,
        );
      }

      this.zones.set(zoneKey, zone);

      for (const rawSeatNumber of seatNumbers) {
        const selection = new SeatSelection(
          zone.name,
          new SeatNumber(rawSeatNumber),
        );

        if (this.seats.has(selection.key())) {
          throw new Error(`Duplicated seat ${selection.key()}`);
        }

        this.seats.set(
          selection.key(),
          new Seat(zone.name, selection.seatNumber),
        );
      }
    }
  }

  assertCanSell(selections: SeatSelection[]): void {
    if (selections.length === 0) {
      throw new Error("At least one seat must be selected");
    }

    const seen = new HashTable<string, boolean>(
      new StringHashFunction(),
      new StringHashFunction(),
    );

    for (const selection of selections) {
      if (seen.has(selection.key())) {
        throw new Error(`Duplicated selection ${selection.key()}`);
      }

      seen.set(selection.key(), true);
      const seat = this.seats.get(selection.key());

      if (!seat) {
        throw new Error(`Seat ${selection.key()} does not exist`);
      }

      if (!seat.isAvailable()) {
        throw new Error(`Seat ${selection.key()} is not available`);
      }
    }
  }

  sell(selections: SeatSelection[]): Seat[] {
    this.assertCanSell(selections);

    return selections.map((selection) => {
      const seat = this.seats.get(selection.key());

      if (!seat) {
        throw new Error(`Seat ${selection.key()} does not exist`);
      }

      seat.sell();
      return seat;
    });
  }

  totalFor(selections: SeatSelection[]): number {
    return selections.reduce((total, selection) => {
      const zone = this.zones.get(selection.zone.asString());

      if (!zone) {
        throw new Error(`Zone ${selection.zone.asString()} does not exist`);
      }

      return total + zone.price.asCents();
    }, 0);
  }

  capacitySnapshots(): CapacitySnapshot[] {
    return this.zones.values().map((zone) => {
      const zoneSeats = this.seats
        .values()
        .filter((seat) => seat.zone.equals(zone.name));
      const sold = zoneSeats.filter((seat) => !seat.isAvailable()).length;

      return {
        zone: zone.name.asString(),
        capacity: zone.capacity,
        sold,
        available: zone.capacity - sold,
      };
    });
  }

  seatSnapshots(): SeatSnapshot[] {
    return this.seats.values().map((seat) => ({
      zone: seat.zone.asString(),
      seatNumber: seat.number.asString(),
      label: seat.label(),
      status: seat.snapshotStatus(),
    }));
  }
}
