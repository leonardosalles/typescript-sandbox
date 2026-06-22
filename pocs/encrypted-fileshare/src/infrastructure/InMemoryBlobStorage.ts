import type { BlobStorage } from "../application/ports/BlobStorage";
import type { FileId } from "../domain/StoredFile";

export class InMemoryBlobStorage implements BlobStorage {
  private readonly blobs = new Map<FileId, ArrayBuffer>();

  async put(id: FileId, data: ArrayBuffer): Promise<void> {
    this.blobs.set(id, data.slice(0));
  }
  async get(id: FileId): Promise<ArrayBuffer | undefined> {
    return this.blobs.get(id)?.slice(0);
  }
  async delete(id: FileId): Promise<void> {
    this.blobs.delete(id);
  }

  corrupt(id: FileId): void {
    const blob = this.blobs.get(id);
    if (!blob?.byteLength) return;
    const changed = new Uint8Array(blob.slice(0));
    changed[0] = (changed[0] ?? 0) ^ 0xff;
    this.blobs.set(id, changed.buffer);
  }
}
