import { TaxContext, USState } from "../domain/Entities";
import {
  TaxPolicy,
  ExemptionPolicy,
  StateTaxPolicy,
} from "../policy/TaxPolicy";

export class TaxPolicyRegistry {
  private readonly policies: TaxPolicy[] = [];
  private readonly exemptions: ExemptionPolicy[] = [];

  register(policy: TaxPolicy): this {
    this.policies.push(policy);
    return this;
  }

  registerExemption(exemption: ExemptionPolicy): this {
    this.exemptions.push(exemption);
    return this;
  }

  applicablePolicies(context: TaxContext): TaxPolicy[] {
    return this.policies.filter((p) => p.applies(context));
  }

  isExempt(context: TaxContext): boolean {
    return this.exemptions.some((e) => e.isExempt(context));
  }

  policiesForState(state: USState): StateTaxPolicy[] {
    return this.policies
      .filter((p): p is StateTaxPolicy => p instanceof StateTaxPolicy)
      .filter((p) => p.coveredState === state);
  }

  describe(): void {
    console.log(`\nRegistered Tax Policies (${this.policies.length} total):`);
    for (const p of this.policies) {
      console.log(`  [${p.name}] ${p.description}`);
    }
    if (this.exemptions.length > 0) {
      console.log(`\nRegistered Exemptions (${this.exemptions.length} total):`);
      for (const e of this.exemptions) {
        console.log(`  [${e.name}] ${e.description}`);
      }
    }
  }
}
