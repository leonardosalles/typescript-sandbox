export type FileId = string;

export interface StoredFile {
  readonly id: FileId;
  readonly name: string;
  readonly mimeType: string;
  readonly size: number;
  readonly encryptedSize: number;
  readonly iv: Uint8Array;
  readonly createdAt: Date;
  readonly deletedAt?: Date;
}

export function createStoredFile(input: StoredFile): StoredFile {
  const name = input.name.trim();
  if (!name) throw new Error("File name cannot be empty");
  if (input.size < 0) throw new Error("File size cannot be negative");
  if (input.iv.byteLength !== 12) throw new Error("AES-GCM required");
  return Object.freeze({ ...input, name });
}
