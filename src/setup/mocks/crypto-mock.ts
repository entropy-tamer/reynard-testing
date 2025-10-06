/**
 * Crypto API Mock - Provides crypto functionality for tests
 */

import { vi } from "vitest";

/**
 * Mock crypto API with randomUUID, getRandomValues, and subtle crypto
 */
export function mockCrypto() {
  Object.defineProperty(global, "crypto", {
    value: {
      randomUUID: vi.fn().mockReturnValue("00000000-0000-4000-8000-000000000000"),
      getRandomValues: vi.fn().mockImplementation((array: Uint8Array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
        return array;
      }),
      subtle: {
        digest: vi.fn(async (algorithm: string, data: Uint8Array) => {
          const hash = new Uint8Array(32);
          const algorithmOffset = algorithm === "SHA-1" ? 100 : 200;
          const dataHash = data.reduce((acc, byte) => acc + byte, 0);
          for (let i = 0; i < hash.length; i++) {
            hash[i] = (data[i % data.length] + i + algorithmOffset + dataHash) % 256;
          }
          return hash;
        }),
      } as any,
    },
    writable: true,
    configurable: true,
  });
}
