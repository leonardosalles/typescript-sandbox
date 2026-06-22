import { FileShareService } from "../application/FileShareService";
import {
  CryptoIdGenerator,
  SystemClock,
} from "../application/ports/SystemServices";
import { InMemoryBlobStorage } from "./InMemoryBlobStorage";
import { InMemoryFileRepository } from "./InMemoryFileRepository";
import { WebCryptoAesGcmService } from "./WebCryptoAesGcmService";

export async function createFileShareService(): Promise<FileShareService> {
  return new FileShareService(
    new InMemoryFileRepository(),
    new InMemoryBlobStorage(),
    await WebCryptoAesGcmService.create(),
    new SystemClock(),
    new CryptoIdGenerator(),
  );
}
