import { buildUSARegistry } from "./fixtures/USATaxFixtures";
import { TaxCalculator } from "./calculator/TaxCalculator";
import { runAllScenarios } from "./scenarios/Scenarios";

const registry = buildUSARegistry();
const calculator = new TaxCalculator(registry);

console.log("╔══════════════════════════════════════════════════════════╗");
console.log("║          USA TAX SYSTEM — OOAD                           ║");
console.log("╚══════════════════════════════════════════════════════════╝");

registry.describe();

runAllScenarios(calculator, registry);
