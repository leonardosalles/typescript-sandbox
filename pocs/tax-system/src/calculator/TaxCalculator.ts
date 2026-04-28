import { TaxContext, USState, TaxYear } from "../domain/Entities";
import { Money } from "../domain/Money";
import { TaxResult, TaxBreakdown } from "../domain/TaxResult";
import { TaxPolicyRegistry } from "../registry/TaxPolicyRegistry";

export class TaxCalculator {
  constructor(private readonly registry: TaxPolicyRegistry) {}

  calculate(context: TaxContext): TaxResult {
    const basePrice = Money.ofCents(
      context.product.priceInCents * context.quantity,
    );

    if (this.registry.isExempt(context)) {
      return new TaxResult(context, basePrice, new TaxBreakdown(), true);
    }

    const breakdown = new TaxBreakdown();
    const policies = this.registry.applicablePolicies(context);

    for (const policy of policies) {
      policy.compute(context, breakdown);
    }

    return new TaxResult(context, basePrice, breakdown);
  }

  compareAcrossStates(context: TaxContext, states: USState[]): TaxResult[] {
    return states.map((state) => {
      const adjusted = new TaxContext(
        context.product,
        state,
        context.year,
        context.quantity,
      );
      return this.calculate(adjusted);
    });
  }

  compareAcrossYears(context: TaxContext, years: TaxYear[]): TaxResult[] {
    return years.map((year) => {
      const adjusted = new TaxContext(
        context.product,
        context.state,
        year,
        context.quantity,
      );
      return this.calculate(adjusted);
    });
  }
}
