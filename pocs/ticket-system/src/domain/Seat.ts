import { SeatStatus } from "./TicketTypes";
import { SeatNumber } from "./value-objects/SeatNumber";
import { ZoneName } from "./value-objects/ZoneName";

export class Seat {
  private status: SeatStatus;
  readonly zone: ZoneName;
  readonly number: SeatNumber;

  constructor(zone: ZoneName, number: SeatNumber) {
    this.zone = zone;
    this.number = number;
    this.status = SeatStatus.Available;
  }

  sell(): void {
    if (this.status === SeatStatus.Sold) {
      throw new Error(`Seat ${this.label()} is already sold`);
    }

    this.status = SeatStatus.Sold;
  }

  isAvailable(): boolean {
    return this.status === SeatStatus.Available;
  }

  snapshotStatus(): SeatStatus {
    return this.status;
  }

  label(): string {
    return `${this.zone.asString()}-${this.number.asString()}`;
  }
}
