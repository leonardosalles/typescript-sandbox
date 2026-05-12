import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { TemplateParser } from "../core/TemplateParser.js";
import { CsvRenderer } from "../renderers/CsvRenderer.js";
import { HtmlRenderer } from "../renderers/HtmlRenderer.js";
import { PdfRenderer } from "../renderers/PdfRenderer.js";

const invoiceTemplate = `
# Invoice {{invoice.number}}
Customer: {{customer.name}}
Issued at: {{invoice.issuedAt}}

@table items
headers: SKU|Description|Qty|Unit price|Total
columns: sku|description|quantity|unitPrice|total
@end

Grand total: {{invoice.total}}
`;

const data = {
  invoice: {
    number: "INV-2026-001",
    issuedAt: "2026-05-13",
    total: "USD 4,215.00",
  },
  customer: {
    name: "Corecraft Partners",
  },
  items: [
    { sku: "OOAD-01", description: "Template modelling workshop", quantity: 1, unitPrice: "USD 2,100.00", total: "USD 2,100.00" },
    { sku: "PDF-02", description: "Minimal PDF writer experiment", quantity: 1, unitPrice: "USD 1,250.00", total: "USD 1,250.00" },
    { sku: "CSV-03", description: "Data export edge cases", quantity: 3, unitPrice: "USD 288.33", total: "USD 865.00" },
  ],
};

const template = new TemplateParser().parse("invoice", invoiceTemplate);
const outputDir = join(process.cwd(), "output");

await mkdir(outputDir, { recursive: true });
await writeFile(join(outputDir, "invoice.html"), template.render(new HtmlRenderer(), data));
await writeFile(join(outputDir, "invoice.csv"), template.render(new CsvRenderer(), data));
await writeFile(join(outputDir, "invoice.pdf"), template.render(new PdfRenderer(), data));

console.log(`Rendered invoice files at ${outputDir}`);
