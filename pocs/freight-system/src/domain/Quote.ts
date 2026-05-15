import { Money } from "./Money";
import { TransportMode } from "./FreightTypes";

export class QuoteLine {
  constructor(
    readonly label: string,
    readonly amount: Money,
  ) {}
}

export class QuoteBreakdown {
  private readonly lines: QuoteLine[] = [];

  add(label: string, amount: Money): void {
    this.lines.push(new QuoteLine(label, amount));
  }

  total(): Money {
    return this.lines.reduce((sum, line) => sum.add(line.amount), Money.zero());
  }

  all(): readonly QuoteLine[] {
    return this.lines;
  }
}

export class FreightQuote {
  constructor(
    readonly mode: TransportMode,
    readonly carrier: string,
    readonly breakdown: QuoteBreakdown,
    readonly transitDays: number,
    readonly warnings: readonly string[] = [],
  ) {}

  total(): Money {
    return this.breakdown.total();
  }

  print(): void {
    console.log(
      `\n${this.carrier} (${this.mode}) - ${this.total().format()} - ${this.transitDays} days`,
    );
    for (const line of this.breakdown.all()) {
      console.log(`  ${line.label.padEnd(32)} ${line.amount.format()}`);
    }
    for (const warning of this.warnings) {
      console.log(`  warning: ${warning}`);
    }
  }
}
