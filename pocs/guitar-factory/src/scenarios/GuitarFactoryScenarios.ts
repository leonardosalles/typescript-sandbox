import { createGuitarFactorySystem } from "../application/createGuitarFactorySystem";
import {
  BodyShape,
  Finish,
  GuitarFamily,
  OperatingSystem,
  PickupSet,
  ToneWood,
} from "../domain/GuitarTypes";
import { ProductionEvent } from "../domain/events/ProductionEvent";

const { system, events } = createGuitarFactorySystem();

events.subscribe({
  update(event: ProductionEvent): void {
    console.log(`${event.progress}% ${event.serial} ${event.stage}`);
  },
});

const orders = [
  {
    family: GuitarFamily.Electric,
    model: "Aurora Custom",
    bodyShape: BodyShape.Strat,
    toneWood: ToneWood.Alder,
    pickupSet: PickupSet.SingleCoil,
    finish: Finish.Sunburst,
    operatingSystem: OperatingSystem.StudioLink,
    strings: 6,
    leftHanded: false,
  },
  {
    family: GuitarFamily.Acoustic,
    model: "Cedar Room",
    bodyShape: BodyShape.Dreadnought,
    toneWood: ToneWood.Spruce,
    pickupSet: PickupSet.Piezo,
    finish: Finish.Natural,
    operatingSystem: OperatingSystem.SmartStage,
    strings: 12,
    leftHanded: false,
  },
  {
    family: GuitarFamily.Bass,
    model: "Metro Low",
    bodyShape: BodyShape.JazzBass,
    toneWood: ToneWood.Maple,
    pickupSet: PickupSet.JazzBass,
    finish: Finish.MatteBlack,
    operatingSystem: OperatingSystem.Analog,
    strings: 5,
    leftHanded: true,
  },
];

const built = orders.map((order) => system.create(order));

console.log("\nBuilt guitars");
built.forEach((guitar) => console.log(guitar.snapshot()));
console.log(`\nInventory size: ${system.inventorySnapshot().length}`);
