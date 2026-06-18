import type { FileId, StoredFile } from "../../domain/StoredFile";

export interface FileRepository {
  save(file: StoredFile): Promise<void>;
  findById(id: FileId): Promise<StoredFile | undefined>;
  list(): Promise<readonly StoredFile[]>;
  delete(id: FileId): Promise<void>;
}
