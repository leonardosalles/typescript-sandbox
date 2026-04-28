import {
  USState,
  ProductCategory,
  TaxContext,
  TaxYear,
} from "../domain/Entities";
import { TaxRate } from "../domain/TaxRate";
import { Money } from "../domain/Money";
import { TaxBreakdown, TaxLineItem } from "../domain/TaxResult";
import { StateTaxPolicy } from "./TaxPolicy";

export class SinTaxPolicy extends StateTaxPolicy {
  readonly name: string;
  readonly description: string;
  readonly coveredState: USState;

  constructor(
    private readonly state: USState,
    private readonly category: ProductCategory,
    private readonly rate: TaxRate,
    private readonly fromYear: TaxYear,
    private readonly label: string = "Sin Tax",
  ) {
    super();
    this.coveredState = state;
    this.name = `SinTax(${state},${category})`;
    this.description = `Sin tax for ${category} in ${state}`;
  }

  protected appliesToState(context: TaxContext): boolean {
    return context.state === this.state;
  }

  protected appliesToYear(context: TaxContext): boolean {
    return !context.year.isBefore(this.fromYear);
  }

  protected appliesToCategory(context: TaxContext): boolean {
    return context.product.category === this.category;
  }

  compute(context: TaxContext, breakdown: TaxBreakdown): void {
    const baseAmount = Money.ofCents(
      context.product.priceInCents * context.quantity,
    );
    const taxAmount = baseAmount.multiply(this.rate.asFactor());
    breakdown.add(new TaxLineItem(this.label, this.rate, taxAmount, this.name));
  }
}

export class TieredSinTaxPolicy extends StateTaxPolicy {
  readonly name: string;
  readonly description: string;
  readonly coveredState: USState;

  constructor(
    private readonly state: USState,
    private readonly category: ProductCategory,
    private readonly tiers: Array<{
      upToCents: number | null;
      rate: TaxRate;
      label: string;
    }>,
    private readonly fromYear: TaxYear,
  ) {
    super();
    this.coveredState = state;
    this.name = `TieredSinTax(${state},${category})`;
    this.description = `Tiered sin tax for ${category} in ${state}`;
  }

  protected appliesToState(context: TaxContext): boolean {
    return context.state === this.state;
  }

  protected appliesToYear(context: TaxContext): boolean {
    return !context.year.isBefore(this.fromYear);
  }

  protected appliesToCategory(context: TaxContext): boolean {
    return context.product.category === this.category;
  }

  compute(context: TaxContext, breakdown: TaxBreakdown): void {
    const totalCents = context.product.priceInCents * context.quantity;
    let remainingCents = totalCents;

    for (const tier of this.tiers) {
      if (remainingCents <= 0) break;

      const tierCents =
        tier.upToCents !== null
          ? Math.min(remainingCents, tier.upToCents)
          : remainingCents;

      const tierBase = Money.ofCents(tierCents);
      const taxAmount = tierBase.multiply(tier.rate.asFactor());

      if (taxAmount.asCents() > 0) {
        breakdown.add(
          new TaxLineItem(tier.label, tier.rate, taxAmount, this.name),
        );
      }

      remainingCents -= tierCents;
    }
  }
}
