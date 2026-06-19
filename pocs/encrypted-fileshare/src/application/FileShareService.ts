import {
  createStoredFile,
  type FileId,
  type StoredFile,
} from "../domain/StoredFile";
import type { BlobStorage } from "./ports/BlobStorage";
import type { CryptoService } from "./ports/CryptoService";
import type { FileRepository } from "./ports/FileRepository";
import type { Clock, IdGenerator } from "./ports/SystemServices";

export interface SaveFileInput {
  readonly name: string;
  readonly mimeType: string;
  readonly bytes: ArrayBuffer;
}

export interface DownloadedFile {
  readonly metadata: StoredFile;
  readonly bytes: ArrayBuffer;
}

export class FileNotFoundError extends Error {
  constructor(id: FileId) {
    super(`File not found: ${id}`);
    this.name = "FileNotFoundError";
  }
}

export class FileShareService {
  constructor(
    private readonly files: FileRepository,
    private readonly blobs: BlobStorage,
    private readonly crypto: CryptoService,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
  ) {}

  async save(input: SaveFileInput): Promise<StoredFile> {
    const id = this.ids.next();
    const encrypted = await this.crypto.encrypt(input.bytes);
    const file = createStoredFile({
      id,
      name: input.name,
      mimeType: input.mimeType || "application/octet-stream",
      size: input.bytes.byteLength,
      encryptedSize: encrypted.cipherText.byteLength,
      iv: encrypted.iv,
      createdAt: this.clock.now(),
    });

    await this.blobs.put(id, encrypted.cipherText);
    try {
      await this.files.save(file);
    } catch (error) {
      await this.blobs.delete(id);
      throw error;
    }
    return file;
  }

  async download(id: FileId): Promise<DownloadedFile> {
    const metadata = await this.files.findById(id);
    const cipherText = await this.blobs.get(id);
    if (!metadata || !cipherText) throw new FileNotFoundError(id);
    return {
      metadata,
      bytes: await this.crypto.decrypt(cipherText, metadata.iv),
    };
  }

  async delete(id: FileId): Promise<void> {
    const metadata = await this.files.findById(id);
    if (!metadata) throw new FileNotFoundError(id);
    await this.files.save(
      createStoredFile({ ...metadata, deletedAt: this.clock.now() }),
    );
  }

  async restore(id: FileId): Promise<void> {
    const metadata = await this.files.findById(id);
    if (!metadata?.deletedAt) throw new FileNotFoundError(id);
    const { deletedAt: _, ...activeMetadata } = metadata;
    await this.files.save(createStoredFile(activeMetadata));
  }

  async permanentlyDelete(id: FileId): Promise<void> {
    const metadata = await this.files.findById(id);
    if (!metadata?.deletedAt) throw new FileNotFoundError(id);
    await this.blobs.delete(id);
    await this.files.delete(id);
  }

  async list(): Promise<readonly StoredFile[]> {
    return [...(await this.files.list())]
      .filter((file) => !file.deletedAt)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async listTrash(): Promise<readonly StoredFile[]> {
    return [...(await this.files.list())]
      .filter((file) => Boolean(file.deletedAt))
      .sort((a, b) => b.deletedAt!.getTime() - a.deletedAt!.getTime());
  }

  async search(query: string): Promise<readonly StoredFile[]> {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return this.list();
    return (await this.list()).filter(
      (file) =>
        file.name.toLocaleLowerCase().includes(normalized) ||
        file.mimeType.toLocaleLowerCase().includes(normalized),
    );
  }
}
