import { createGuitarFactorySystem } from "../application/createGuitarFactorySystem";
import { defaultElectricSpec } from "../domain/defaultGuitarSpecs";
import { GuitarSpec } from "../domain/GuitarSpec";
import {
  BodyShape,
  Finish,
  GuitarFamily,
  OperatingSystem,
  PickupSet,
  ToneWood,
} from "../domain/GuitarTypes";
import { ComponentPricingStrategy } from "../domain/strategies/PricingStrategy";
import {
  FamilySpecification,
  PickupSpecification,
} from "../domain/specifications/GuitarSpecifications";
import { AndSpecification } from "../domain/specifications/Specification";

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected)
    throw new Error(`Expected ${String(expected)}, got ${String(actual)}`);
}

function assertOk(value: boolean, message: string): void {
  if (!value) throw new Error(message);
}

const { system, inventory } = createGuitarFactorySystem();
const pricing = new ComponentPricingStrategy();

const electric = defaultElectricSpec().with({
  model: "Neon Haze",
  pickupSet: PickupSet.Humbucker,
  finish: Finish.OceanBlue,
});

const bass = new GuitarSpec({
  family: GuitarFamily.Bass,
  model: "Low Tide",
  bodyShape: BodyShape.JazzBass,
  toneWood: ToneWood.Maple,
  pickupSet: PickupSet.JazzBass,
  finish: Finish.RacingGreen,
  operatingSystem: OperatingSystem.SmartStage,
  strings: 5,
  leftHanded: true,
});

const electricGuitar = system.create(electric.toInput());
const bassGuitar = system.create(bass.toInput());

assertEqual(inventory.count(), 2);
assertEqual(electricGuitar.currentStage(), "Quality Checked");
assertOk(
  pricing.price(bass).asCents() > pricing.price(electric).asCents(),
  "Left-handed five-string bass should cost more than the electric reference",
);

const bassInventory = inventory.matching(
  new AndSpecification([
    new FamilySpecification(GuitarFamily.Bass),
    new PickupSpecification(PickupSet.JazzBass),
  ]),
);

assertEqual(bassInventory[0].serial.toString(), bassGuitar.serial.toString());

assertEqual(
  electric.with({ bodyShape: BodyShape.Dreadnought }).bodyShape,
  BodyShape.Strat,
);
assertEqual(
  electric.with({ pickupSet: PickupSet.Piezo }).pickupSet,
  PickupSet.Humbucker,
);
assertEqual(bass.with({ strings: 7 }).strings, 4);
assertEqual(electric.with({ model: "x" }).model, "Electric Custom");

console.log("Guitar factory rule tests passed");
