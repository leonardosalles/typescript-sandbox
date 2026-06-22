import type { FileRepository } from "../application/ports/FileRepository";
import type { FileId, StoredFile } from "../domain/StoredFile";

export class InMemoryFileRepository implements FileRepository {
  private readonly records = new Map<FileId, StoredFile>();

  async save(file: StoredFile): Promise<void> {
    this.records.set(file.id, file);
  }
  async findById(id: FileId): Promise<StoredFile | undefined> {
    return this.records.get(id);
  }
  async list(): Promise<readonly StoredFile[]> {
    return [...this.records.values()];
  }
  async delete(id: FileId): Promise<void> {
    this.records.delete(id);
  }
}
