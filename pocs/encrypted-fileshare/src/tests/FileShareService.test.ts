import { describe, expect, it } from "vitest";
import {
  FileShareService,
  FileNotFoundError,
} from "../application/FileShareService";
import type { Clock, IdGenerator } from "../application/ports/SystemServices";
import { InMemoryBlobStorage } from "../infrastructure/InMemoryBlobStorage";
import { InMemoryFileRepository } from "../infrastructure/InMemoryFileRepository";
import { WebCryptoAesGcmService } from "../infrastructure/WebCryptoAesGcmService";

class FixedClock implements Clock {
  now() {
    return new Date("2026-06-23T12:00:00Z");
  }
}
class SequenceIds implements IdGenerator {
  private value = 0;
  next() {
    return `file-${++this.value}`;
  }
}

async function fixture() {
  const repository = new InMemoryFileRepository();
  const blobs = new InMemoryBlobStorage();
  const service = new FileShareService(
    repository,
    blobs,
    await WebCryptoAesGcmService.create(),
    new FixedClock(),
    new SequenceIds(),
  );
  return { service, blobs };
}

describe("encrypted file lifecycle", () => {
  it("encrypts, lists and downloads the exact original bytes", async () => {
    const { service } = await fixture();
    const original = new TextEncoder().encode("deep POC secret");
    const saved = await service.save({
      name: "notes.txt",
      mimeType: "text/plain",
      bytes: original.buffer,
    });

    expect(saved.encryptedSize).toBe(original.byteLength + 16); // GCM authentication tag
    expect(await service.list()).toHaveLength(1);
    const downloaded = await service.download(saved.id);
    expect(new Uint8Array(downloaded.bytes)).toEqual(original);
  });

  it("searches case-insensitively by name or MIME type", async () => {
    const { service } = await fixture();
    await service.save({
      name: "Quarterly Report.PDF",
      mimeType: "application/pdf",
      bytes: new ArrayBuffer(1),
    });
    await service.save({
      name: "logo.svg",
      mimeType: "image/svg+xml",
      bytes: new ArrayBuffer(1),
    });
    expect((await service.search("report")).map((f) => f.name)).toEqual([
      "Quarterly Report.PDF",
    ]);
    expect((await service.search("IMAGE")).map((f) => f.name)).toEqual([
      "logo.svg",
    ]);
  });

  it("moves a file to trash and restores it without losing its blob", async () => {
    const { service } = await fixture();
    const saved = await service.save({
      name: "gone.txt",
      mimeType: "text/plain",
      bytes: new ArrayBuffer(2),
    });
    await service.delete(saved.id);
    expect(await service.list()).toEqual([]);
    expect(await service.listTrash()).toHaveLength(1);

    await service.restore(saved.id);
    expect(await service.list()).toHaveLength(1);
    expect(await service.listTrash()).toEqual([]);
    expect((await service.download(saved.id)).bytes.byteLength).toBe(2);
  });

  it("permanently deletes metadata and ciphertext only from trash", async () => {
    const { service } = await fixture();
    const saved = await service.save({
      name: "gone.txt",
      mimeType: "text/plain",
      bytes: new ArrayBuffer(2),
    });
    await expect(service.permanentlyDelete(saved.id)).rejects.toBeInstanceOf(
      FileNotFoundError,
    );
    await service.delete(saved.id);
    await service.permanentlyDelete(saved.id);
    expect(await service.listTrash()).toEqual([]);
    await expect(service.download(saved.id)).rejects.toBeInstanceOf(
      FileNotFoundError,
    );
  });

  it("detects a single-bit cipherText modification", async () => {
    const { service, blobs } = await fixture();
    const saved = await service.save({
      name: "contract.pdf",
      mimeType: "application/pdf",
      bytes: new Uint8Array([1, 2, 3]).buffer,
    });
    blobs.corrupt(saved.id);
    await expect(service.download(saved.id)).rejects.toMatchObject({
      name: "OperationError",
    });
  });

  it("uses a fresh IV so identical inputs produce different cipherText", async () => {
    const { service } = await fixture();
    const bytes = new TextEncoder().encode("same content").buffer;
    const first = await service.save({
      name: "one.txt",
      mimeType: "text/plain",
      bytes,
    });
    const second = await service.save({
      name: "two.txt",
      mimeType: "text/plain",
      bytes,
    });
    expect(first.iv).not.toEqual(second.iv);
  });
});
