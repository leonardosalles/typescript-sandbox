export interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean;
}

export class AndSpecification<T> implements Specification<T> {
  constructor(private readonly specs: Specification<T>[]) {}

  isSatisfiedBy(candidate: T): boolean {
    return this.specs.every((spec) => spec.isSatisfiedBy(candidate));
  }
}
