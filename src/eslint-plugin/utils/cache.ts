/**
 * @file Caching system for the Reynard ESLint plugin
 * Provides efficient caching for loaded translations and parsed files
 */

import type { CacheEntry, CacheOptions } from '../types.js';
import {
  generateTranslationCacheKey as generateTranslationCacheKeyAdvanced,
  checkTranslationFilesModified
} from './i18n-integration.js';

// ============================================================================
// Generic Cache Implementation
// ============================================================================

/**
 * Generic cache class with TTL and size management
 * @template T - Type of cached values
 */
export class RuleCache<T> {
  private cache: Map<string, CacheEntry<T>>;
  private ttl: number;
  private maxSize: number;
  private cleanupInterval: number;
  private cleanupTimer?: NodeJS.Timeout;

  constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.ttl = options.ttl || 60000; // 1 minute default
    this.maxSize = options.maxSize || 1000; // 1000 entries default
    this.cleanupInterval = options.cleanupInterval || 30000; // 30 seconds default

    // Don't start cleanup timer for ESLint rules to avoid hanging
    // this.startCleanupTimer();
  }

  /**
   * Get value from cache
   * @param key - Cache key
   * @returns Cached value or undefined
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return undefined;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    // Manual cleanup check to prevent memory leaks
    if (this.cache.size > this.maxSize) {
      this.cleanup();
    }

    return entry.value;
  }

  /**
   * Set value in cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param customTtl - Custom TTL for this entry
   */
  set(key: string, value: T, customTtl?: number): void {
    // Check if we need to evict entries
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl: customTtl || this.ttl,
    };

    this.cache.set(key, entry);
  }

  /**
   * Check if key exists in cache
   * @param key - Cache key
   * @returns True if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete entry from cache
   * @param key - Cache key
   * @returns True if entry was deleted
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all entries from cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   * @returns Cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    entries: Array<{ key: string; age: number; ttl: number }>;
  } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: now - entry.timestamp,
      ttl: entry.ttl,
    }));

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0, // TODO: Implement hit rate tracking
      entries,
    };
  }

  /**
   * Evict the oldest entry
   */
  private evictOldest(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Start cleanup timer
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  /**
   * Stop cleanup timer
   */
  private stopCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key);
      }
    }

    for (const key of expiredKeys) {
      this.cache.delete(key);
    }
  }

  /**
   * Destroy cache and cleanup resources
   */
  destroy(): void {
    this.stopCleanupTimer();
    this.clear();
  }
}

// ============================================================================
// Specialized Caches
// ============================================================================

/**
 * Translation file cache
 */
export class TranslationCache extends RuleCache<Record<string, any>> {
  constructor(options: CacheOptions = {}) {
    super({
      ttl: 300000, // 5 minutes default for translation files
      maxSize: 100, // 100 translation files
      ...options,
    });
  }
}

/**
 * AST cache for parsed files
 */
export class ASTCache extends RuleCache<any> {
  constructor(options: CacheOptions = {}) {
    super({
      ttl: 60000, // 1 minute default for AST
      maxSize: 500, // 500 parsed files
      ...options,
    });
  }
}

/**
 * File content cache
 */
export class FileContentCache extends RuleCache<string> {
  constructor(options: CacheOptions = {}) {
    super({
      ttl: 120000, // 2 minutes default for file content
      maxSize: 200, // 200 files
      ...options,
    });
  }
}

// ============================================================================
// Cache Manager
// ============================================================================

/**
 * Central cache manager for the ESLint plugin
 */
export class CacheManager {
  private translationCache: TranslationCache;
  private astCache: ASTCache;
  private fileContentCache: FileContentCache;

  constructor(options: {
    translation?: CacheOptions;
    ast?: CacheOptions;
    fileContent?: CacheOptions;
  } = {}) {
    this.translationCache = new TranslationCache(options.translation);
    this.astCache = new ASTCache(options.ast);
    this.fileContentCache = new FileContentCache(options.fileContent);
  }

  /**
   * Get translation cache
   */
  getTranslationCache(): TranslationCache {
    return this.translationCache;
  }

  /**
   * Get AST cache
   */
  getASTCache(): ASTCache {
    return this.astCache;
  }

  /**
   * Get file content cache
   */
  getFileContentCache(): FileContentCache {
    return this.fileContentCache;
  }

  /**
   * Clear all caches
   */
  clearAll(): void {
    this.translationCache.clear();
    this.astCache.clear();
    this.fileContentCache.clear();
  }

  /**
   * Get statistics for all caches
   */
  getAllStats(): {
    translation: ReturnType<TranslationCache['getStats']>;
    ast: ReturnType<ASTCache['getStats']>;
    fileContent: ReturnType<FileContentCache['getStats']>;
  } {
    return {
      translation: this.translationCache.getStats(),
      ast: this.astCache.getStats(),
      fileContent: this.fileContentCache.getStats(),
    };
  }

  /**
   * Destroy all caches
   */
  destroy(): void {
    this.translationCache.destroy();
    this.astCache.destroy();
    this.fileContentCache.destroy();
  }
}

// ============================================================================
// Global Cache Instance
// ============================================================================

/**
 * Global cache manager instance
 */
export const globalCacheManager = new CacheManager();

// ============================================================================
// Cache Utilities
// ============================================================================

/**
 * Generate cache key for file path
 * @param filePath - File path
 * @param suffix - Optional suffix
 * @returns Cache key
 */
export function generateFileCacheKey(filePath: string, suffix?: string): string {
  const normalizedPath = filePath.replace(/\\/g, '/');
  return suffix ? `${normalizedPath}:${suffix}` : normalizedPath;
}

/**
 * Generate cache key for translation files
 * @param patterns - File patterns
 * @param locale - Locale
 * @returns Cache key
 */
export function generateTranslationCacheKey(patterns: string[], locale?: string): string {
  const patternsKey = patterns.sort().join('|');
  return locale ? `${patternsKey}:${locale}` : patternsKey;
}

/**
 * Generate cache key for AST
 * @param filePath - File path
 * @param options - Parser options
 * @returns Cache key
 */
export function generateASTCacheKey(filePath: string, options: any = {}): string {
  const optionsKey = JSON.stringify(options);
  return `${filePath}:ast:${optionsKey}`;
}

// ============================================================================
// Enhanced Caching with File Watching
// ============================================================================

/**
 * Enhanced translation cache with file modification checking
 */
export class EnhancedTranslationCache extends TranslationCache {
  private fileModificationTimes: Map<string, number> = new Map();

  /**
   * Check if translation files have been modified and invalidate cache if needed
   * @param patterns - File patterns to check
   */
  checkAndInvalidateIfModified(patterns: string[]): void {
    const cacheKey = generateTranslationCacheKeyAdvanced(patterns);
    const lastCacheTime = this.getLastCacheTime(cacheKey);
    
    if (checkTranslationFilesModified(patterns, lastCacheTime)) {
      this.clear();
      this.updateCacheTime(cacheKey);
    }
  }

  /**
   * Get last cache time for a pattern
   */
  private getLastCacheTime(cacheKey: string): number {
    return this.fileModificationTimes.get(cacheKey) || 0;
  }

  /**
   * Update cache time for a pattern
   */
  private updateCacheTime(cacheKey: string): void {
    this.fileModificationTimes.set(cacheKey, Date.now());
  }

  /**
   * Set value with automatic file modification tracking
   */
  set(key: string, value: Record<string, any>, customTtl?: number): void {
    super.set(key, value, customTtl);
    this.updateCacheTime(key);
  }
}

/**
 * Enhanced cache manager with file watching capabilities
 */
export class EnhancedCacheManager extends CacheManager {
  private enhancedTranslationCache: EnhancedTranslationCache;

  constructor(options: {
    translation?: CacheOptions;
    ast?: CacheOptions;
    fileContent?: CacheOptions;
  } = {}) {
    super(options);
    this.enhancedTranslationCache = new EnhancedTranslationCache(options.translation);
  }

  /**
   * Get enhanced translation cache
   */
  getEnhancedTranslationCache(): EnhancedTranslationCache {
    return this.enhancedTranslationCache;
  }

  /**
   * Check and invalidate translation cache if files have been modified
   */
  checkTranslationFiles(patterns: string[]): void {
    this.enhancedTranslationCache.checkAndInvalidateIfModified(patterns);
  }
}

/**
 * Global enhanced cache manager instance
 */
export const globalEnhancedCacheManager = new EnhancedCacheManager();

// All exports are already done above with individual export statements
