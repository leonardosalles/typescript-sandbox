export type DataRecord = Record<string, unknown>;

export class RenderContext {
  constructor(private readonly data: DataRecord) {}

  value(path: string): unknown {
    return path.split(".").reduce<unknown>((current, segment) => {
      if (current === null || current === undefined) {
        return undefined;
      }

      if (typeof current !== "object") {
        return undefined;
      }

      return (current as DataRecord)[segment];
    }, this.data);
  }

  text(path: string): string {
    const value = this.value(path);

    if (value === null || value === undefined) {
      return "";
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    return String(value);
  }

  list(path: string): DataRecord[] {
    const value = this.value(path);

    if (!Array.isArray(value)) {
      throw new Error(`Expected "${path}" to be an array, got ${typeof value}.`);
    }

    return value.map((item, index) => {
      if (item === null || typeof item !== "object" || Array.isArray(item)) {
        throw new Error(`Expected "${path}[${index}]" to be an object row.`);
      }

      return item as DataRecord;
    });
  }

  child(row: DataRecord): RenderContext {
    return new RenderContext(row);
  }
}
