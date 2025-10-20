/**
 * Integration Test Suite for no-unnecessary-rerenders ESLint Rule
 * Tests integration with SolidJS patterns and other rules
 */

import { describe, it, expect } from "vitest";
import { RuleTester } from "eslint";
import parser from "@typescript-eslint/parser";
import { noUnnecessaryRerenders } from "../eslint-plugin/rules/performance/no-unnecessary-rerenders";

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

describe("no-unnecessary-rerenders ESLint Rule - Integration", () => {
  describe("Integration with createMemo", () => {
    it("should work with memoized functions", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `function MyComponent() {
            const handleClick = createMemo(() => () => {
              console.log('clicked');
              updateState();
            });
            return <button onClick={handleClick()}>Click me</button>;
          }`,
          `function MyComponent() {
            const handleSubmit = createMemo(() => (e) => {
              e.preventDefault();
              submitForm();
            });
            return <form onSubmit={handleSubmit()}>Submit</form>;
          }`,
        ],
        invalid: [],
      });
    });

    it("should work with memoized objects", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `function MyComponent() {
            const style = createMemo(() => ({
              color: 'red',
              fontSize: '16px',
              backgroundColor: 'white'
            }));
            return <div style={style()}>Content</div>;
          }`,
          `function MyComponent() {
            const config = createMemo(() => ({
              api: { baseUrl: 'https://api.example.com' },
              ui: { theme: 'dark' }
            }));
            return <ApiComponent config={config()} />;
          }`,
        ],
        invalid: [],
      });
    });

    it("should work with memoized arrays", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `function MyComponent() {
            const items = createMemo(() => [
              { id: 1, name: 'Item 1' },
              { id: 2, name: 'Item 2' }
            ]);
            return <ListComponent data-items={items()} />;
          }`,
        ],
        invalid: [],
      });
    });
  });

  describe("Integration with createSignal", () => {
    it("should work with signal-based state", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `function MyComponent() {
            const [count, setCount] = createSignal(0);
            const handleIncrement = () => setCount(count() + 1);
            return <button onClick={handleIncrement}>Count: {count()}</button>;
          }`,
          `function MyComponent() {
            const [name, setName] = createSignal('');
            const handleChange = (e) => setName(e.target.value);
            return <input value={name()} onChange={handleChange} />;
          }`,
        ],
        invalid: [],
      });
    });

    it("should detect unstable signal dependencies", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        invalid: [
          {
            code: `function MyComponent() {
              const [count1, setCount1] = createSignal(0);
              const [count2, setCount2] = createSignal(0);
              return <div>{count1() + count2()}</div>;
            }`,
            errors: [{ messageId: "unstableDependency" }],
          },
        ],
      });
    });
  });

  describe("Integration with createEffect", () => {
    it("should work with effects and memoized handlers", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `function MyComponent() {
            const [data, setData] = createSignal(null);
            const handleLoad = createMemo(() => async () => {
              const result = await fetchData();
              setData(result);
            });
            createEffect(() => {
              handleLoad()();
            });
            return <div>{data() ? 'Loaded' : 'Loading...'}</div>;
          }`,
        ],
        invalid: [],
      });
    });
  });

  describe("Integration with createResource", () => {
    it("should work with resource-based data fetching", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `function MyComponent() {
            const [userId, setUserId] = createSignal(1);
            const [user] = createResource(userId, fetchUser);
            const handleUserChange = (id) => setUserId(id);
            return (
              <div>
                <button onClick={() => handleUserChange(2)}>Load User 2</button>
                {user() ? <UserProfile user={user()} /> : 'Loading...'}
              </div>
            );
          }`,
        ],
        invalid: [],
      });
    });
  });

  describe("Multiple Issues in Single Component", () => {
    it("should detect multiple issues and provide appropriate fixes", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        invalid: [
          {
            code: `
              function ComplexComponent({ data, onUpdate }) {
                return (
                  <div>
                    <button 
                      onClick={() => {
                        console.log('Button clicked');
                        onUpdate(data);
                      }}
                      style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '10px 20px'
                      }}
                    >
                      Update
                    </button>
                    <div 
                      data-items={data.map(item => ({ ...item, processed: true }))}
                      onMouseOver={() => setHovered(true)}
                      onMouseOut={() => setHovered(false)}
                    >
                      Content
                    </div>
                  </div>
                );
              }
            `,
            errors: [
              { messageId: "inlineFunction" },
              { messageId: "inlineObject" },
              { messageId: "inlineArray" },
              { messageId: "inlineFunction" },
              { messageId: "inlineFunction" },
            ],
          },
        ],
      });
    });
  });

  describe("Integration with Component Composition", () => {
    it("should work with properly composed components", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `function ParentComponent() {
            const handleChildClick = (childId) => {
              console.log('Child clicked:', childId);
              updateChildState(childId);
            };
            const childStyle = { padding: '10px', margin: '5px' };
            return (
              <div>
                {children.map(child => (
                  <ChildComponent 
                    key={child.id}
                    child={child}
                    onClick={handleChildClick}
                    style={childStyle}
                  />
                ))}
              </div>
            );
          }`,
        ],
        invalid: [],
      });
    });

    it("should detect issues in composed components", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        invalid: [
          {
            code: `
              function ParentComponent() {
                return (
                  <div>
                    {children.map(child => (
                      <ChildComponent 
                        key={child.id}
                        child={child}
                        onClick={(childId) => {
                          console.log('Child clicked:', childId);
                          updateChildState(childId);
                        }}
                        style={{
                          padding: '10px',
                          margin: '5px',
                          backgroundColor: child.active ? '#e6f3ff' : 'white'
                        }}
                      />
                    ))}
                  </div>
                );
              }
            `,
            errors: [
              { messageId: "inlineFunction" },
              { messageId: "inlineObject" },
            ],
          },
        ],
      });
    });
  });

  describe("Integration with Context and Providers", () => {
    it("should work with context providers", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `function App() {
            const theme = createMemo(() => ({
              colors: { primary: '#007bff', secondary: '#6c757d' },
              spacing: { small: '8px', medium: '16px' }
            }));
            const handleThemeChange = (newTheme) => {
              setCurrentTheme(newTheme);
            };
            return (
              <ThemeProvider value={theme()}>
                <Header onThemeChange={handleThemeChange} />
                <MainContent />
              </ThemeProvider>
            );
          }`,
        ],
        invalid: [],
      });
    });
  });

  describe("Integration with Custom Hooks", () => {
    it("should work with custom hooks that return memoized values", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `function MyComponent() {
            const { data, loading, error, refetch } = useApiData('/api/users');
            const handleRefresh = () => refetch();
            return (
              <div>
                {loading() ? 'Loading...' : (
                  <UserList 
                    users={data()} 
                    onRefresh={handleRefresh}
                    error={error()}
                  />
                )}
              </div>
            );
          }`,
        ],
        invalid: [],
      });
    });
  });

  describe("Integration with Event Delegation", () => {
    it("should work with event delegation patterns", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `function ListComponent({ items }) {
            const handleItemClick = (e) => {
              const itemId = e.target.dataset.itemId;
              if (itemId) {
                selectItem(itemId);
              }
            };
            return (
              <ul onClick={handleItemClick}>
                {items.map(item => (
                  <li key={item.id} data-item-id={item.id}>
                    {item.name}
                  </li>
                ))}
              </ul>
            );
          }`,
        ],
        invalid: [],
      });
    });
  });

  describe("Integration with Performance Optimizations", () => {
    it("should work with performance-optimized patterns", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `function OptimizedComponent({ items, filter }) {
            const filteredItems = createMemo(() => 
              items.filter(item => item.category === filter)
            );
            const itemHandlers = createMemo(() => 
              items.reduce((handlers, item) => {
                handlers[item.id] = () => selectItem(item.id);
                return handlers;
              }, {})
            );
            return (
              <div>
                {filteredItems().map(item => (
                  <ItemComponent 
                    key={item.id}
                    item={item}
                    onClick={itemHandlers()[item.id]}
                  />
                ))}
              </div>
            );
          }`,
        ],
        invalid: [],
      });
    });
  });

  describe("Integration with TypeScript", () => {
    it("should work with TypeScript type annotations", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `function TypedComponent() {
            const handleClick: () => void = () => {
              console.log('clicked');
            };
            const style: React.CSSProperties = {
              color: 'red',
              fontSize: '16px'
            };
            return <button onClick={handleClick} style={style}>Click</button>;
          }`,
        ],
        invalid: [],
      });
    });

    it("should detect issues with TypeScript inline types", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        invalid: [
          {
            code: `
              function TypedComponent() {
                return (
                  <button 
                    onClick={(e: MouseEvent) => console.log('clicked')}
                    style={{ color: 'red' } as React.CSSProperties}
                  >
                    Click
                  </button>
                );
              }
            `,
            errors: [
              { messageId: "inlineFunction" },
              { messageId: "inlineObject" },
            ],
          },
        ],
      });
    });
  });
});

