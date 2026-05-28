import { Guitar } from "./Guitar";
import { GuitarSpec } from "./GuitarSpec";
import { BuildStage } from "./GuitarTypes";
import { Money } from "./value-objects/Money";
import { SerialNumber } from "./value-objects/SerialNumber";

export class GuitarBuilder {
  private stage = BuildStage.Reserved;

  constructor(
    private readonly spec: GuitarSpec,
    private readonly serial: SerialNumber,
    private readonly price: Money,
  ) {}

  bodyCut(): GuitarBuilder {
    this.stage = BuildStage.BodyCut;
    return this;
  }

  neckCarved(): GuitarBuilder {
    this.stage = BuildStage.NeckCarved;
    return this;
  }

  electronicsInstalled(): GuitarBuilder {
    this.stage = BuildStage.ElectronicsInstalled;
    return this;
  }

  finished(): GuitarBuilder {
    this.stage = BuildStage.Finished;
    return this;
  }

  qualityChecked(): Guitar {
    this.stage = BuildStage.QualityChecked;
    return new Guitar(this.serial, this.spec, this.price, this.stage);
  }
}
