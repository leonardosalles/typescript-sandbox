import type {
  CryptoService,
  EncryptedPayload,
} from "../application/ports/CryptoService";

export class WebCryptoAesGcmService implements CryptoService {
  private constructor(private readonly key: CryptoKey) {}

  static async create(): Promise<WebCryptoAesGcmService> {
    const key = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    );
    return new WebCryptoAesGcmService(key);
  }

  async encrypt(plaintext: ArrayBuffer): Promise<EncryptedPayload> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const cipherText = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      this.key,
      plaintext,
    );
    return { cipherText, iv };
  }

  async decrypt(cipherText: ArrayBuffer, iv: Uint8Array): Promise<ArrayBuffer> {
    const bufferBackedIv = new Uint8Array(iv.byteLength);
    bufferBackedIv.set(iv);
    return crypto.subtle.decrypt(
      { name: "AES-GCM", iv: bufferBackedIv },
      this.key,
      cipherText,
    );
  }
}
