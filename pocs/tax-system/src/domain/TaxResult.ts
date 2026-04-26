import { Money } from "./Money";
import { TaxRate } from "./TaxRate";
import { TaxContext } from "./Entities";

export class TaxLineItem {
  constructor(
    readonly label: string,
    readonly rate: TaxRate,
    readonly amount: Money,
    readonly policyName: string,
  ) {}

  toString(): string {
    return `  [${this.policyName}] ${this.label}: ${this.rate} → ${this.amount}`;
  }
}

export class TaxBreakdown {
  private readonly items: TaxLineItem[] = [];

  add(item: TaxLineItem): TaxBreakdown {
    this.items.push(item);
    return this;
  }

  totalTax(): Money {
    return this.items.reduce((acc, item) => acc.add(item.amount), Money.zero());
  }

  effectiveRate(basePrice: Money): TaxRate {
    if (basePrice.asCents() === 0) return TaxRate.zero();
    const totalTaxCents = this.totalTax().asCents();
    const baseCents = basePrice.asCents();
    const bps = Math.round((totalTaxCents / baseCents) * 10000);
    return TaxRate.ofBasisPoints(bps);
  }

  lineItems(): readonly TaxLineItem[] {
    return [...this.items];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  toString(): string {
    if (this.isEmpty()) return "  (no taxes applied)";
    return this.items.map((i) => i.toString()).join("\n");
  }
}

export class TaxResult {
  constructor(
    readonly context: TaxContext,
    readonly basePrice: Money,
    readonly breakdown: TaxBreakdown,
    readonly isTaxExempt: boolean = false,
  ) {}

  taxAmount(): Money {
    return this.breakdown.totalTax();
  }

  totalWithTax(): Money {
    return this.basePrice.add(this.taxAmount());
  }

  effectiveRate(): TaxRate {
    return this.breakdown.effectiveRate(this.basePrice);
  }

  print(): void {
    console.log(`\n${"═".repeat(60)}`);
    console.log(`  TAX CALCULATION`);
    console.log(`${"─".repeat(60)}`);
    console.log(`  Product   : ${this.context.product.name}`);
    console.log(`  Category  : ${this.context.product.category}`);
    console.log(`  State     : ${this.context.state}`);
    console.log(`  Year      : ${this.context.year}`);
    console.log(`  Quantity  : ${this.context.quantity}`);
    console.log(`${"─".repeat(60)}`);
    console.log(`  Base Price: ${this.basePrice}`);
    if (this.isTaxExempt) {
      console.log(`  Status    : TAX EXEMPT`);
    } else {
      console.log(`  Breakdown :`);
      console.log(this.breakdown.toString());
      console.log(`${"─".repeat(60)}`);
      console.log(`  Tax Total : ${this.taxAmount()}`);
      console.log(`  Eff. Rate : ${this.effectiveRate()}`);
    }
    console.log(`${"─".repeat(60)}`);
    console.log(`  TOTAL DUE : ${this.totalWithTax()}`);
    console.log(`${"═".repeat(60)}\n`);
  }
}
