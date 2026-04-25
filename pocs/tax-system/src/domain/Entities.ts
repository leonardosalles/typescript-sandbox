export enum ProductCategory {
  FOOD_GROCERY = "FOOD_GROCERY",
  FOOD_PREPARED = "FOOD_PREPARED",
  CLOTHING = "CLOTHING",
  CLOTHING_LUXURY = "CLOTHING_LUXURY",
  ELECTRONICS = "ELECTRONICS",
  MEDICINE_OTC = "MEDICINE_OTC",
  MEDICINE_PRESCRIPTION = "MEDICINE_PRESCRIPTION",
  TOBACCO = "TOBACCO",
  ALCOHOL = "ALCOHOL",
  GASOLINE = "GASOLINE",
  DIGITAL_GOODS = "DIGITAL_GOODS",
  GENERAL_MERCHANDISE = "GENERAL_MERCHANDISE",
}

export class Product {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly category: ProductCategory,
    readonly priceInCents: number,
  ) {
    if (priceInCents <= 0) throw new Error("Product price must be positive");
  }

  belongsTo(category: ProductCategory): boolean {
    return this.category === category;
  }

  toString(): string {
    return `Product(${this.id}, ${this.name}, ${this.category})`;
  }
}

export enum USState {
  CALIFORNIA = "CA",
  NEW_YORK = "NY",
  TEXAS = "TX",
  FLORIDA = "FL",
  WASHINGTON = "WA",
  OREGON = "OR",
  DELAWARE = "DE",
  MONTANA = "MT",
  NEW_HAMPSHIRE = "NH",
  ILLINOIS = "IL",
}

export class TaxYear {
  private constructor(readonly value: number) {
    if (value < 2000 || value > 2100)
      throw new Error(`Invalid tax year: ${value}`);
  }

  static of(year: number): TaxYear {
    return new TaxYear(year);
  }

  static current(): TaxYear {
    return new TaxYear(new Date().getFullYear());
  }

  isBefore(other: TaxYear): boolean {
    return this.value < other.value;
  }

  isAfter(other: TaxYear): boolean {
    return this.value > other.value;
  }

  equals(other: TaxYear): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return String(this.value);
  }
}

export class TaxContext {
  constructor(
    readonly product: Product,
    readonly state: USState,
    readonly year: TaxYear,
    readonly quantity: number = 1,
  ) {
    if (quantity <= 0) throw new Error("Quantity must be positive");
  }

  toString(): string {
    return `TaxContext(${this.product.name}, ${this.state}, ${this.year})`;
  }
}
