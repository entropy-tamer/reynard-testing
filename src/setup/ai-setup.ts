/**
 * AI Test Setup - For packages that need AI/ML specific mocks
 */

import { vi } from "vitest";
import { setupCoreTest } from "./core-setup.js";

/**
 * Setup for AI packages (reynard-ai-shared, etc.)
 * Includes AI/ML specific mocks and performance monitoring
 */
export function setupAITest() {
  setupCoreTest();

  // Mock console methods for AI packages (often need to suppress logs)
  global.console = {
    ...console,
    log: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  // Mock GPU/WebGL APIs for AI packages
  global.WebGLRenderingContext = vi.fn().mockImplementation(() => ({
    createShader: vi.fn(),
    createProgram: vi.fn(),
    createBuffer: vi.fn(),
    createTexture: vi.fn(),
    createFramebuffer: vi.fn(),
    createRenderbuffer: vi.fn(),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    useProgram: vi.fn(),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    bindTexture: vi.fn(),
    texImage2D: vi.fn(),
    texParameteri: vi.fn(),
    bindFramebuffer: vi.fn(),
    bindRenderbuffer: vi.fn(),
    renderbufferStorage: vi.fn(),
    framebufferTexture2D: vi.fn(),
    framebufferRenderbuffer: vi.fn(),
    viewport: vi.fn(),
    clear: vi.fn(),
    clearColor: vi.fn(),
    drawArrays: vi.fn(),
    drawElements: vi.fn(),
    enable: vi.fn(),
    disable: vi.fn(),
    getParameter: vi.fn(),
    getShaderParameter: vi.fn(),
    getProgramParameter: vi.fn(),
    getError: vi.fn(() => 0),
    deleteShader: vi.fn(),
    deleteProgram: vi.fn(),
    deleteBuffer: vi.fn(),
    deleteTexture: vi.fn(),
    deleteFramebuffer: vi.fn(),
    deleteRenderbuffer: vi.fn(),
  })) as any;

  // Mock WebGL2RenderingContext
  global.WebGL2RenderingContext = vi.fn().mockImplementation(() => ({
    // WebGL2 specific methods
    createVertexArray: vi.fn(),
    bindVertexArray: vi.fn(),
    deleteVertexArray: vi.fn(),
    createTransformFeedback: vi.fn(),
    bindTransformFeedback: vi.fn(),
    deleteTransformFeedback: vi.fn(),
    beginTransformFeedback: vi.fn(),
    endTransformFeedback: vi.fn(),
    pauseTransformFeedback: vi.fn(),
    resumeTransformFeedback: vi.fn(),
    transformFeedbackVaryings: vi.fn(),
    getTransformFeedbackVarying: vi.fn(),
    createQuery: vi.fn(),
    beginQuery: vi.fn(),
    endQuery: vi.fn(),
    deleteQuery: vi.fn(),
    getQueryParameter: vi.fn(),
    createSampler: vi.fn(),
    bindSampler: vi.fn(),
    deleteSampler: vi.fn(),
    samplerParameteri: vi.fn(),
    samplerParameterf: vi.fn(),
    getSamplerParameter: vi.fn(),
    createSync: vi.fn(),
    deleteSync: vi.fn(),
    isSync: vi.fn(),
    clientWaitSync: vi.fn(),
    waitSync: vi.fn(),
    getSyncParameter: vi.fn(),
    fenceSync: vi.fn(),
    getInternalformatParameter: vi.fn(),
    invalidateFramebuffer: vi.fn(),
    invalidateSubFramebuffer: vi.fn(),
    readBuffer: vi.fn(),
    drawBuffers: vi.fn(),
    clearBufferfv: vi.fn(),
    clearBufferiv: vi.fn(),
    clearBufferuiv: vi.fn(),
    clearBufferfi: vi.fn(),
    copyBufferSubData: vi.fn(),
    getBufferSubData: vi.fn(),
    blitFramebuffer: vi.fn(),
    renderbufferStorageMultisample: vi.fn(),
    framebufferTextureLayer: vi.fn(),
    getUniformIndices: vi.fn(),
    getActiveUniforms: vi.fn(),
    getUniformBlockIndex: vi.fn(),
    getActiveUniformBlockParameter: vi.fn(),
    getActiveUniformBlockName: vi.fn(),
    uniformBlockBinding: vi.fn(),
    isVertexArray: vi.fn(),
  })) as any;

  // Mock WebGL context creation
  const mockCanvas = {
    getContext: vi.fn((contextType: string) => {
      if (contextType === "webgl") {
        return new WebGLRenderingContext();
      } else if (contextType === "webgl2") {
        return new WebGL2RenderingContext();
      }
      return null;
    }),
    width: 800,
    height: 600,
  };

  // Mock HTMLCanvasElement
  global.HTMLCanvasElement = vi.fn().mockImplementation(() => mockCanvas) as any;

  // Mock Web Workers for AI processing
  global.Worker = vi.fn().mockImplementation(() => ({
    postMessage: vi.fn(),
    terminate: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    onmessage: null,
    onerror: null,
  }));

  // Mock SharedArrayBuffer for AI data sharing
  global.SharedArrayBuffer = vi.fn().mockImplementation((length: number) => {
    return new ArrayBuffer(length);
  }) as any;
}
