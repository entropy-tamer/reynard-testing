/**
 * Real-World Test Suite for prefer-memo ESLint Rule
 * Tests practical examples from actual SolidJS components
 */

import { describe, it, expect } from "vitest";
import { RuleTester } from "eslint";
import parser from "@typescript-eslint/parser";
import { preferMemo } from "../eslint-plugin/rules/performance/prefer-memo";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: parser,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

describe("prefer-memo ESLint Rule - Real-World Scenarios", () => {
  describe("Data Display Components", () => {
    it("should detect expensive operations in data tables", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Properly memoized data table
          `function DataTable({ data }) {
            const sortedData = createMemo(() => data.sort((a, b) => a.name.localeCompare(b.name)));
            const filteredData = createMemo(() => sortedData().filter(item => item.active));
            return (
              <table>
                {filteredData().map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.value}</td>
                  </tr>
                ))}
              </table>
            );
          }`,
        ],
        invalid: [
          {
            code: `
              function DataTable({ data }) {
                return (
                  <table>
                    {data.sort((a, b) => a.name.localeCompare(b.name)).map(item => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.value}</td>
                      </tr>
                    ))}
                  </table>
                );
              }
            `,
            errors: [{ messageId: "arrayOperation" }],
          },
          {
            code: `
              function DataTable({ data, filter }) {
                return (
                  <table>
                    {data.filter(item => item.category === filter).map(item => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.value * 1.2}</td>
                      </tr>
                    ))}
                  </table>
                );
              }
            `,
            errors: [
              { messageId: "arrayOperation" },
              { messageId: "mathematicalOperation" },
            ],
          },
        ],
      });
    });

    it("should detect expensive operations in list components", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Properly memoized list
          `function UserList({ users, searchTerm }) {
            const filteredUsers = createMemo(() => 
              users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            return (
              <ul>
                {filteredUsers().map(user => (
                  <li key={user.id}>{user.name}</li>
                ))}
              </ul>
            );
          }`,
        ],
        invalid: [
          {
            code: `
              function UserList({ users, searchTerm }) {
                return (
                  <ul>
                    {users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
                      <li key={user.id}>{user.name}</li>
                    ))}
                  </ul>
                );
              }
            `,
            errors: [{ messageId: "arrayOperation" }],
          },
        ],
      });
    });
  });

  describe("Form Components", () => {
    it("should detect expensive operations in form validation", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Properly memoized form validation
          `function ContactForm({ fields }) {
            const validationErrors = createMemo(() => 
              fields.map(field => ({
                ...field,
                error: field.required && !field.value ? 'Required' : null
              }))
            );
            return (
              <form>
                {validationErrors().map(field => (
                  <div key={field.name}>
                    <input value={field.value} />
                    {field.error && <span>{field.error}</span>}
                  </div>
                ))}
              </form>
            );
          }`,
        ],
        invalid: [
          {
            code: `
              function ContactForm({ fields }) {
                return (
                  <form>
                    {fields.map(field => ({
                      ...field,
                      error: field.required && !field.value ? 'Required' : null
                    })).map(field => (
                      <div key={field.name}>
                        <input value={field.value} />
                        {field.error && <span>{field.error}</span>}
                      </div>
                    ))}
                  </form>
                );
              }
            `,
            errors: [{ messageId: "arrayOperation" }],
          },
        ],
      });
    });

    it("should detect expensive operations in dynamic form fields", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple form without expensive operations
          `function SimpleForm({ fields }) {
            return (
              <form>
                {fields.map(field => (
                  <div key={field.name}>
                    <label>{field.label}</label>
                    <input type={field.type} value={field.value} />
                  </div>
                ))}
              </form>
            );
          }`,
        ],
        invalid: [
          {
            code: `
              function DynamicForm({ schema, values }) {
                return (
                  <form>
                    {Object.keys(schema).map(key => {
                      const field = schema[key];
                      const value = values[key] || '';
                      return (
                        <div key={key}>
                          <label>{field.label}</label>
                          <input 
                            type={field.type} 
                            value={value}
                            required={field.required}
                          />
                        </div>
                      );
                    })}
                  </form>
                );
              }
            `,
            errors: [{ messageId: "objectOperation" }],
          },
        ],
      });
    });
  });

  describe("Dashboard Components", () => {
    it("should detect expensive operations in dashboard widgets", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Properly memoized dashboard
          `function Dashboard({ metrics, timeRange }) {
            const processedMetrics = createMemo(() => 
              metrics.map(metric => ({
                ...metric,
                value: metric.value * (timeRange === 'month' ? 30 : 1),
                trend: metric.value > metric.previous ? 'up' : 'down'
              }))
            );
            return (
              <div className="dashboard">
                {processedMetrics().map(metric => (
                  <MetricCard key={metric.id} metric={metric} />
                ))}
              </div>
            );
          }`,
        ],
        invalid: [
          {
            code: `
              function Dashboard({ metrics, timeRange }) {
                return (
                  <div className="dashboard">
                    {metrics.map(metric => ({
                      ...metric,
                      value: metric.value * (timeRange === 'month' ? 30 : 1),
                      trend: metric.value > metric.previous ? 'up' : 'down'
                    })).map(metric => (
                      <MetricCard key={metric.id} metric={metric} />
                    ))}
                  </div>
                );
              }
            `,
            errors: [{ messageId: "arrayOperation" }],
          },
        ],
      });
    });

    it("should detect expensive operations in chart data processing", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple chart without expensive operations
          `function SimpleChart({ data, type }) {
            return (
              <div>
                <h3>Chart: {type}</h3>
                <svg>
                  {data.map((point, index) => (
                    <circle key={index} cx={point.x} cy={point.y} />
                  ))}
                </svg>
              </div>
            );
          }`,
        ],
        invalid: [
          {
            code: `
              function Chart({ data, type }) {
                return (
                  <div>
                    <h3>Chart: {type}</h3>
                    <svg>
                      {data.map((point, index) => ({
                        x: index * 10,
                        y: point.value * 2,
                        label: point.name.toUpperCase()
                      })).map(point => (
                        <circle key={point.x} cx={point.x} cy={point.y} />
                      ))}
                    </svg>
                  </div>
                );
              }
            `,
            errors: [
              { messageId: "arrayOperation" },
              { messageId: "mathematicalOperation" },
              { messageId: "stringOperation" },
            ],
          },
        ],
      });
    });
  });

  describe("Search and Filter Components", () => {
    it("should detect expensive operations in search results", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Properly memoized search
          `function SearchResults({ items, query, filters }) {
            const searchResults = createMemo(() => {
              const filtered = items.filter(item => 
                item.name.toLowerCase().includes(query.toLowerCase()) &&
                filters.every(filter => filter.predicate(item))
              );
              return filtered.sort((a, b) => a.name.localeCompare(b.name));
            });
            return (
              <div>
                {searchResults().map(item => (
                  <SearchResultItem key={item.id} item={item} />
                ))}
              </div>
            );
          }`,
        ],
        invalid: [
          {
            code: `
              function SearchResults({ items, query, filters }) {
                return (
                  <div>
                    {items.filter(item => 
                      item.name.toLowerCase().includes(query.toLowerCase()) &&
                      filters.every(filter => filter.predicate(item))
                    ).sort((a, b) => a.name.localeCompare(b.name)).map(item => (
                      <SearchResultItem key={item.id} item={item} />
                    ))}
                  </div>
                );
              }
            `,
            errors: [{ messageId: "arrayOperation" }],
          },
        ],
      });
    });

    it("should detect expensive operations in autocomplete", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple autocomplete without expensive operations
          `function SimpleAutocomplete({ options }) {
            return (
              <div>
                {options.map(option => (
                  <div key={option.value}>
                    {option.label}
                  </div>
                ))}
              </div>
            );
          }`,
        ],
        invalid: [
          {
            code: `
              function Autocomplete({ options, input }) {
                return (
                  <div>
                    {options.filter(option => 
                      option.label.toLowerCase().includes(input.toLowerCase())
                    ).slice(0, 10).map(option => (
                      <div key={option.value} onClick={() => selectOption(option)}>
                        {option.label}
                      </div>
                    ))}
                  </div>
                );
              }
            `,
            errors: [{ messageId: "arrayOperation" }],
          },
        ],
      });
    });
  });

  describe("Navigation Components", () => {
    it("should detect expensive operations in breadcrumbs", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple breadcrumbs without expensive operations
          `function SimpleBreadcrumbs({ segments }) {
            return (
              <nav>
                {segments.map((segment, index) => (
                  <span key={index}>
                    {segment}
                    {index < segments.length - 1 && ' > '}
                  </span>
                ))}
              </nav>
            );
          }`,
        ],
        invalid: [
          {
            code: `
              function Breadcrumbs({ path }) {
                return (
                  <nav>
                    {path.split('/').filter(segment => segment.length > 0).map((segment, index) => (
                      <span key={index}>
                        {segment.charAt(0).toUpperCase() + segment.slice(1)}
                        {index < path.split('/').length - 1 && ' > '}
                      </span>
                    ))}
                  </nav>
                );
              }
            `,
            errors: [{ messageId: "stringOperation" }],
          },
        ],
      });
    });

    it("should detect expensive operations in menu generation", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple menu without expensive operations
          `function SimpleMenu({ items }) {
            return (
              <nav>
                {items.map(item => (
                  <a key={item.id} href={item.url}>
                    {item.label}
                  </a>
                ))}
              </nav>
            );
          }`,
        ],
        invalid: [
          {
            code: `
              function NavigationMenu({ items, userRole }) {
                return (
                  <nav>
                    {items.filter(item => 
                      item.roles.includes(userRole) && item.visible
                    ).map(item => ({
                      ...item,
                      url: item.url.replace(':userId', userRole)
                    })).map(item => (
                      <a key={item.id} href={item.url}>
                        {item.label}
                      </a>
                    ))}
                  </nav>
                );
              }
            `,
            errors: [{ messageId: "arrayOperation" }],
          },
        ],
      });
    });
  });

  describe("Content Management Components", () => {
    it("should detect expensive operations in content rendering", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple content rendering without expensive operations
          `function SimpleContentRenderer({ paragraphs }) {
            return (
              <div>
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            );
          }`,
        ],
        invalid: [
          {
            code: `
              function ContentRenderer({ content, format }) {
                return (
                  <div>
                    {content.split('\\n').map((paragraph, index) => 
                      paragraph.trim().length > 0 ? (
                        <p key={index}>
                          {format === 'uppercase' ? paragraph.toUpperCase() : paragraph}
                        </p>
                      ) : null
                    )}
                  </div>
                );
              }
            `,
            errors: [{ messageId: "stringOperation" }],
          },
        ],
      });
    });

    it("should detect expensive operations in tag clouds", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple tag cloud without expensive operations
          `function SimpleTagCloud({ tags }) {
            return (
              <div>
                {tags.map(tag => (
                  <span key={tag.name} style={{ fontSize: tag.size + 'px' }}>
                    {tag.name} ({tag.count})
                  </span>
                ))}
              </div>
            );
          }`,
        ],
        invalid: [
          {
            code: `
              function TagCloud({ tags }) {
                return (
                  <div>
                    {Object.entries(tags).map(([tag, count]) => ({
                      tag,
                      count,
                      size: Math.min(count * 2, 24)
                    })).sort((a, b) => b.count - a.count).map(item => (
                      <span 
                        key={item.tag} 
                        style={{ fontSize: item.size + 'px' }}
                      >
                        {item.tag} ({item.count})
                      </span>
                    ))}
                  </div>
                );
              }
            `,
            errors: [
              { messageId: "objectOperation" },
              { messageId: "mathematicalOperation" },
            ],
          },
        ],
      });
    });
  });

  describe("Performance-Critical Components", () => {
    it("should detect expensive operations in virtual scrolling", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple list without expensive operations
          `function SimpleList({ items, itemHeight }) {
            return (
              <div>
                {items.map((item, index) => (
                  <div key={item.id} style={{ height: itemHeight }}>
                    {item.name}
                  </div>
                ))}
              </div>
            );
          }`,
        ],
        invalid: [
          {
            code: `
              function VirtualList({ items, scrollTop, itemHeight }) {
                const startIndex = Math.floor(scrollTop / itemHeight);
                const endIndex = Math.min(startIndex + Math.ceil(containerHeight / itemHeight), items.length);
                return (
                  <div>
                    {items.slice(startIndex, endIndex).map((item, index) => (
                      <div key={item.id} style={{ height: itemHeight }}>
                        {item.name}
                      </div>
                    ))}
                  </div>
                );
              }
            `,
            errors: [
              { messageId: "mathematicalOperation" },
              { messageId: "arrayOperation" },
            ],
          },
        ],
      });
    });

    it("should detect expensive operations in real-time updates", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple data display without expensive operations
          `function SimpleDataDisplay({ data, timestamp }) {
            return (
              <div>
                <h3>Last updated: {timestamp}</h3>
                {data.map(item => (
                  <div key={item.id}>
                    {item.name}: {item.value}
                  </div>
                ))}
              </div>
            );
          }`,
        ],
        invalid: [
          {
            code: `
              function LiveDataDisplay({ data, timestamp }) {
                return (
                  <div>
                    <h3>Last updated: {new Date(timestamp).toLocaleTimeString()}</h3>
                    {data.map(item => ({
                      ...item,
                      age: Date.now() - item.timestamp,
                      status: item.value > 100 ? 'high' : 'normal'
                    })).map(item => (
                      <div key={item.id}>
                        {item.name}: {item.value} ({item.status})
                      </div>
                    ))}
                  </div>
                );
              }
            `,
            errors: [
              { messageId: "arrayOperation" },
              { messageId: "mathematicalOperation" },
            ],
          },
        ],
      });
    });
  });

  describe("Complex Business Logic", () => {
    it("should detect expensive operations in calculations", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple price display without expensive operations
          "function SimplePriceDisplay({ items }) {\n" +
          "  return (\n" +
          "    <div>\n" +
          "      <h3>Items</h3>\n" +
          "      <ul>\n" +
          "        {items.map((item, index) => (\n" +
          "          <li key={index}>\n" +
          "            {item.name}: {item.price}\n" +
          "          </li>\n" +
          "        ))}\n" +
          "      </ul>\n" +
          "    </div>\n" +
          "  );\n" +
          "}",
        ],
        invalid: [
          {
            code: `
              function PriceCalculator({ items, taxRate, discount }) {
                return (
                  <div>
                    <h3>Total: \${items.reduce((sum, item) => sum + item.price, 0) * (1 + taxRate) * (1 - discount)}</h3>
                    <ul>
                      {items.map(item => (
                        <li key={item.id}>
                          {item.name}: \${item.price * (1 + taxRate)}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }
            `,
            errors: [
              { messageId: "arrayOperation" },
              { messageId: "mathematicalOperation" },
            ],
          },
        ],
      });
    });

    it("should detect expensive operations in data aggregation", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple sales report without expensive operations
          "function SimpleSalesReport({ categories, period }) {\n" +
          "  return (\n" +
          "    <div>\n" +
          "      <h3>Sales Report - {period}</h3>\n" +
          "      {categories.map((cat, index) => (\n" +
          "        <div key={index}>\n" +
          "          {cat.name}: {cat.total}\n" +
          "        </div>\n" +
          "      ))}\n" +
          "    </div>\n" +
          "  );\n" +
          "}",
        ],
        invalid: [
          {
            code: `
              function SalesReport({ sales, period }) {
                return (
                  <div>
                    <h3>Sales Report - {period}</h3>
                    {Object.entries(sales.reduce((acc, sale) => {
                      const category = sale.category;
                      acc[category] = (acc[category] || 0) + sale.amount;
                      return acc;
                    }, {})).map(([category, total]) => (
                      <div key={category}>
                        {category}: \${total.toFixed(2)}
                      </div>
                    ))}
                  </div>
                );
              }
            `,
            errors: [{ messageId: "objectOperation" }],
          },
        ],
      });
    });
  });
});
