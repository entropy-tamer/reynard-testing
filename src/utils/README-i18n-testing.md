# i18n Testing Utilities

Comprehensive internationalization testing tools for Reynard packages. These
utilities help detect hardcoded strings, validate translation completeness,
test RTL support, and ensure proper i18n implementation across the entire
project.

## Features

- 🔍 **Hardcoded String Detection**: Automatically find untranslated strings in
  JSX/TSX files
- 🌍 **Translation Validation**: Check for missing, unused, or incomplete
  translations
- 🔄 **RTL Support Testing**: Validate right-to-left language support
- 📊 **Performance Monitoring**: Measure i18n loading times and memory usage
- 🚀 **CI/CD Integration**: Automated checks for continuous integration
- 📝 **ESLint Plugin**: Real-time linting for hardcoded strings
- 📋 **Comprehensive Reporting**: Detailed reports with actionable insights

## Quick Start

### 1. Basic Usage

```typescript
import { runI18nTests, generateI18nReport } from "reynard-testing";

const config = {
  packages: ["packages/ui", "packages/core/i18n"],
  locales: ["en", "es", "fr", "de", "ru", "ar"],
  checkHardcodedStrings: true,
  validateCompleteness: true,
  testPluralization: true,
  testRTL: true,
  ignorePatterns: ["^[a-z]+[A-Z][a-z]*$", "^[A-Z_]+$"],
};

const result = await runI18nTests(config);
const report = generateI18nReport(result);
console.log(report);
```

### 2. ESLint Integration

Add to your `.eslintrc.js`:

```javascript
module.exports = {
  plugins: ["@reynard/i18n"],
  extends: ["plugin:@reynard/i18n/recommended"],
  rules: {
    "@reynard/i18n/no-hardcoded-strings": "error",
    "@reynard/i18n/no-untranslated-keys": "warn",
  },
};
```

### 3. Command Line Usage

```bash
# Run i18n linting on all packages
npx i18n-lint

# Check specific packages
npx i18n-lint --packages packages/ui,packages/core/i18n

# Check specific locales
npx i18n-lint --locales en,es,fr

# Skip certain checks
npx i18n-lint --no-hardcoded-strings --no-rtl
```

## API Reference

### `detectHardcodedStrings(filePath, content, config)`

Detects hardcoded strings in source code.

> _Parameters:_

- `filePath`: Path to the file being analyzed
- `content`: File content as string
- `config`: Configuration object

**Returns:** Array of `HardcodedStringResult` objects

> _Example:_

```typescript
const results = detectHardcodedStrings("Component.tsx", sourceCode, config);
results.forEach(result => {
  console.log(`${result.file}:${result.line}:${result.column} - "${result.text}"`);
  console.log(`Suggestion: ${result.suggestion}`);
});
```

### `validateTranslations(config)`

Validates translation completeness across locales.

> _Parameters:_

- `config`: Configuration object with locales to validate

**Returns:** Promise resolving to array of `TranslationValidationResult` objects

> _Example:_

```typescript
const results = await validateTranslations(config);
results.forEach(result => {
  console.log(`Locale: ${result.locale}`);
  console.log(`Missing keys: ${result.missingKeys.length}`);
  console.log(`Unused keys: ${result.unusedKeys.length}`);
});
```

### `runI18nTests(config)`

Runs comprehensive i18n tests.

> _Parameters:_

- `config`: Configuration object

**Returns:** Promise resolving to `I18nTestResult` object

> _Example:_

```typescript
const result = await runI18nTests(config);
console.log(`Hardcoded strings: ${result.hardcodedStrings.length}`);
console.log(`Load time: ${result.performanceMetrics.loadTime}ms`);
```

### `generateI18nReport(result)`

Generates a human-readable report from test results.

> _Parameters:_

- `result`: `I18nTestResult` object

**Returns:** Markdown-formatted report string

> _Example:_

```typescript
const report = generateI18nReport(result);
fs.writeFileSync("i18n-report.md", report);
```

## Configuration

### `I18nTestConfig`

```typescript
interface I18nTestConfig {
  packages: string[]; // Packages to test
  locales: string[]; // Locales to validate
  checkHardcodedStrings: boolean; // Enable hardcoded string detection
  validateCompleteness: boolean; // Enable translation validation
  testPluralization: boolean; // Enable pluralization testing
  testRTL: boolean; // Enable RTL support testing
  ignorePatterns: string[]; // Regex patterns to ignore
}
```

### Default Configuration

```typescript
const DEFAULT_CONFIG: I18nTestConfig = {
  packages: ["packages/*"],
  locales: ["en", "es", "fr", "de", "ru", "ar"],
  checkHardcodedStrings: true,
  validateCompleteness: true,
  testPluralization: true,
  testRTL: true,
  ignorePatterns: [
    "^[a-z]+[A-Z][a-z]*$", // camelCase
    "^[A-Z_]+$", // CONSTANTS
    "^[0-9]+$", // numbers
    "^[a-z]{1,2}$", // short strings
    "^(id|class|type|name|value|key|index|count|size|width|height|color|url|path|file|dir|src|alt|title|role|aria|data|test|spec|mock|stub|fixture)$", // technical terms
  ],
};
```

## Integration Examples

### 1. Component Testing

```typescript
import { detectHardcodedStrings } from "reynard-testing";

describe("Component i18n", () => {
  it("should not have hardcoded strings", () => {
    const componentCode = fs.readFileSync("Component.tsx", "utf8");
    const results = detectHardcodedStrings("Component.tsx", componentCode, config);

    expect(results).toHaveLength(0);
  });
});
```

### 2. Translation Validation

```typescript
import { validateTranslations } from "reynard-testing";

describe("Translation completeness", () => {
  it("should have complete translations", async () => {
    const results = await validateTranslations(config);

    results.forEach(result => {
      expect(result.missingKeys).toHaveLength(0);
      expect(result.incompleteTranslations).toHaveLength(0);
    });
  });
});
```

### 3. Performance Testing

```typescript
import { runI18nTests } from "reynard-testing";

describe("i18n performance", () => {
  it("should load translations quickly", async () => {
    const result = await runI18nTests(config);

    expect(result.performanceMetrics.loadTime).toBeLessThan(1000);
    expect(result.performanceMetrics.memoryUsage).toBeLessThan(50 * 1024 * 1024); // 50MB
  });
});
```

## CI/CD Integration

### GitHub Actions

```yaml
name: i18n Checks

on: [push, pull_request]

jobs:
  i18n-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"
      - name: Install dependencies
        run: npm ci
      - name: Run i18n linting
        run: npx i18n-lint --packages packages/* --locales en,es,fr,de,ru,ar
      - name: Run i18n tests
        run: npx vitest run packages/core/i18n --coverage
```

### GitLab CI

```yaml
stages:
  - i18n-checks

i18n-checks:
  stage: i18n-checks
  image: node:18
  before_script:
    - npm ci
  script:
    - npx i18n-lint --packages packages/* --locales en,es,fr,de,ru,ar
    - npx vitest run packages/core/i18n --coverage
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
```

## Best Practices

### 1. Regular Testing

Run i18n tests as part of your regular test suite:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:i18n": "npx i18n-lint",
    "test:all": "npm run test && npm run test:i18n"
  }
}
```

### 2. Pre-commit Hooks

Add i18n checks to pre-commit hooks:

```json
{
  "name": "FOXY",
  "hooks": {
    "pre-commit": {
      "enabled": true,
      "scripts": [
        {
          "name": "i18n Lint",
          "command": "npx i18n-lint --packages packages/*",
          "failOnError": false,
          "timeout": 30000
        }
      ]
    }
  }
}
```

### 3. IDE Integration

Configure your IDE to use the ESLint plugin for real-time feedback:

```json
{
  "eslint.workingDirectories": ["packages/*"],
  "eslint.options": {
    "extensions": [".ts", ".tsx", ".js", ".jsx"]
  }
}
```

### 4. Custom Ignore Patterns

Create package-specific ignore patterns:

```typescript
const packageConfig = {
  ...DEFAULT_CONFIG,
  ignorePatterns: [
    ...DEFAULT_CONFIG.ignorePatterns,
    "^test-", // test-specific terms
    "^mock-", // mock-specific terms
    "^fixture-", // fixture-specific terms
  ],
};
```

## Troubleshooting

### Common Issues

1. **ESLint plugin not working**
   - Ensure the plugin is properly installed and configured
   - Check that the plugin is included in your ESLint configuration

2. **Translation files not found**
   - Verify the translation file paths in your configuration
   - Check that the files exist and are accessible

3. **Performance issues**
   - Consider reducing the number of packages or locales being tested
   - Use caching for repeated tests

4. **False positives in hardcoded string detection**
   - Add appropriate ignore patterns to your configuration
   - Review the detected strings and adjust patterns as needed

### Getting Help

- Check the test examples in `i18n-integration-example.ts`
- Review the configuration options in the API reference
- Run tests with verbose output for debugging: `npx i18n-lint --verbose`

## Contributing

When adding new i18n testing features:

1. Add comprehensive tests
2. Update this documentation
3. Add examples for new functionality
4. Ensure backward compatibility
5. Update the ESLint plugin if needed

## License

Part of the Reynard project. See the main project license for details.
