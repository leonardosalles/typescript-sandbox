# Tax System — OOAD

## What this is

A deep Object-Oriented Analysis and Design POC modeling a US tax system where different products have different tax rates per state and year. No UI, no database — pure domain model.

## Run it

```bash
bun run src/index.ts
```

## Design Decisions

### Value Objects (immutable, no identity)

- `Money` — stores cents as int, never floats. Prevents rounding hell.
- `TaxRate` — stores basis points (1% = 100bps). Avoids floating-point rate math.
- `TaxYear` — prevents invalid years, enables `isBefore/isAfter` comparisons.
- `TaxLineItem` — one line in the breakdown receipt: label + rate + amount.

All are constructed via static factory methods. Constructors are private to enforce invariants.

### Domain Entities

- `Product` — has a `ProductCategory` enum (not a string). Prevents invalid categories.
- `USState` — enum of state abbreviations. No magic strings.
- `TaxContext` — the input to any tax calculation. Groups product + state + year + quantity. Immutable after creation; `forQuantity()` returns a new context.

### Strategy Pattern: TaxPolicy

`TaxPolicy` is the core interface:

```
applies(context): boolean   ← guard
compute(context, breakdown): void   ← mutates breakdown
```

Every policy is responsible for deciding if it applies AND computing its slice. The calculator just iterates.

Concrete policies:

- `FlatStateSalesTaxPolicy` — base sales tax with year range and category exclusions
- `SinTaxPolicy` — flat excise tax on TOBACCO or ALCOHOL
- `TieredSinTaxPolicy` — tiered excise (like NY alcohol: lower rate up to $1000, higher above)
- `LuxuryThresholdTaxPolicy` — only taxable amount ABOVE threshold (e.g., NY clothing above $110)
- `DigitalGoodsTaxPolicy` — digital goods, with a `fromYear` (TX started taxing digital in 2020)
- `LocalSurchargeTaxPolicy` — county/city surcharges on top of state rate
- `ExemptionPolicy` — blanket exemptions (Rx drugs, nationwide)

`CompositeTaxPolicy` implements the Composite pattern — a policy that holds a list of policies. Lets you group related rules.

### Registry

`TaxPolicyRegistry` is a simple list of policies + exemptions. The calculator asks it:

- `isExempt(context)` — check exemptions first
- `applicablePolicies(context)` — filter policies that apply

Adding a new state means registering new policies. Zero changes to the calculator.

### Calculator

`TaxCalculator` is thin: check exemption → iterate policies → return `TaxResult`. It also supports:

- `compareAcrossStates(context, states[])` — same product, multiple states
- `compareAcrossYears(context, years[])` — evolution of tax burden over time

### TaxResult + TaxBreakdown

`TaxResult` is a rich output object — not just a number. It holds:

- Base price
- Full breakdown with line items (one per policy)
- Effective rate computation
- `print()` for human-readable output

## Scenarios Covered

| Scenario                                  | What it tests                                      |
| ----------------------------------------- | -------------------------------------------------- |
| Prescription insulin in CA                | National exemption overrides all state policy      |
| Grocery across 5 states                   | Category exclusion working correctly per state     |
| Alcohol in NY vs TX vs CA                 | Tiered (NY) vs flat sin tax comparison             |
| Luxury clothing NY ($109 vs $110 vs $150) | Threshold boundary edge case                       |
| Gucci bag in NY vs WA                     | Different luxury thresholds + rates                |
| Netflix in CA across 2020–2024            | Digital goods policy activated in 2021             |
| Cigarettes CA vs FL vs TX                 | 65% vs 85% excise, TX has no sin tax for tobacco   |
| OTC aspirin vs Rx insulin in TX           | OTC taxable, Rx exempt                             |
| WA electronics 2022 vs 2023               | Luxury tax introduced in 2023                      |
| Bulk phones (qty 1, 2, 5) in WA           | Quantity scales both base price and luxury overage |

## What makes this a Deep POC

- Money uses integer cents — real-world production pattern
- TaxRate uses basis points — avoids 0.0725 × 0.03 float accumulation
- Policies guard themselves (`applies`) — Open/Closed Principle
- Registry owns no business logic — it's just storage
- Calculator is dependency-injected with registry — testable in isolation
- TaxContext is the canonical input — easy to clone/vary for comparisons
- All value objects are immutable — no shared mutable state
- Year ranges are first-class — you can model "this rate was valid 2020–2022"
- Tiered taxes model real-world complexity (NY alcohol)
- Luxury threshold taxes model "only the overage is taxable"

## What to explore next

- Add `TaxAuditLog` — record which policies fired and why
- Implement `TaxPolicy.explain()` — machine-readable justification
- Add `MultiJurisdictionTaxContext` (product sold in state A, buyer in state B)
- Model nexus rules (economic nexus thresholds triggering registration)
- Add a `TaxPolicyVersionStore` — query the policy set as it existed on a given date
- Write property-based tests: for any `Money + TaxRate`, effective rate should equal computed / base
- Benchmark: can you calculate 1M contexts/sec? What's the allocation profile?
