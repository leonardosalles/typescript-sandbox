import { SeatInventory } from "../domain/SeatInventory";
import { Show } from "../domain/Show";
import { Money } from "../domain/value-objects/Money";
import { ShowId } from "../domain/value-objects/ShowId";
import { ZoneName } from "../domain/value-objects/ZoneName";
import { VenueZone } from "../domain/VenueZone";

export class SeatRange {
  private readonly row: string;
  private readonly first: number;
  private readonly last: number;

  constructor(row: string, first: number, last: number) {
    if (row.trim().length !== 1) {
      throw new Error("Seat row must be a single letter");
    }

    if (
      !Number.isInteger(first) ||
      !Number.isInteger(last) ||
      first <= 0 ||
      last < first
    ) {
      throw new Error("Seat range boundaries are invalid");
    }

    this.row = row.trim().toUpperCase();
    this.first = first;
    this.last = last;
  }

  values(): string[] {
    const values: string[] = [];

    for (let current = this.first; current <= this.last; current += 1) {
      values.push(`${this.row}${current}`);
    }

    return values;
  }
}

export class ShowFixtureBuilder {
  private readonly id: string;
  private readonly title: string;
  private readonly startsAt: Date;
  private readonly zones: VenueZone[];
  private readonly seatsByZone: Map<string, string[]>;

  constructor(id: string, title: string, startsAt: Date) {
    this.id = id;
    this.title = title;
    this.startsAt = new Date(startsAt);
    this.zones = [];
    this.seatsByZone = new Map<string, string[]>();
  }

  withZone(
    name: string,
    priceInCents: number,
    seats: string[],
  ): ShowFixtureBuilder {
    this.zones.push(
      new VenueZone(new ZoneName(name), seats.length, new Money(priceInCents)),
    );
    this.seatsByZone.set(name, [...seats]);
    return this;
  }

  build(): Show {
    return new Show(
      new ShowId(this.id),
      this.title,
      this.startsAt,
      new SeatInventory(this.zones, this.seatsByZone),
    );
  }
}

export function rockFestival(): Show {
  return new ShowFixtureBuilder(
    "SHOW-ROCK-2026",
    "Architecture Rock Festival",
    new Date("2026-09-12T21:00:00.000Z"),
  )
    .withZone("VIP", 25000, new SeatRange("A", 1, 5).values())
    .withZone("FLOOR", 15000, new SeatRange("B", 1, 8).values())
    .withZone("BALCONY", 9000, new SeatRange("C", 1, 10).values())
    .build();
}

export function jazzNight(): Show {
  return new ShowFixtureBuilder(
    "SHOW-JAZZ-2026",
    "Hash Table Jazz Night",
    new Date("2026-10-04T20:30:00.000Z"),
  )
    .withZone("TABLE", 18000, new SeatRange("D", 1, 6).values())
    .withZone("MEZZANINE", 12000, new SeatRange("E", 1, 6).values())
    .build();
}
