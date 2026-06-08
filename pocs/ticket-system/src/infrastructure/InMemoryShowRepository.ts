import { HashTable } from "../domain/collections/HashTable";
import { StringHashFunction } from "../domain/collections/HashFunction";
import { ShowRepository } from "../domain/repositories/ShowRepository";
import { Show } from "../domain/Show";
import { ShowId } from "../domain/value-objects/ShowId";

export class InMemoryShowRepository implements ShowRepository {
  private readonly shows: HashTable<string, Show>;

  constructor(initialShows: Show[] = []) {
    const stringHash = new StringHashFunction();
    this.shows = new HashTable<string, Show>(stringHash, stringHash);

    for (const show of initialShows) {
      this.save(show);
    }
  }

  findById(id: ShowId): Show | undefined {
    return this.shows.get(id.asString());
  }

  save(show: Show): void {
    this.shows.set(show.id.asString(), show);
  }

  all(): Show[] {
    return this.shows.values();
  }
}
