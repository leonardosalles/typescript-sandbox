import type { FileId } from "../../domain/StoredFile";

export interface BlobStorage {
  put(id: FileId, data: ArrayBuffer): Promise<void>;
  get(id: FileId): Promise<ArrayBuffer | undefined>;
  delete(id: FileId): Promise<void>;
}
