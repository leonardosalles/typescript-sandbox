export enum GuitarFamily {
  Electric = "Electric",
  Acoustic = "Acoustic",
  Bass = "Bass",
}

export enum BodyShape {
  Strat = "Strat",
  LesPaul = "Les Paul",
  Tele = "Tele",
  Dreadnought = "Dreadnought",
  JazzBass = "Jazz Bass",
}

export enum ToneWood {
  Alder = "Alder",
  Mahogany = "Mahogany",
  Maple = "Maple",
  Rosewood = "Rosewood",
  Spruce = "Spruce",
}

export enum PickupSet {
  SingleCoil = "Single Coil",
  Humbucker = "Humbucker",
  P90 = "P90",
  Piezo = "Piezo",
  JazzBass = "Jazz Bass",
}

export enum Finish {
  Sunburst = "Sunburst",
  OceanBlue = "Ocean Blue",
  RacingGreen = "Racing Green",
  MatteBlack = "Matte Black",
  Natural = "Natural",
}

export enum OperatingSystem {
  Analog = "Analog Tone Circuit",
  SmartStage = "Smart Stage OS",
  StudioLink = "Studio Link OS",
}

export enum BuildStage {
  Reserved = "Reserved",
  BodyCut = "Body Cut",
  NeckCarved = "Neck Carved",
  ElectronicsInstalled = "Electronics Installed",
  Finished = "Finished",
  QualityChecked = "Quality Checked",
}

export type GuitarSpecInput = {
  family: GuitarFamily;
  model: string;
  bodyShape: BodyShape;
  toneWood: ToneWood;
  pickupSet: PickupSet;
  finish: Finish;
  operatingSystem: OperatingSystem;
  strings: number;
  leftHanded: boolean;
};

export type GuitarSnapshot = GuitarSpecInput & {
  serial: string;
  price: string;
  stage: BuildStage;
};
