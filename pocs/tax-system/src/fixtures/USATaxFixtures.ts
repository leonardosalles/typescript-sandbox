import { USState, ProductCategory, TaxYear } from "../domain/Entities";
import { TaxRate } from "../domain/TaxRate";
import { TaxPolicyRegistry } from "../registry/TaxPolicyRegistry";
import { FlatStateSalesTaxPolicy } from "../policy/FlatStateSalesTaxPolicy";
import { SinTaxPolicy, TieredSinTaxPolicy } from "../policy/SinTaxPolicy";
import {
  LuxuryThresholdTaxPolicy,
  DigitalGoodsTaxPolicy,
  LocalSurchargeTaxPolicy,
} from "../policy/SpecialTaxPolicies";
import { ExemptionPolicy } from "../policy/TaxPolicy";

export function buildUSARegistry(): TaxPolicyRegistry {
  const registry = new TaxPolicyRegistry();

  registry.registerExemption(
    new ExemptionPolicy(
      "PrescriptionMedicineExemption",
      "Prescription drugs are exempt from sales tax nationwide",
      (ctx) => ctx.product.category === ProductCategory.MEDICINE_PRESCRIPTION,
    ),
  );

  registry.register(
    new FlatStateSalesTaxPolicy(
      USState.CALIFORNIA,
      TaxRate.ofPercent(7.25),
      TaxYear.of(2020),
      null,
      [
        ProductCategory.FOOD_GROCERY,
        ProductCategory.MEDICINE_OTC,
        ProductCategory.MEDICINE_PRESCRIPTION,
      ],
    ),
  );

  registry.register(
    new LocalSurchargeTaxPolicy(
      USState.CALIFORNIA,
      "Los Angeles County",
      TaxRate.ofPercent(2.25),
      TaxYear.of(2020),
      [ProductCategory.FOOD_GROCERY, ProductCategory.MEDICINE_PRESCRIPTION],
    ),
  );

  registry.register(
    new SinTaxPolicy(
      USState.CALIFORNIA,
      ProductCategory.TOBACCO,
      TaxRate.ofPercent(65.08),
      TaxYear.of(2022),
      "CA Tobacco Excise Tax",
    ),
  );

  registry.register(
    new SinTaxPolicy(
      USState.CALIFORNIA,
      ProductCategory.ALCOHOL,
      TaxRate.ofPercent(3.3),
      TaxYear.of(2020),
      "CA Alcohol Excise Tax",
    ),
  );

  registry.register(
    new DigitalGoodsTaxPolicy(
      USState.CALIFORNIA,
      TaxRate.ofPercent(7.25),
      TaxYear.of(2021),
    ),
  );

  registry.register(
    new FlatStateSalesTaxPolicy(
      USState.NEW_YORK,
      TaxRate.ofPercent(4.0),
      TaxYear.of(2020),
      null,
      [
        ProductCategory.FOOD_GROCERY,
        ProductCategory.CLOTHING,
        ProductCategory.MEDICINE_OTC,
        ProductCategory.MEDICINE_PRESCRIPTION,
      ],
    ),
  );

  registry.register(
    new LocalSurchargeTaxPolicy(
      USState.NEW_YORK,
      "New York City",
      TaxRate.ofPercent(4.875),
      TaxYear.of(2020),
      [ProductCategory.FOOD_GROCERY, ProductCategory.MEDICINE_PRESCRIPTION],
    ),
  );

  registry.register(
    new LuxuryThresholdTaxPolicy(
      USState.NEW_YORK,
      110_00,
      TaxRate.ofPercent(4.0),
      TaxYear.of(2020),
      [ProductCategory.CLOTHING_LUXURY, ProductCategory.CLOTHING],
    ),
  );

  registry.register(
    new TieredSinTaxPolicy(
      USState.NEW_YORK,
      ProductCategory.ALCOHOL,
      [
        {
          upToCents: 1000_00,
          rate: TaxRate.ofPercent(6.44),
          label: "NY Alcohol Tax (tier 1)",
        },
        {
          upToCents: null,
          rate: TaxRate.ofPercent(8.97),
          label: "NY Alcohol Tax (tier 2)",
        },
      ],
      TaxYear.of(2020),
    ),
  );

  registry.register(
    new FlatStateSalesTaxPolicy(
      USState.TEXAS,
      TaxRate.ofPercent(6.25),
      TaxYear.of(2020),
      null,
      [
        ProductCategory.FOOD_GROCERY,
        ProductCategory.MEDICINE_OTC,
        ProductCategory.MEDICINE_PRESCRIPTION,
      ],
    ),
  );

  registry.register(
    new LocalSurchargeTaxPolicy(
      USState.TEXAS,
      "Austin/Travis County",
      TaxRate.ofPercent(2.0),
      TaxYear.of(2020),
      [ProductCategory.FOOD_GROCERY, ProductCategory.MEDICINE_PRESCRIPTION],
    ),
  );

  registry.register(
    new SinTaxPolicy(
      USState.TEXAS,
      ProductCategory.ALCOHOL,
      TaxRate.ofPercent(8.25),
      TaxYear.of(2020),
      "TX Mixed Beverage Tax",
    ),
  );

  registry.register(
    new DigitalGoodsTaxPolicy(
      USState.TEXAS,
      TaxRate.ofPercent(6.25),
      TaxYear.of(2020),
    ),
  );

  registry.register(
    new FlatStateSalesTaxPolicy(
      USState.FLORIDA,
      TaxRate.ofPercent(6.0),
      TaxYear.of(2020),
      null,
      [
        ProductCategory.FOOD_GROCERY,
        ProductCategory.MEDICINE_OTC,
        ProductCategory.MEDICINE_PRESCRIPTION,
      ],
    ),
  );

  registry.register(
    new SinTaxPolicy(
      USState.FLORIDA,
      ProductCategory.TOBACCO,
      TaxRate.ofPercent(85.0),
      TaxYear.of(2023),
      "FL Tobacco Surcharge (2023+)",
    ),
  );

  registry.register(
    new FlatStateSalesTaxPolicy(
      USState.WASHINGTON,
      TaxRate.ofPercent(6.5),
      TaxYear.of(2020),
      null,
      [
        ProductCategory.FOOD_GROCERY,
        ProductCategory.MEDICINE_OTC,
        ProductCategory.MEDICINE_PRESCRIPTION,
      ],
    ),
  );

  registry.register(
    new DigitalGoodsTaxPolicy(
      USState.WASHINGTON,
      TaxRate.ofPercent(6.5),
      TaxYear.of(2020),
    ),
  );

  registry.register(
    new LuxuryThresholdTaxPolicy(
      USState.WASHINGTON,
      500_00,
      TaxRate.ofPercent(10.0),
      TaxYear.of(2023),
      [ProductCategory.CLOTHING_LUXURY, ProductCategory.ELECTRONICS],
    ),
  );

  return registry;
}
