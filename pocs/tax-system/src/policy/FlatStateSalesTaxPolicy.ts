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

export class FlatStateSalesTaxPolicy extends StateTaxPolicy {
  readonly name: string;
  readonly description: string;
  readonly coveredState: USState;

  constructor(
    private readonly state: USState,
    private readonly rate: TaxRate,
    private readonly fromYear: TaxYear,
    private readonly toYear: TaxYear | null = null,
    private readonly excludedCategories: ProductCategory[] = [],
  ) {
    super();
    this.coveredState = state;
    this.name = `FlatSalesTax(${state})`;
    this.description = `Flat state sales tax for ${state} at ${rate}`;
  }

  protected appliesToState(context: TaxContext): boolean {
    return context.state === this.state;
  }

  protected appliesToYear(context: TaxContext): boolean {
    const yearOk = !context.year.isBefore(this.fromYear);
    if (!yearOk) return false;
    if (this.toYear !== null) return !context.year.isAfter(this.toYear);
    return true;
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
        `State Sales Tax (${this.state})`,
        this.rate,
        taxAmount,
        this.name,
      ),
    );
  }
}
