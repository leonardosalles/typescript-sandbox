import { Guitar } from "../domain/Guitar";
import { GuitarSpec } from "../domain/GuitarSpec";
import { BuildStage, GuitarSpecInput } from "../domain/GuitarTypes";
import { ProductionLineEvents } from "../domain/events/ProductionEvent";
import { Inventory } from "../infrastructure/InMemoryInventory";
import { FactoryCatalog } from "../infrastructure/FactoryCatalog";

export class GuitarFactorySystem {
  constructor(
    private readonly catalog: FactoryCatalog,
    private readonly inventory: Inventory,
    private readonly events: ProductionLineEvents,
  ) {}

  create(input: GuitarSpecInput): Guitar {
    const spec = new GuitarSpec(input);
    const builder = this.catalog.findFor(spec).builderFor(spec);
    const guitar = builder
      .bodyCut()
      .neckCarved()
      .electronicsInstalled()
      .finished()
      .qualityChecked();

    this.publish(guitar, BuildStage.Reserved, 5);
    this.publish(guitar, BuildStage.BodyCut, 25);
    this.publish(guitar, BuildStage.NeckCarved, 45);
    this.publish(guitar, BuildStage.ElectronicsInstalled, 68);
    this.publish(guitar, BuildStage.Finished, 86);
    this.publish(guitar, BuildStage.QualityChecked, 100);
    this.inventory.add(guitar);

    return guitar;
  }

  inventorySnapshot() {
    return this.inventory.all().map((guitar) => guitar.snapshot());
  }

  private publish(guitar: Guitar, stage: BuildStage, progress: number): void {
    this.events.publish({
      serial: guitar.serial.toString(),
      stage,
      progress,
      message: `${guitar.spec.model} reached ${stage}`,
    });
  }
}
