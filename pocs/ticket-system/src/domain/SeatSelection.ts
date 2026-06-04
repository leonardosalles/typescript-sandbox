import { SeatNumber } from "./value-objects/SeatNumber";
import { ZoneName } from "./value-objects/ZoneName";

export class SeatSelection {
  readonly zone: ZoneName;
  readonly seatNumber: SeatNumber;

  constructor(zone: ZoneName, seatNumber: SeatNumber) {
    this.zone = zone;
    this.seatNumber = seatNumber;
  }

  key(): string {
    return `${this.zone.asString()}::${this.seatNumber.asString()}`;
  }
}
