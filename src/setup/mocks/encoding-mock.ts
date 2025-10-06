/**
 * Encoding API Mock - Provides TextEncoder/TextDecoder and base64 utilities for tests
 */

import { vi } from "vitest";

/**
 * Mock btoa/atob base64 encoding
 */
export function mockBase64() {
  global.btoa = vi.fn((str: string) => Buffer.from(str, "binary").toString("base64"));
  global.atob = vi.fn((str: string) => Buffer.from(str, "base64").toString("binary"));
}

/**
 * Mock TextEncoder/TextDecoder
 */
export function mockTextEncoding() {
  global.TextEncoder = class TextEncoder {
    encode(input: string): Uint8Array {
      return new Uint8Array(Buffer.from(input, "utf8"));
    }
    encodeInto(input: string, destination: Uint8Array): { read: number; written: number } {
      const encoded = this.encode(input);
      const written = Math.min(encoded.length, destination.length);
      destination.set(encoded.subarray(0, written));
      return { read: input.length, written };
    }
    get encoding() {
      return "utf-8";
    }
  } as any;

  global.TextDecoder = class TextDecoder {
    constructor(
      public encoding = "utf-8",
      public fatal = false,
      public ignoreBOM = false
    ) {}
    decode(input: Uint8Array): string {
      return Buffer.from(input).toString("utf8");
    }
  } as any;
}
