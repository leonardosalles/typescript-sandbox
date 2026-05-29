import { GuitarSpec } from "../GuitarSpec";
import { Finish, OperatingSystem, PickupSet, ToneWood } from "../GuitarTypes";
import { dollars, Money } from "../value-objects/Money";

export interface PricingStrategy {
  price(spec: GuitarSpec): Money;
}

export class ComponentPricingStrategy implements PricingStrategy {
  private readonly wood = new Map<ToneWood, number>([
    [ToneWood.Alder, 180],
    [ToneWood.Mahogany, 280],
    [ToneWood.Maple, 240],
    [ToneWood.Rosewood, 360],
    [ToneWood.Spruce, 220],
  ]);

  private readonly pickups = new Map<PickupSet, number>([
    [PickupSet.SingleCoil, 190],
    [PickupSet.Humbucker, 260],
    [PickupSet.P90, 240],
    [PickupSet.Piezo, 220],
    [PickupSet.JazzBass, 230],
  ]);

  private readonly finish = new Map<Finish, number>([
    [Finish.Sunburst, 240],
    [Finish.OceanBlue, 210],
    [Finish.RacingGreen, 230],
    [Finish.MatteBlack, 180],
    [Finish.Natural, 160],
  ]);

  price(spec: GuitarSpec): Money {
    const base = 900;
    const handedFee = spec.leftHanded ? 125 : 0;
    const stringFee = Math.max(0, spec.strings - 6) * 70;
    const osFee = spec.operatingSystem === OperatingSystem.Analog ? 0 : 310;
    const total =
      base +
      this.require(this.wood, spec.toneWood) +
      this.require(this.pickups, spec.pickupSet) +
      this.require(this.finish, spec.finish) +
      handedFee +
      stringFee +
      osFee;

    return dollars(total);
  }

  private require<T>(table: Map<T, number>, key: T): number {
    const value = table.get(key);
    if (value === undefined)
      throw new Error(`Missing price for ${String(key)}`);
    return value;
  }
}
