/**
 * Shared Ignore Patterns for i18n Testing
 * Common patterns to ignore when scanning for hardcoded strings
 */

export const BASE_IGNORE_PATTERNS = [
  "^[a-z]+[A-Z][a-z]*$", // camelCase
  "^[A-Z_]+$", // CONSTANTS
  "^[0-9]+$", // numbers
  "^[a-z]{1,2}$", // short strings
  "^(id|class|type|name|value|key|index|count|size|width|height|color|url|path|file|dir|src|alt|title|role|aria|data|test|spec|mock|stub|fixture)$",
];

export const DOMAIN_SPECIFIC_PATTERNS = {
  auth: ["token", "jwt", "oauth", "saml", "ldap"],
  chat: ["message", "chat", "conversation", "thread"],
  gallery: ["image", "photo", "gallery", "album"],
  settings: ["setting", "config", "preference"],
  themes: ["theme", "color", "palette", "dark", "light"],
  charts: ["chart", "graph", "plot", "axis", "series", "data"],
  floatingPanel: ["panel", "modal", "dialog", "popup"],
  caption: ["caption", "annotation", "label"],
  boundingBox: ["bbox", "bounding", "box", "rectangle"],
  audio: ["audio", "sound", "music", "play", "pause", "stop", "volume"],
  video: ["video", "movie", "film", "play", "pause", "stop", "volume"],
  image: ["image", "photo", "picture", "img"],
  multimodal: ["multimodal", "media", "content"],
  rag: ["rag", "retrieval", "augmented", "generation", "search", "query"],
  monaco: ["monaco", "editor", "code", "syntax", "highlight"],
  threeD: ["3d", "three", "webgl", "mesh", "model", "scene", "camera", "light"],
  games: ["game", "play", "score", "level", "player", "enemy"],
  i18n: ["locale", "translation", "i18n", "plural", "rtl", "ltr"],
  colorPicker: ["oklch", "rgb", "hsl", "hex"],
  core: [
    "core",
    "base",
    "foundation",
    "utility",
    "util",
    "common",
    "shared",
    "base",
    "client",
    "composable",
    "module",
    "executor",
    "security",
    "validation",
    "crypto",
    "storage",
    "cache",
    "lazy",
    "export",
    "registry",
  ],
} as const;

/**
 * Create ignore patterns for a specific domain
 */
export function createIgnorePatterns(domain?: keyof typeof DOMAIN_SPECIFIC_PATTERNS): string[] {
  const patterns = [...BASE_IGNORE_PATTERNS];

  if (domain && DOMAIN_SPECIFIC_PATTERNS[domain]) {
    const domainPattern = `^(${DOMAIN_SPECIFIC_PATTERNS[domain].join("|")})$`;
    patterns.push(domainPattern);
  }

  return patterns;
}
