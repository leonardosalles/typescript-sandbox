export interface HashFunction<K> {
  hash(key: K): number;
}

export interface Equality<K> {
  equals(left: K, right: K): boolean;
}

export class StringHashFunction
  implements HashFunction<string>, Equality<string>
{
  hash(key: string): number {
    let hash = 5381;

    for (const character of key) {
      hash = (hash * 33) ^ character.charCodeAt(0);
    }

    return Math.abs(hash);
  }

  equals(left: string, right: string): boolean {
    return left === right;
  }
}
