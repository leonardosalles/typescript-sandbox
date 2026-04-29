import {
  Product,
  ProductCategory,
  USState,
  TaxYear,
  TaxContext,
} from "../domain/Entities";
import { TaxCalculator } from "../calculator/TaxCalculator";
import { TaxPolicyRegistry } from "../registry/TaxPolicyRegistry";

// prettier-ignore
const PRODUCTS = {
  apple:        new Product("P001", "Organic Apple",       ProductCategory.FOOD_GROCERY,         2_99),
  smartphone:   new Product("P002", "Smartphone Pro X",    ProductCategory.ELECTRONICS,          129900),
  beer:         new Product("P003", "Craft Beer 6-pack",   ProductCategory.ALCOHOL,              1299),
  cigarettes:   new Product("P004", "Premium Cigarettes",  ProductCategory.TOBACCO,              999),
  aspirin:      new Product("P005", "Aspirin OTC",         ProductCategory.MEDICINE_OTC,         799),
  insulin:      new Product("P006", "Insulin (Rx)",        ProductCategory.MEDICINE_PRESCRIPTION,8500),
  netflix:      new Product("P007", "Netflix Annual Plan", ProductCategory.DIGITAL_GOODS,        18999),
  levis:        new Product("P008", "Levi's Jeans $120",  ProductCategory.CLOTHING,             12000),
  gucci:        new Product("P009", "Gucci Bag",           ProductCategory.CLOTHING_LUXURY,      245000),
  cheeseburger: new Product("P010", "Restaurant Burger",   ProductCategory.FOOD_PREPARED,        1499),
}

// prettier-ignore
export function runAllScenarios(calculator: TaxCalculator, registry: TaxPolicyRegistry): void {
  scenarioExemptProduct(calculator)
  scenarioGroceryAcrossStates(calculator)
  scenarioFoodPreparedVsGrocery(calculator)
  scenarioAlcoholTieredVsFlat(calculator)
  scenarioLuxuryThreshold(calculator)
  scenarioDigitalGoodsEvolution(calculator)
  scenarioTobaccoHighExcise(calculator)
  scenarioMedicineOTCvsRx(calculator)
  scenarioClothingNYExemptionEdge(calculator)
  scenarioElectronicsWashingtonLuxury(calculator)
  scenarioBulkQuantityEffect(calculator)
  scenarioNoSalesTaxStates(calculator)
  scenarioPoliciesForState(registry)
}

function header(title: string): void {
  console.log(`\n${"-".repeat(60)}`);
  console.log(`  SCENARIO: ${title}`);
  console.log(`${"-".repeat(60)}`);
}

function scenarioExemptProduct(calc: TaxCalculator): void {
  header("Prescription Medicine — National Exemption");
  const ctx = new TaxContext(
    PRODUCTS.insulin,
    USState.CALIFORNIA,
    TaxYear.of(2024),
  );
  calc.calculate(ctx).print();
}

function scenarioGroceryAcrossStates(calc: TaxCalculator): void {
  header("Grocery (Apple) — Cross-State Comparison");
  const states = [
    USState.CALIFORNIA,
    USState.NEW_YORK,
    USState.TEXAS,
    USState.FLORIDA,
    USState.WASHINGTON,
  ];
  const results = calc.compareAcrossStates(
    new TaxContext(PRODUCTS.apple, USState.CALIFORNIA, TaxYear.of(2024)),
    states,
  );
  console.log("\n  State      | Base   | Tax    | Total  | Rate");
  console.log("  -----------|--------|--------|--------|------");
  for (const r of results) {
    const state = r.context.state.padEnd(10);
    const base = r.basePrice.format().padStart(7);
    const tax = r.taxAmount().format().padStart(7);
    const total = r.totalWithTax().format().padStart(7);
    const rate = r.effectiveRate().format().padStart(6);
    console.log(`  ${state} | ${base} | ${tax} | ${total} | ${rate}`);
  }
}

function scenarioAlcoholTieredVsFlat(calc: TaxCalculator): void {
  header("Alcohol — Tiered NY vs Flat TX (same product)");
  const states = [USState.NEW_YORK, USState.TEXAS, USState.CALIFORNIA];
  for (const state of states) {
    const ctx = new TaxContext(PRODUCTS.beer, state, TaxYear.of(2024));
    calc.calculate(ctx).print();
  }
}

function scenarioLuxuryThreshold(calc: TaxCalculator): void {
  header("Luxury Clothing — NY Threshold ($110) + WA Threshold ($500)");
  const ctxLevisNY = new TaxContext(
    PRODUCTS.levis,
    USState.NEW_YORK,
    TaxYear.of(2024),
  );
  const ctxGucciNY = new TaxContext(
    PRODUCTS.gucci,
    USState.NEW_YORK,
    TaxYear.of(2024),
  );
  const ctxGucciWA = new TaxContext(
    PRODUCTS.gucci,
    USState.WASHINGTON,
    TaxYear.of(2024),
  );

  calc.calculate(ctxLevisNY).print();
  calc.calculate(ctxGucciNY).print();
  calc.calculate(ctxGucciWA).print();
}

function scenarioDigitalGoodsEvolution(calc: TaxCalculator): void {
  header("Digital Goods — Tax Evolution Over Years (CA)");
  const years = [
    TaxYear.of(2020),
    TaxYear.of(2021),
    TaxYear.of(2022),
    TaxYear.of(2024),
  ];
  const results = calc.compareAcrossYears(
    new TaxContext(PRODUCTS.netflix, USState.CALIFORNIA, TaxYear.of(2024)),
    years,
  );
  console.log("\n  Year | Base     | Tax      | Total    | Rate");
  console.log("  -----|----------|----------|----------|------");
  for (const r of results) {
    const year = String(r.context.year).padEnd(4);
    const base = r.basePrice.format().padStart(9);
    const tax = r.taxAmount().format().padStart(9);
    const total = r.totalWithTax().format().padStart(9);
    const rate = r.effectiveRate().format().padStart(6);
    console.log(`  ${year} | ${base} | ${tax} | ${total} | ${rate}`);
  }
}

function scenarioTobaccoHighExcise(calc: TaxCalculator): void {
  header("Tobacco — High Excise Tax CA (65%) vs FL (85%)");
  const states = [USState.CALIFORNIA, USState.FLORIDA, USState.TEXAS];
  for (const state of states) {
    const ctx = new TaxContext(PRODUCTS.cigarettes, state, TaxYear.of(2024));
    calc.calculate(ctx).print();
  }
}

function scenarioMedicineOTCvsRx(calc: TaxCalculator): void {
  header("Medicine — OTC (Taxable) vs Prescription (Exempt) in TX");
  const ctxOTC = new TaxContext(
    PRODUCTS.aspirin,
    USState.TEXAS,
    TaxYear.of(2024),
  );
  const ctxRx = new TaxContext(
    PRODUCTS.insulin,
    USState.TEXAS,
    TaxYear.of(2024),
  );
  calc.calculate(ctxOTC).print();
  calc.calculate(ctxRx).print();
}

// prettier-ignore
function scenarioClothingNYExemptionEdge(calc: TaxCalculator): void {
  header("Clothing NY — Edge Case: $109.99 (exempt) vs $110.00 (taxable)")
  const belowThreshold = new Product("PX1", "Shirt $109.99", ProductCategory.CLOTHING, 10999)
  const atThreshold    = new Product("PX2", "Shirt $110.00", ProductCategory.CLOTHING, 11000)
  const above          = new Product("PX3", "Coat  $150.00", ProductCategory.CLOTHING, 15000)

  for (const product of [belowThreshold, atThreshold, above]) {
    const ctx = new TaxContext(product, USState.NEW_YORK, TaxYear.of(2024))
    calc.calculate(ctx).print()
  }
}

function scenarioElectronicsWashingtonLuxury(calc: TaxCalculator): void {
  header("Electronics — WA Luxury Tax Threshold ($500) 2022 vs 2023");
  const years = [TaxYear.of(2022), TaxYear.of(2023), TaxYear.of(2024)];
  const results = calc.compareAcrossYears(
    new TaxContext(PRODUCTS.smartphone, USState.WASHINGTON, TaxYear.of(2024)),
    years,
  );
  for (const r of results) r.print();
}

function scenarioBulkQuantityEffect(calc: TaxCalculator): void {
  header(
    "Bulk Purchase — Quantity Effect on Luxury Threshold (WA Electronics)",
  );
  for (const qty of [1, 2, 5]) {
    const ctx = new TaxContext(
      PRODUCTS.smartphone,
      USState.WASHINGTON,
      TaxYear.of(2024),
      qty,
    );
    calc.calculate(ctx).print();
  }
}

function scenarioFoodPreparedVsGrocery(calc: TaxCalculator): void {
  header("Food — Grocery (exempt) vs Prepared Food (taxable) in CA + TX");
  const states = [USState.CALIFORNIA, USState.TEXAS];
  for (const state of states) {
    calc
      .calculate(new TaxContext(PRODUCTS.apple, state, TaxYear.of(2024)))
      .print();
    calc
      .calculate(new TaxContext(PRODUCTS.cheeseburger, state, TaxYear.of(2024)))
      .print();
  }
}

function scenarioNoSalesTaxStates(calc: TaxCalculator): void {
  header("No Sales Tax States — DE, MT, NH, OR (smartphone)");
  const states = [
    USState.DELAWARE,
    USState.MONTANA,
    USState.NEW_HAMPSHIRE,
    USState.OREGON,
  ];
  const results = calc.compareAcrossStates(
    new TaxContext(PRODUCTS.smartphone, USState.DELAWARE, TaxYear.of(2024)),
    states,
  );
  console.log("\n  State | Base      | Tax    | Total     | Rate");
  console.log("  ------|-----------|--------|-----------|------");
  for (const r of results) {
    const state = r.context.state.padEnd(5);
    const base = r.basePrice.format().padStart(10);
    const tax = r.taxAmount().format().padStart(7);
    const total = r.totalWithTax().format().padStart(10);
    const rate = r.effectiveRate().format().padStart(6);
    console.log(`  ${state} | ${base} | ${tax} | ${total} | ${rate}`);
  }
}

function scenarioPoliciesForState(registry: TaxPolicyRegistry): void {
  header(
    "Registry Introspection — policiesForState(CA) vs policiesForState(NY)",
  );
  for (const state of [USState.CALIFORNIA, USState.NEW_YORK]) {
    const policies = registry.policiesForState(state);
    console.log(`\n  ${state} (${policies.length} policies):`);
    for (const p of policies) {
      console.log(`    [${p.coveredState}] ${p.name} — ${p.description}`);
    }
  }
}
