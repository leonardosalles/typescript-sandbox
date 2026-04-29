leonardosalles@192 tax-system % bun start
$ bun run src/index.ts
╔══════════════════════════════════════════════════════════╗
║ USA TAX SYSTEM — OOAD ║
╚══════════════════════════════════════════════════════════╝

Registered Tax Policies (18 total):
[FlatSalesTax(CA)] Flat state sales tax for CA at 7.25%
[LocalSurcharge(CA,Los Angeles County)] Local surcharge in Los Angeles County, CA
[SinTax(CA,TOBACCO)] Sin tax for TOBACCO in CA
[SinTax(CA,ALCOHOL)] Sin tax for ALCOHOL in CA
[DigitalGoodsTax(CA)] Digital goods tax in CA from 2021
[FlatSalesTax(NY)] Flat state sales tax for NY at 4.00%
[LocalSurcharge(NY,New York City)] Local surcharge in New York City, NY
[LuxuryTax(NY)] Luxury tax above threshold in NY
[TieredSinTax(NY,ALCOHOL)] Tiered sin tax for ALCOHOL in NY
[FlatSalesTax(TX)] Flat state sales tax for TX at 6.25%
[LocalSurcharge(TX,Austin/Travis County)] Local surcharge in Austin/Travis County, TX
[SinTax(TX,ALCOHOL)] Sin tax for ALCOHOL in TX
[DigitalGoodsTax(TX)] Digital goods tax in TX from 2020
[FlatSalesTax(FL)] Flat state sales tax for FL at 6.00%
[SinTax(FL,TOBACCO)] Sin tax for TOBACCO in FL
[FlatSalesTax(WA)] Flat state sales tax for WA at 6.50%
[DigitalGoodsTax(WA)] Digital goods tax in WA from 2020
[LuxuryTax(WA)] Luxury tax above threshold in WA

Registered Exemptions (1 total):
[PrescriptionMedicineExemption] Prescription drugs are exempt from sales tax nationwide

---

## SCENARIO: Prescription Medicine — National Exemption

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Insulin (Rx)
Category : MEDICINE_PRESCRIPTION
State : CA
Year : 2024
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $85.00
Status : TAX EXEMPT
────────────────────────────────────────────────────────────
TOTAL DUE : $85.00
════════════════════════════════════════════════════════════

---

## SCENARIO: Grocery (Apple) — Cross-State Comparison

| State | Base  | Tax   | Total | Rate  |
| ----- | ----- | ----- | ----- | ----- |
| CA    | $2.99 | $0.00 | $2.99 | 0.00% |
| NY    | $2.99 | $0.00 | $2.99 | 0.00% |
| TX    | $2.99 | $0.00 | $2.99 | 0.00% |
| FL    | $2.99 | $0.00 | $2.99 | 0.00% |
| WA    | $2.99 | $0.00 | $2.99 | 0.00% |

---

## SCENARIO: Food — Grocery (exempt) vs Prepared Food (taxable) in CA + TX

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Organic Apple
Category : FOOD_GROCERY
State : CA
Year : 2024
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $2.99
Breakdown :
(no taxes applied)
────────────────────────────────────────────────────────────
Tax Total : $0.00
Eff. Rate : 0.00%
────────────────────────────────────────────────────────────
TOTAL DUE : $2.99
════════════════════════════════════════════════════════════

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Restaurant Burger
Category : FOOD_PREPARED
State : CA
Year : 2024
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $14.99
Breakdown :
[FlatSalesTax(CA)] State Sales Tax (CA): 7.25% → $1.09
[LocalSurcharge(CA,Los Angeles County)] Local Surcharge (Los Angeles County): 2.25% → $0.34
────────────────────────────────────────────────────────────
Tax Total : $1.43
Eff. Rate : 9.54%
────────────────────────────────────────────────────────────
TOTAL DUE : $16.42
════════════════════════════════════════════════════════════

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Organic Apple
Category : FOOD_GROCERY
State : TX
Year : 2024
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $2.99
Breakdown :
(no taxes applied)
────────────────────────────────────────────────────────────
Tax Total : $0.00
Eff. Rate : 0.00%
────────────────────────────────────────────────────────────
TOTAL DUE : $2.99
════════════════════════════════════════════════════════════

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Restaurant Burger
Category : FOOD_PREPARED
State : TX
Year : 2024
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $14.99
Breakdown :
[FlatSalesTax(TX)] State Sales Tax (TX): 6.25% → $0.94
[LocalSurcharge(TX,Austin/Travis County)] Local Surcharge (Austin/Travis County): 2.00% → $0.30
────────────────────────────────────────────────────────────
Tax Total : $1.24
Eff. Rate : 8.27%
────────────────────────────────────────────────────────────
TOTAL DUE : $16.23
════════════════════════════════════════════════════════════

---

## SCENARIO: Alcohol — Tiered NY vs Flat TX (same product)

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Craft Beer 6-pack
Category : ALCOHOL
State : NY
Year : 2024
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $12.99
Breakdown :
[FlatSalesTax(NY)] State Sales Tax (NY): 4.00% → $0.52
[LocalSurcharge(NY,New York City)] Local Surcharge (New York City): 4.88% → $0.63
[TieredSinTax(NY,ALCOHOL)] NY Alcohol Tax (tier 1): 6.44% → $0.84
────────────────────────────────────────────────────────────
Tax Total : $1.99
Eff. Rate : 15.32%
────────────────────────────────────────────────────────────
TOTAL DUE : $14.98
════════════════════════════════════════════════════════════

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Craft Beer 6-pack
Category : ALCOHOL
State : TX
Year : 2024
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $12.99
Breakdown :
[FlatSalesTax(TX)] State Sales Tax (TX): 6.25% → $0.81
[LocalSurcharge(TX,Austin/Travis County)] Local Surcharge (Austin/Travis County): 2.00% → $0.26
[SinTax(TX,ALCOHOL)] TX Mixed Beverage Tax: 8.25% → $1.07
────────────────────────────────────────────────────────────
Tax Total : $2.14
Eff. Rate : 16.47%
────────────────────────────────────────────────────────────
TOTAL DUE : $15.13
════════════════════════════════════════════════════════════

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Craft Beer 6-pack
Category : ALCOHOL
State : CA
Year : 2024
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $12.99
Breakdown :
[FlatSalesTax(CA)] State Sales Tax (CA): 7.25% → $0.94
[LocalSurcharge(CA,Los Angeles County)] Local Surcharge (Los Angeles County): 2.25% → $0.29
[SinTax(CA,ALCOHOL)] CA Alcohol Excise Tax: 3.30% → $0.43
────────────────────────────────────────────────────────────
Tax Total : $1.66
Eff. Rate : 12.78%
────────────────────────────────────────────────────────────
TOTAL DUE : $14.65
════════════════════════════════════════════════════════════

---

## SCENARIO: Luxury Clothing — NY Threshold ($110) + WA Threshold ($500)

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Levi's Jeans $120
Category : CLOTHING
State : NY
Year : 2024
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $120.00
Breakdown :
[LocalSurcharge(NY,New York City)] Local Surcharge (New York City): 4.88% → $5.86
[LuxuryTax(NY)] Luxury Tax (above $110.00): 4.00% → $0.40
────────────────────────────────────────────────────────────
Tax Total : $6.26
Eff. Rate : 5.22%
────────────────────────────────────────────────────────────
TOTAL DUE : $126.26
════════════════════════════════════════════════════════════

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Gucci Bag
Category : CLOTHING_LUXURY
State : NY
Year : 2024
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $2450.00
Breakdown :
[FlatSalesTax(NY)] State Sales Tax (NY): 4.00% → $98.00
[LocalSurcharge(NY,New York City)] Local Surcharge (New York City): 4.88% → $119.56
[LuxuryTax(NY)] Luxury Tax (above $110.00): 4.00% → $93.60
────────────────────────────────────────────────────────────
Tax Total : $311.16
Eff. Rate : 12.70%
────────────────────────────────────────────────────────────
TOTAL DUE : $2761.16
════════════════════════════════════════════════════════════

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Gucci Bag
Category : CLOTHING_LUXURY
State : WA
Year : 2024
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $2450.00
Breakdown :
[FlatSalesTax(WA)] State Sales Tax (WA): 6.50% → $159.25
[LuxuryTax(WA)] Luxury Tax (above $500.00): 10.00% → $195.00
────────────────────────────────────────────────────────────
Tax Total : $354.25
Eff. Rate : 14.46%
────────────────────────────────────────────────────────────
TOTAL DUE : $2804.25
════════════════════════════════════════════════════════════

---

## SCENARIO: Digital Goods — Tax Evolution Over Years (CA)

| Year | Base    | Tax    | Total   | Rate   |
| ---- | ------- | ------ | ------- | ------ |
| 2020 | $189.99 | $18.04 | $208.03 | 9.50%  |
| 2021 | $189.99 | $31.81 | $221.80 | 16.74% |
| 2022 | $189.99 | $31.81 | $221.80 | 16.74% |
| 2024 | $189.99 | $31.81 | $221.80 | 16.74% |

---

## SCENARIO: Tobacco — High Excise Tax CA (65%) vs FL (85%)

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Premium Cigarettes
Category : TOBACCO
State : CA
Year : 2024
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $9.99
Breakdown :
[FlatSalesTax(CA)] State Sales Tax (CA): 7.25% → $0.72
[LocalSurcharge(CA,Los Angeles County)] Local Surcharge (Los Angeles County): 2.25% → $0.22
[SinTax(CA,TOBACCO)] CA Tobacco Excise Tax: 65.08% → $6.50
────────────────────────────────────────────────────────────
Tax Total : $7.44
Eff. Rate : 74.47%
────────────────────────────────────────────────────────────
TOTAL DUE : $17.43
════════════════════════════════════════════════════════════

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Premium Cigarettes
Category : TOBACCO
State : FL
Year : 2024
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $9.99
Breakdown :
[FlatSalesTax(FL)] State Sales Tax (FL): 6.00% → $0.60
[SinTax(FL,TOBACCO)] FL Tobacco Surcharge (2023+): 85.00% → $8.49
────────────────────────────────────────────────────────────
Tax Total : $9.09
Eff. Rate : 90.99%
────────────────────────────────────────────────────────────
TOTAL DUE : $19.08
════════════════════════════════════════════════════════════

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Premium Cigarettes
Category : TOBACCO
State : TX
Year : 2024
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $9.99
Breakdown :
[FlatSalesTax(TX)] State Sales Tax (TX): 6.25% → $0.62
[LocalSurcharge(TX,Austin/Travis County)] Local Surcharge (Austin/Travis County): 2.00% → $0.20
────────────────────────────────────────────────────────────
Tax Total : $0.82
Eff. Rate : 8.21%
────────────────────────────────────────────────────────────
TOTAL DUE : $10.81
════════════════════════════════════════════════════════════

---

## SCENARIO: Medicine — OTC (Taxable) vs Prescription (Exempt) in TX

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Aspirin OTC
Category : MEDICINE_OTC
State : TX
Year : 2024
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $7.99
Breakdown :
[LocalSurcharge(TX,Austin/Travis County)] Local Surcharge (Austin/Travis County): 2.00% → $0.16
────────────────────────────────────────────────────────────
Tax Total : $0.16
Eff. Rate : 2.00%
────────────────────────────────────────────────────────────
TOTAL DUE : $8.15
════════════════════════════════════════════════════════════

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Insulin (Rx)
Category : MEDICINE_PRESCRIPTION
State : TX
Year : 2024
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $85.00
Status : TAX EXEMPT
────────────────────────────────────────────────────────────
TOTAL DUE : $85.00
════════════════════════════════════════════════════════════

---

## SCENARIO: Clothing NY — Edge Case: $109.99 (exempt) vs $110.00 (taxable)

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Shirt $109.99
Category : CLOTHING
State : NY
Year : 2024
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $109.99
Breakdown :
[LocalSurcharge(NY,New York City)] Local Surcharge (New York City): 4.88% → $5.37
────────────────────────────────────────────────────────────
Tax Total : $5.37
Eff. Rate : 4.88%
────────────────────────────────────────────────────────────
TOTAL DUE : $115.36
════════════════════════════════════════════════════════════

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Shirt $110.00
Category : CLOTHING
State : NY
Year : 2024
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $110.00
Breakdown :
[LocalSurcharge(NY,New York City)] Local Surcharge (New York City): 4.88% → $5.37
────────────────────────────────────────────────────────────
Tax Total : $5.37
Eff. Rate : 4.88%
────────────────────────────────────────────────────────────
TOTAL DUE : $115.37
════════════════════════════════════════════════════════════

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Coat $150.00
Category : CLOTHING
State : NY
Year : 2024
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $150.00
Breakdown :
[LocalSurcharge(NY,New York City)] Local Surcharge (New York City): 4.88% → $7.32
[LuxuryTax(NY)] Luxury Tax (above $110.00): 4.00% → $1.60
────────────────────────────────────────────────────────────
Tax Total : $8.92
Eff. Rate : 5.95%
────────────────────────────────────────────────────────────
TOTAL DUE : $158.92
════════════════════════════════════════════════════════════

---

## SCENARIO: Electronics — WA Luxury Tax Threshold ($500) 2022 vs 2023

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Smartphone Pro X
Category : ELECTRONICS
State : WA
Year : 2022
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $1299.00
Breakdown :
[FlatSalesTax(WA)] State Sales Tax (WA): 6.50% → $84.44
────────────────────────────────────────────────────────────
Tax Total : $84.44
Eff. Rate : 6.50%
────────────────────────────────────────────────────────────
TOTAL DUE : $1383.44
════════════════════════════════════════════════════════════

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Smartphone Pro X
Category : ELECTRONICS
State : WA
Year : 2023
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $1299.00
Breakdown :
[FlatSalesTax(WA)] State Sales Tax (WA): 6.50% → $84.44
[LuxuryTax(WA)] Luxury Tax (above $500.00): 10.00% → $79.90
────────────────────────────────────────────────────────────
Tax Total : $164.34
Eff. Rate : 12.65%
────────────────────────────────────────────────────────────
TOTAL DUE : $1463.34
════════════════════════════════════════════════════════════

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Smartphone Pro X
Category : ELECTRONICS
State : WA
Year : 2024
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $1299.00
Breakdown :
[FlatSalesTax(WA)] State Sales Tax (WA): 6.50% → $84.44
[LuxuryTax(WA)] Luxury Tax (above $500.00): 10.00% → $79.90
────────────────────────────────────────────────────────────
Tax Total : $164.34
Eff. Rate : 12.65%
────────────────────────────────────────────────────────────
TOTAL DUE : $1463.34
════════════════════════════════════════════════════════════

---

## SCENARIO: Bulk Purchase — Quantity Effect on Luxury Threshold (WA Electronics)

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Smartphone Pro X
Category : ELECTRONICS
State : WA
Year : 2024
Quantity : 1
────────────────────────────────────────────────────────────
Base Price: $1299.00
Breakdown :
[FlatSalesTax(WA)] State Sales Tax (WA): 6.50% → $84.44
[LuxuryTax(WA)] Luxury Tax (above $500.00): 10.00% → $79.90
────────────────────────────────────────────────────────────
Tax Total : $164.34
Eff. Rate : 12.65%
────────────────────────────────────────────────────────────
TOTAL DUE : $1463.34
════════════════════════════════════════════════════════════

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Smartphone Pro X
Category : ELECTRONICS
State : WA
Year : 2024
Quantity : 2
────────────────────────────────────────────────────────────
Base Price: $2598.00
Breakdown :
[FlatSalesTax(WA)] State Sales Tax (WA): 6.50% → $168.87
[LuxuryTax(WA)] Luxury Tax (above $500.00): 10.00% → $209.80
────────────────────────────────────────────────────────────
Tax Total : $378.67
Eff. Rate : 14.58%
────────────────────────────────────────────────────────────
TOTAL DUE : $2976.67
════════════════════════════════════════════════════════════

════════════════════════════════════════════════════════════
TAX CALCULATION
────────────────────────────────────────────────────────────
Product : Smartphone Pro X
Category : ELECTRONICS
State : WA
Year : 2024
Quantity : 5
────────────────────────────────────────────────────────────
Base Price: $6495.00
Breakdown :
[FlatSalesTax(WA)] State Sales Tax (WA): 6.50% → $422.18
[LuxuryTax(WA)] Luxury Tax (above $500.00): 10.00% → $599.50
────────────────────────────────────────────────────────────
Tax Total : $1021.68
Eff. Rate : 15.73%
────────────────────────────────────────────────────────────
TOTAL DUE : $7516.68
════════════════════════════════════════════════════════════

---

## SCENARIO: No Sales Tax States — DE, MT, NH, OR (smartphone)

| State | Base     | Tax   | Total    | Rate  |
| ----- | -------- | ----- | -------- | ----- |
| DE    | $1299.00 | $0.00 | $1299.00 | 0.00% |
| MT    | $1299.00 | $0.00 | $1299.00 | 0.00% |
| NH    | $1299.00 | $0.00 | $1299.00 | 0.00% |
| OR    | $1299.00 | $0.00 | $1299.00 | 0.00% |

---

## SCENARIO: Registry Introspection — policiesForState(CA) vs policiesForState(NY)

CA (5 policies):
[CA] FlatSalesTax(CA) — Flat state sales tax for CA at 7.25%
[CA] LocalSurcharge(CA,Los Angeles County) — Local surcharge in Los Angeles County, CA
[CA] SinTax(CA,TOBACCO) — Sin tax for TOBACCO in CA
[CA] SinTax(CA,ALCOHOL) — Sin tax for ALCOHOL in CA
[CA] DigitalGoodsTax(CA) — Digital goods tax in CA from 2021

NY (4 policies):
[NY] FlatSalesTax(NY) — Flat state sales tax for NY at 4.00%
[NY] LocalSurcharge(NY,New York City) — Local surcharge in New York City, NY
[NY] LuxuryTax(NY) — Luxury tax above threshold in NY
[NY] TieredSinTax(NY,ALCOHOL) — Tiered sin tax for ALCOHOL in NY
