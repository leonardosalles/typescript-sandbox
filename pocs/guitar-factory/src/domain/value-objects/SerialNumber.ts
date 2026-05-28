export class SerialNumber {
  constructor(private readonly value: string) {
    if (!/^GF-[A-Z]{2}-\d{5}$/.test(value)) {
      throw new Error(`Invalid guitar serial number: ${value}`);
    }
  }

  toString(): string {
    return this.value;
  }
}

export interface SerialNumberIssuer {
  issue(prefix: string): SerialNumber;
}

export class SequentialSerialNumberIssuer implements SerialNumberIssuer {
  constructor(private next = 1042) {}

  issue(prefix: string): SerialNumber {
    const normalized = prefix
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, 2);
    const familyCode = normalized.padEnd(2, "X");
    const number = String(this.next++).padStart(5, "0");

    return new SerialNumber(`GF-${familyCode}-${number}`);
  }
}
