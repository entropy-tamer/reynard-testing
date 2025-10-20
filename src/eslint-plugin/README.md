# Reynard ESLint Plugin

A comprehensive ESLint plugin for Reynard projects that provides rules for internationalization (i18n), accessibility, and performance optimization.

## Features

### 🌍 Internationalization (i18n) Rules

- **no-hardcoded-strings**: Detects hardcoded strings that should be internationalized
- **no-untranslated-keys**: Validates that translation keys exist in translation files
- **prefer-i18n-keys**: Suggests i18n keys over string concatenation

### ♿ Accessibility Rules

- **no-missing-alt**: Ensures images have proper alt attributes
- **aria-props**: Validates ARIA attribute usage
- **keyboard-navigation**: Ensures interactive elements have keyboard support

### ⚡ Performance Rules

- **no-unnecessary-rerenders**: Detects potential unnecessary re-renders in SolidJS
- **prefer-memo**: Suggests memoization for expensive computations

## Installation

The plugin is included with the `@entropy-tamer/reynard-testing` package:

```bash
npm install @entropy-tamer/reynard-testing
```

## Configuration

### Basic Setup

Add the plugin to your ESLint configuration:

```javascript
import { plugin as reynardPlugin } from "@entropy-tamer/reynard-testing/eslint-plugin";

export default [
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      "@reynard/testing": reynardPlugin,
    },
    rules: {
      ...reynardPlugin.configs.recommended.rules,
    },
  },
];
```

### Preset Configurations

The plugin provides several preset configurations:

#### Recommended (Default)

```javascript
rules: {
  ...reynardPlugin.configs.recommended.rules,
}
```

#### i18n Focused

```javascript
rules: {
  ...reynardPlugin.configs.i18n.rules,
}
```

#### Accessibility Focused

```javascript
rules: {
  ...reynardPlugin.configs.accessibility.rules,
}
```

#### Performance Focused

```javascript
rules: {
  ...reynardPlugin.configs.performance.rules,
}
```

## Rule Documentation

### i18n Rules

#### no-hardcoded-strings

Detects hardcoded strings in JSX/TSX files that should be internationalized.

**Options:**

- `enabled` (boolean): Enable/disable the rule (default: true)
- `ignorePatterns` (string[]): Regex patterns to ignore (default: [])
- `minLength` (number): Minimum string length to check (default: 3)
- `autoFix` (boolean): Enable automatic fixes (default: false)

**Example:**

```typescript
// ❌ Bad
<div>Hello World</div>

// ✅ Good
<div>{t("greeting.hello")}</div>
```

#### no-untranslated-keys

Validates that translation keys exist in translation files.

**Options:**

- `enabled` (boolean): Enable/disable the rule (default: true)
- `strictMode` (boolean): Enable strict mode (default: false)
- `translationFiles` (string[]): Glob patterns for translation files (default: ['src/lang/**/*.ts'])
- `autoFix` (boolean): Enable automatic fixes (default: false)

**Example:**

```typescript
// ❌ Bad - key doesn't exist in translation files
t("nonexistent.key")

// ✅ Good - key exists in translation files
t("themes.select")
```

#### prefer-i18n-keys

Suggests i18n keys over string concatenation.

**Options:**

- `enabled` (boolean): Enable/disable the rule (default: true)
- `ignorePatterns` (string[]): Regex patterns to ignore (default: [])
- `autoFix` (boolean): Enable automatic fixes (default: false)

**Example:**

```typescript
// ❌ Bad
const message = "Hello " + name + "!";

// ✅ Good
const message = t("greeting.personal", { name });
```

### Accessibility Rules

#### no-missing-alt

Ensures images have proper alt attributes for accessibility.

**Options:**

- `enabled` (boolean): Enable/disable the rule (default: true)
- `requireAlt` (boolean): Require alt attribute (default: true)
- `ignorePatterns` (string[]): Regex patterns to ignore (default: [])

**Example:**

```typescript
// ❌ Bad
<img src="image.jpg" />

// ✅ Good
<img src="image.jpg" alt="Descriptive text" />

// ✅ Good for decorative images
<img src="decoration.jpg" alt="" />
```

#### aria-props

Validates ARIA attribute usage.

**Options:**

- `enabled` (boolean): Enable/disable the rule (default: true)
- `validateAria` (boolean): Enable ARIA validation (default: true)
- `ignorePatterns` (string[]): Regex patterns to ignore (default: [])

**Example:**

```typescript
// ❌ Bad
<div role="invalid-role" aria-invalid="maybe" />

// ✅ Good
<div role="button" aria-pressed="false" />
```

#### keyboard-navigation

Ensures interactive elements have proper keyboard navigation support.

**Options:**

- `enabled` (boolean): Enable/disable the rule (default: true)
- `checkKeyboard` (boolean): Enable keyboard checks (default: true)
- `ignorePatterns` (string[]): Regex patterns to ignore (default: [])

**Example:**

```typescript
// ❌ Bad
<div onClick={handleClick}>Click me</div>

// ✅ Good
<div 
  onClick={handleClick} 
  onKeyDown={handleKeyDown}
  tabIndex={0}
  role="button"
>
  Click me
</div>
```

### Performance Rules

#### no-unnecessary-rerenders

Detects potential unnecessary re-renders in SolidJS components.

**Options:**

- `enabled` (boolean): Enable/disable the rule (default: true)
- `checkRerenders` (boolean): Enable re-render checks (default: true)
- `ignorePatterns` (string[]): Regex patterns to ignore (default: [])

**Example:**

```typescript
// ❌ Bad
<Component onClick={() => doSomething()} />

// ✅ Good
const handleClick = () => doSomething();
<Component onClick={handleClick} />
```

#### prefer-memo

Suggests memoization for expensive computations.

**Options:**

- `enabled` (boolean): Enable/disable the rule (default: true)
- `checkMemoization` (boolean): Enable memoization checks (default: true)
- `ignorePatterns` (string[]): Regex patterns to ignore (default: [])

**Example:**

```typescript
// ❌ Bad
const expensiveValue = items.map(item => item.value * 2);

// ✅ Good
const expensiveValue = createMemo(() => items.map(item => item.value * 2));
```

## Advanced Configuration

### Custom Rule Configuration

You can configure individual rules with custom options:

```javascript
rules: {
  "@reynard/testing/i18n/no-hardcoded-strings": [
    "error",
    {
      ignorePatterns: ["^[A-Z_]+$", "^[0-9]+$"],
      minLength: 5,
      autoFix: true,
    },
  ],
  "@reynard/testing/accessibility/no-missing-alt": [
    "error",
    {
      requireAlt: true,
      ignorePatterns: ["decorative", "icon"],
    },
  ],
}
```

### Translation File Configuration

Configure translation file patterns for your project:

```javascript
rules: {
  "@reynard/testing/i18n/no-untranslated-keys": [
    "warn",
    {
      translationFiles: [
        "src/lang/**/*.ts",
        "packages/*/src/lang/**/*.ts",
        "apps/*/src/lang/**/*.ts",
      ],
      strictMode: true,
    },
  ],
}
```

## VSCode Integration

The plugin works seamlessly with VSCode's ESLint extension. Add this to your `.vscode/settings.json`:

```json
{
  "eslint.options": {
    "extensions": [".js", ".jsx", ".ts", ".tsx"],
    "overrideConfigFile": "eslint.config.js"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.probe": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

## Troubleshooting

### Common Issues

#### Translation files not found

Make sure your `translationFiles` patterns match your project structure:

```javascript
translationFiles: ["src/lang/**/*.ts", "packages/*/src/lang/**/*.ts"]
```

#### Performance issues

If the plugin is slow, try:

1. Reducing the scope of `translationFiles` patterns
2. Using `strictMode: false` for development
3. Adding more specific `ignorePatterns`

#### False positives

Add appropriate `ignorePatterns` to exclude technical terms:

```javascript
ignorePatterns: [
  "^[A-Z_]+$", // CONSTANTS
  "^[0-9]+$", // numbers
  "^(id|class|type|name)$", // technical terms
]
```

### Debug Mode

Enable debug mode to see what the plugin is doing:

```javascript
rules: {
  "@reynard/testing/i18n/no-untranslated-keys": [
    "warn",
    {
      strictMode: true, // Shows warnings for loading issues
    },
  ],
}
```

## Contributing

To contribute to the plugin:

1. Add new rules in the appropriate category directory
2. Update the main plugin export
3. Add tests for new rules
4. Update this documentation

## License

MIT License - see the main Reynard project for details.


