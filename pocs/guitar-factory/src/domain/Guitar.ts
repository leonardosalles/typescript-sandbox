import { BuildStage, GuitarSnapshot } from "./GuitarTypes";
import { GuitarSpec } from "./GuitarSpec";
import { Money } from "./value-objects/Money";
import { SerialNumber } from "./value-objects/SerialNumber";

export class Guitar {
  private stage: BuildStage;

  constructor(
    readonly serial: SerialNumber,
    readonly spec: GuitarSpec,
    private readonly price: Money,
    stage = BuildStage.Reserved,
  ) {
    this.stage = stage;
  }

  advanceTo(stage: BuildStage): void {
    const order = Object.values(BuildStage);
    const current = order.indexOf(this.stage);
    const next = order.indexOf(stage);

    if (next < current)
      throw new Error("Guitar build stage cannot move backwards");

    this.stage = stage;
  }

  currentStage(): BuildStage {
    return this.stage;
  }

  totalPrice(): Money {
    return this.price;
  }

  snapshot(): GuitarSnapshot {
    return {
      ...this.spec.toInput(),
      serial: this.serial.toString(),
      price: this.price.format(),
      stage: this.stage,
    };
  }
}
