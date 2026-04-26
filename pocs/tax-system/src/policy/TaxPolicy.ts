import { TaxContext, USState } from "../domain/Entities";
import { TaxBreakdown } from "../domain/TaxResult";

export interface TaxPolicy {
  readonly name: string;
  readonly description: string;
  applies(context: TaxContext): boolean;
  compute(context: TaxContext, breakdown: TaxBreakdown): void;
}

export abstract class StateTaxPolicy implements TaxPolicy {
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly coveredState: USState;

  applies(context: TaxContext): boolean {
    return (
      this.appliesToState(context) &&
      this.appliesToYear(context) &&
      this.appliesToCategory(context)
    );
  }

  protected abstract appliesToState(context: TaxContext): boolean;
  protected abstract appliesToYear(context: TaxContext): boolean;
  protected abstract appliesToCategory(context: TaxContext): boolean;

  abstract compute(context: TaxContext, breakdown: TaxBreakdown): void;
}

export class CompositeTaxPolicy implements TaxPolicy {
  readonly name = "CompositeTaxPolicy";
  readonly description = "Combines multiple tax policies";

  private readonly policies: TaxPolicy[];

  constructor(...policies: TaxPolicy[]) {
    this.policies = policies;
  }

  applies(context: TaxContext): boolean {
    return this.policies.some((p) => p.applies(context));
  }

  compute(context: TaxContext, breakdown: TaxBreakdown): void {
    for (const policy of this.policies) {
      if (policy.applies(context)) {
        policy.compute(context, breakdown);
      }
    }
  }
}

export class ExemptionPolicy implements TaxPolicy {
  readonly name: string;
  readonly description: string;

  constructor(
    name: string,
    description: string,
    private readonly exemptionPredicate: (context: TaxContext) => boolean,
  ) {
    this.name = name;
    this.description = description;
  }

  applies(context: TaxContext): boolean {
    return this.exemptionPredicate(context);
  }

  compute(_context: TaxContext, _breakdown: TaxBreakdown): void {}

  isExempt(context: TaxContext): boolean {
    return this.applies(context);
  }
}
