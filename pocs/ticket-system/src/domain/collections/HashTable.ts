import { Equality, HashFunction } from "./HashFunction";

type Entry<K, V> = {
  readonly key: K;
  value: V;
};

export class HashTable<K, V> {
  private buckets: Array<Array<Entry<K, V>>>;
  private entriesCount: number;
  private readonly hashFunction: HashFunction<K>;
  private readonly equality: Equality<K>;

  constructor(
    hashFunction: HashFunction<K>,
    equality: Equality<K>,
    bucketCount = 17,
  ) {
    if (!Number.isInteger(bucketCount) || bucketCount <= 0) {
      throw new Error("Bucket count must be a positive integer");
    }

    this.buckets = this.emptyBuckets(bucketCount);
    this.entriesCount = 0;
    this.hashFunction = hashFunction;
    this.equality = equality;
  }

  set(key: K, value: V): void {
    this.resizeWhenCrowded();

    const bucket = this.bucketFor(key);
    const entry = bucket.find((candidate) =>
      this.equality.equals(candidate.key, key),
    );

    if (entry) {
      entry.value = value;
      return;
    }

    bucket.push({ key, value });
    this.entriesCount += 1;
  }

  get(key: K): V | undefined {
    const bucket = this.bucketFor(key);
    const entry = bucket.find((candidate) =>
      this.equality.equals(candidate.key, key),
    );
    return entry?.value;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  values(): V[] {
    const values: V[] = [];

    for (const bucket of this.buckets) {
      for (const entry of bucket) {
        values.push(entry.value);
      }
    }

    return values;
  }

  size(): number {
    return this.entriesCount;
  }

  loadFactor(): number {
    return this.entriesCount / this.buckets.length;
  }

  private bucketFor(key: K): Array<Entry<K, V>> {
    const index = this.hashFunction.hash(key) % this.buckets.length;
    return this.buckets[index];
  }

  private resizeWhenCrowded(): void {
    if (this.loadFactor() < 0.75) {
      return;
    }

    const entries = this.entries();
    this.buckets = this.emptyBuckets(this.buckets.length * 2 + 1);
    this.entriesCount = 0;

    for (const entry of entries) {
      this.set(entry.key, entry.value);
    }
  }

  private entries(): Array<Entry<K, V>> {
    const entries: Array<Entry<K, V>> = [];

    for (const bucket of this.buckets) {
      for (const entry of bucket) {
        entries.push(entry);
      }
    }

    return entries;
  }

  private emptyBuckets(bucketCount: number): Array<Array<Entry<K, V>>> {
    return Array.from({ length: bucketCount }, () => []);
  }
}
