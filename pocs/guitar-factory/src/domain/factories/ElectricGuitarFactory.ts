import { GuitarFamily } from "../GuitarTypes";
import { CustomShopFactory } from "./CustomShopFactory";

export class ElectricGuitarFactory extends CustomShopFactory {
  readonly family = GuitarFamily.Electric;
}
