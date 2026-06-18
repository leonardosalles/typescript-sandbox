export interface EncryptedPayload {
  readonly cipherText: ArrayBuffer;
  readonly iv: Uint8Array;
}

export interface CryptoService {
  encrypt(plaintext: ArrayBuffer): Promise<EncryptedPayload>;
  decrypt(cipherText: ArrayBuffer, iv: Uint8Array): Promise<ArrayBuffer>;
}
