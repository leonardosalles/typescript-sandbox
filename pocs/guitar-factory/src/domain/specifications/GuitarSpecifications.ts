import { Guitar } from "../Guitar";
import { Finish, GuitarFamily, PickupSet } from "../GuitarTypes";
import { Specification } from "./Specification";

export class FamilySpecification implements Specification<Guitar> {
  constructor(private readonly family: GuitarFamily) {}

  isSatisfiedBy(candidate: Guitar): boolean {
    return candidate.spec.family === this.family;
  }
}

export class FinishSpecification implements Specification<Guitar> {
  constructor(private readonly finish: Finish) {}

  isSatisfiedBy(candidate: Guitar): boolean {
    return candidate.spec.finish === this.finish;
  }
}

export class PickupSpecification implements Specification<Guitar> {
  constructor(private readonly pickup: PickupSet) {}

  isSatisfiedBy(candidate: Guitar): boolean {
    return candidate.spec.pickupSet === this.pickup;
  }
}
