import assert from "node:assert/strict";
import { test } from "node:test";
import { TemplateParser } from "../core/TemplateParser.js";
import { CsvRenderer } from "../renderers/CsvRenderer.js";
import { HtmlRenderer } from "../renderers/HtmlRenderer.js";
import { PdfRenderer } from "../renderers/PdfRenderer.js";

const source = `
# Report {{meta.name}}
Owner: {{owner}}
@table rows
headers: A|B
columns: a|b
@end
`;

const data = {
  meta: { name: "Safety <Check>" },
  owner: "Ada",
  rows: [
    { a: "one", b: "two" },
    { a: 'comma,value', b: 'quote"value' },
  ],
};

test("same template renders escaped HTML", () => {
  const template = new TemplateParser().parse("report", source);
  const html = template.render(new HtmlRenderer(), data);

  assert.equal(typeof html, "string");
  assert.match(html as string, /Safety &lt;Check&gt;/);
  assert.match(html as string, /<td>one<\/td>/);
});

test("same template renders CSV with escaped cells", () => {
  const template = new TemplateParser().parse("report", source);
  const csv = template.render(new CsvRenderer(), data);

  assert.equal(typeof csv, "string");
  assert.match(csv as string, /"comma,value","quote""value"/);
});

test("same template renders valid looking PDF bytes", () => {
  const template = new TemplateParser().parse("report", source);
  const pdf = template.render(new PdfRenderer(), data);

  assert.ok(pdf instanceof Uint8Array);
  assert.equal(new TextDecoder().decode(pdf.slice(0, 8)), "%PDF-1.4");
});

test("parser rejects incomplete tables", () => {
  assert.throws(
    () => new TemplateParser().parse("bad", "@table rows\nheaders: A|B\n@end"),
    /must define headers and columns/,
  );
});
