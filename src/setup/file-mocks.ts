/**
 * File API Mocks - For testing file operations
 */

/**
 * Setup File and FileReader mocks for testing
 */
export function setupFileMocks() {
  // Mock File API
  global.File = class MockFile {
    name: string;
    size: number;
    type: string;
    lastModified: number;
    webkitRelativePath: string = "";

    constructor(
      _parts: (string | Blob | ArrayBuffer | ArrayBufferView)[],
      filename: string,
      options?: { size?: number; type?: string; lastModified?: number }
    ) {
      this.name = filename;
      this.size = options?.size || 0;
      this.type = options?.type || "";
      this.lastModified = options?.lastModified || Date.now();
    }

    static fromString(content: string, name: string, type?: string) {
      return new File([content], name, { type });
    }

    arrayBuffer(): Promise<ArrayBuffer> {
      return Promise.resolve(new ArrayBuffer(0));
    }

    bytes(): Promise<Uint8Array> {
      return Promise.resolve(new Uint8Array(0));
    }

    slice(_start?: number, _end?: number, _contentType?: string): Blob {
      return new Blob();
    }

    stream(): ReadableStream<Uint8Array> {
      return new ReadableStream();
    }

    text(): Promise<string> {
      return Promise.resolve("");
    }
  } as any;

  // Mock FileReader
  global.FileReader = class MockFileReader {
    result: string | ArrayBuffer | null = null;
    error: DOMException | null = null;
    readyState: number = 0;
    onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
    onerror: ((event: ProgressEvent<FileReader>) => void) | null = null;
    onloadend: ((event: ProgressEvent<FileReader>) => void) | null = null;
    onabort: ((event: ProgressEvent<FileReader>) => void) | null = null;
    onloadstart: ((event: ProgressEvent<FileReader>) => void) | null = null;
    onprogress: ((event: ProgressEvent<FileReader>) => void) | null = null;

    static readonly EMPTY = 0;
    static readonly LOADING = 1;
    static readonly DONE = 2;

    readAsText() {
      setTimeout(() => {
        this.result = "mock file content";
        this.readyState = 2;
        this.onload?.(new ProgressEvent("load") as any);
        this.onloadend?.(new ProgressEvent("loadend") as any);
      }, 0);
    }

    readAsDataURL() {
      setTimeout(() => {
        this.result = "data:text/plain;base64,bW9jayBmaWxlIGNvbnRlbnQ=";
        this.readyState = 2;
        this.onload?.(new ProgressEvent("load") as any);
        this.onloadend?.(new ProgressEvent("loadend") as any);
      }, 0);
    }

    readAsArrayBuffer() {
      setTimeout(() => {
        this.result = new ArrayBuffer(8);
        this.readyState = 2;
        this.onload?.(new ProgressEvent("load") as any);
        this.onloadend?.(new ProgressEvent("loadend") as any);
      }, 0);
    }

    abort() {
      this.readyState = 2;
    }
  } as any;
}
