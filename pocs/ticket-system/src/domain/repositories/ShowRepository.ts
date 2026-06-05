import { Show } from "../Show";
import { ShowId } from "../value-objects/ShowId";

export interface ShowRepository {
  findById(id: ShowId): Show | undefined;
  save(show: Show): void;
  all(): Show[];
}
