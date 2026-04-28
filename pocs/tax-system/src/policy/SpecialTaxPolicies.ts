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

export class LuxuryThresholdTaxPolicy extends StateTaxPolicy {
  readonly name: string;
  readonly description: string;
  readonly coveredState: USState;

  constructor(
    private readonly state: USState,
    private readonly thresholdCents: number,
    private readonly rate: TaxRate,
    private readonly fromYear: TaxYear,
    private readonly applicableCategories: ProductCategory[],
  ) {
    super();
    this.coveredState = state;
    this.name = `LuxuryTax(${state})`;
    this.description = `Luxury tax above threshold in ${state}`;
  }

  protected appliesToState(context: TaxContext): boolean {
    return context.state === this.state;
  }

  protected appliesToYear(context: TaxContext): boolean {
    return !context.year.isBefore(this.fromYear);
  }

  protected appliesToCategory(context: TaxContext): boolean {
    return this.applicableCategories.includes(context.product.category);
  }

  compute(context: TaxContext, breakdown: TaxBreakdown): void {
    const totalCents = context.product.priceInCents * context.quantity;
    if (totalCents <= this.thresholdCents) return;

    const taxableCents = totalCents - this.thresholdCents;
    const taxable = Money.ofCents(taxableCents);
    const taxAmount = taxable.multiply(this.rate.asFactor());
    const threshold = Money.ofCents(this.thresholdCents);

    breakdown.add(
      new TaxLineItem(
        `Luxury Tax (above ${threshold})`,
        this.rate,
        taxAmount,
        this.name,
      ),
    );
  }
}

export class DigitalGoodsTaxPolicy extends StateTaxPolicy {
  readonly name: string;
  readonly description: string;
  readonly coveredState: USState;

  constructor(
    private readonly state: USState,
    private readonly rate: TaxRate,
    private readonly fromYear: TaxYear,
  ) {
    super();
    this.coveredState = state;
    this.name = `DigitalGoodsTax(${state})`;
    this.description = `Digital goods tax in ${state} from ${fromYear}`;
  }

  protected appliesToState(context: TaxContext): boolean {
    return context.state === this.state;
  }

  protected appliesToYear(context: TaxContext): boolean {
    return !context.year.isBefore(this.fromYear);
  }

  protected appliesToCategory(context: TaxContext): boolean {
    return context.product.category === ProductCategory.DIGITAL_GOODS;
  }

  compute(context: TaxContext, breakdown: TaxBreakdown): void {
    const baseAmount = Money.ofCents(
      context.product.priceInCents * context.quantity,
    );
    const taxAmount = baseAmount.multiply(this.rate.asFactor());
    breakdown.add(
      new TaxLineItem(
        "Digital Goods / Marketplace Tax",
        this.rate,
        taxAmount,
        this.name,
      ),
    );
  }
}

export class LocalSurchargeTaxPolicy extends StateTaxPolicy {
  readonly name: string;
  readonly description: string;
  readonly coveredState: USState;

  constructor(
    private readonly state: USState,
    private readonly localityLabel: string,
    private readonly rate: TaxRate,
    private readonly fromYear: TaxYear,
    private readonly excludedCategories: ProductCategory[] = [],
  ) {
    super();
    this.coveredState = state;
    this.name = `LocalSurcharge(${state},${localityLabel})`;
    this.description = `Local surcharge in ${localityLabel}, ${state}`;
  }

  protected appliesToState(context: TaxContext): boolean {
    return context.state === this.state;
  }

  protected appliesToYear(context: TaxContext): boolean {
    return !context.year.isBefore(this.fromYear);
  }

  protected appliesToCategory(context: TaxContext): boolean {
    return !this.excludedCategories.includes(context.product.category);
  }

  compute(context: TaxContext, breakdown: TaxBreakdown): void {
    const baseAmount = Money.ofCents(
      context.product.priceInCents * context.quantity,
    );
    const taxAmount = baseAmount.multiply(this.rate.asFactor());
    breakdown.add(
      new TaxLineItem(
        `Local Surcharge (${this.localityLabel})`,
        this.rate,
        taxAmount,
        this.name,
      ),
    );
  }
}
