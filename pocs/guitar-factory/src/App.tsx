import { useEffect, useMemo, useState } from "react";
import { createGuitarFactorySystem } from "./application/createGuitarFactorySystem";
import { defaultElectricSpec } from "./domain/defaultGuitarSpecs";
import { GuitarSpec } from "./domain/GuitarSpec";
import {
  BuildStage,
  GuitarSpecInput,
  GuitarSnapshot,
} from "./domain/GuitarTypes";
import {
  ProductionEvent,
  ProductionLineEvents,
} from "./domain/events/ProductionEvent";
import { ComponentPricingStrategy } from "./domain/strategies/PricingStrategy";
import { MagneticPickupStrategy } from "./domain/strategies/PickupStrategy";
import { ConfigPanel } from "./ui/components/ConfigPanel";
import { GuitarViewport } from "./ui/components/GuitarViewport";
import { InventoryPanel } from "./ui/components/InventoryPanel";

const progressByStage = new Map<BuildStage, number>([
  [BuildStage.Reserved, 5],
  [BuildStage.BodyCut, 25],
  [BuildStage.NeckCarved, 45],
  [BuildStage.ElectronicsInstalled, 68],
  [BuildStage.Finished, 86],
  [BuildStage.QualityChecked, 100],
]);

function App() {
  const [spec, setSpec] = useState(defaultElectricSpec());
  const [progress, setProgress] = useState(18);
  const [inventory, setInventory] = useState<GuitarSnapshot[]>([]);
  const [selectedSerial, setSelectedSerial] = useState<string | null>(null);
  const [eventLog, setEventLog] = useState<string[]>([]);

  const events = useMemo(() => new ProductionLineEvents(), []);
  const factory = useMemo(() => createGuitarFactorySystem(events), [events]);
  const pricing = useMemo(() => new ComponentPricingStrategy(), []);
  const pickups = useMemo(() => new MagneticPickupStrategy(), []);
  const tone = pickups.tone(spec);
  const price = pricing.price(spec).format();

  useEffect(() => {
    const observer = {
      update(event: ProductionEvent) {
        setProgress(progressByStage.get(event.stage) ?? event.progress);
        setEventLog((current) => [event.message, ...current].slice(0, 7));
      },
    };

    return events.subscribe(observer);
  }, [events]);

  function changeSpec(input: GuitarSpecInput) {
    try {
      setSpec(new GuitarSpec(input));
      setSelectedSerial(null);
      setProgress(24);
    } catch (error) {
      setEventLog((current) =>
        [
          error instanceof Error ? error.message : "Invalid guitar spec",
          ...current,
        ].slice(0, 7),
      );
    }
  }

  function build() {
    const guitar = factory.system.create(spec.toInput());
    setInventory(factory.system.inventorySnapshot());
    setSpec(guitar.spec);
    setSelectedSerial(guitar.serial.toString());
  }

  function selectInventoryGuitar(guitar: GuitarSnapshot) {
    setSpec(new GuitarSpec(guitar));
    setSelectedSerial(guitar.serial);
    setProgress(progressByStage.get(guitar.stage) ?? 100);
  }

  function reset() {
    setSpec(defaultElectricSpec());
    setSelectedSerial(null);
    setProgress(18);
    setEventLog([]);
  }

  return (
    <main className="app-shell">
      <ConfigPanel
        spec={spec}
        onChange={changeSpec}
        onBuild={build}
        onReset={reset}
      />
      <GuitarViewport spec={spec} progress={progress} />
      <InventoryPanel
        inventory={inventory}
        selectedSerial={selectedSerial}
        tone={tone}
        price={price}
        eventLog={eventLog}
        onSelect={selectInventoryGuitar}
      />
    </main>
  );
}

export default App;
