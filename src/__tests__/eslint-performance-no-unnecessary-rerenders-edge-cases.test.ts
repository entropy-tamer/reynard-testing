/**
 * Edge Cases Test Suite for no-unnecessary-rerenders ESLint Rule
 * Tests edge cases and boundary conditions
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

describe("no-unnecessary-rerenders ESLint Rule - Edge Cases", () => {
  describe("Empty Files and Whitespace", () => {
    it("should handle empty files", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          {
            code: "",
          },
        ],
        invalid: [],
      });
    });

    it("should handle files with only comments", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          {
            code: `
              // This is a comment
              /* This is a block comment */
            `,
          },
        ],
        invalid: [],
      });
    });

    it("should handle files with only whitespace", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          {
            code: "   \n\t  \n  ",
          },
        ],
        invalid: [],
      });
    });
  });

  describe("Empty Components", () => {
    it("should handle components with no props", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `<MyComponent />`,
          `<UserProfile />`,
          `<DataTable />`,
        ],
        invalid: [],
      });
    });

    it("should handle components with only static props", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `<MyComponent className="test" id="component" />`,
          `<UserProfile name="John" age={25} />`,
          `<DataTable title="Data" />`,
        ],
        invalid: [],
      });
    });

    it("should handle components with only string/number props", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `<MyComponent title="Hello" count={5} />`,
          `<UserProfile name="Jane" score={100} />`,
          `<DataTable label="Table" rows={10} />`,
        ],
        invalid: [],
      });
    });
  });

  describe("Nested Components", () => {
    it("should handle deeply nested components", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `<div>
            <div>
              <div>
                <MyComponent title="Nested" />
              </div>
            </div>
          </div>`,
        ],
        invalid: [],
      });
    });

    it("should detect issues in nested components", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly memoized nested component props
          `const handleClick = () => console.log('clicked');
           <div>
             <div>
               <div>
                 <MyComponent onClick={handleClick} />
               </div>
             </div>
           </div>`,
        ],
        invalid: [
          {
            code: `<div>
              <div>
                <div>
                  <MyComponent onClick={() => console.log('clicked')} />
                </div>
              </div>
            </div>`,
            errors: [{ messageId: "inlineFunction" }],
          },
        ],
      });
    });
  });

  describe("ClassName Ignore Patterns", () => {
    it("should respect className ignore patterns", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          {
            code: `<div className="ignore-rerenders" onClick={() => console.log('clicked')}>Content</div>`,
            options: [{ ignorePatterns: ["ignore-rerenders"] }],
          },
          {
            code: `<MyComponent className="skip-check" style={{ color: 'red' }} />`,
            options: [{ ignorePatterns: ["skip-check"] }],
          },
        ],
        invalid: [],
      });
    });

    it("should work with multiple className patterns", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          {
            code: `<div className="test ignore-rerenders another-class" onClick={() => console.log('clicked')}>Content</div>`,
            options: [{ ignorePatterns: ["ignore-rerenders"] }],
          },
        ],
        invalid: [],
      });
    });

    it("should work with regex patterns in className", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          {
            code: `<div className="test-ignore-rerenders" onClick={() => console.log('clicked')}>Content</div>`,
            options: [{ ignorePatterns: ["ignore-rerenders"] }],
          },
          {
            code: `<div className="ignore-rerenders-test" style={{ color: 'red' }}>Content</div>`,
            options: [{ ignorePatterns: ["ignore-rerenders"] }],
          },
        ],
        invalid: [],
      });
    });
  });

  describe("Already Memoized Props", () => {
    it("should not trigger for already memoized functions", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `const handleClick = createMemo(() => () => console.log('clicked'));
           <MyComponent onClick={handleClick()} />`,
          `const handleSubmit = createMemo(() => function() { console.log('submitted'); });
           <MyComponent onSubmit={handleSubmit()} />`,
        ],
        invalid: [],
      });
    });

    it("should not trigger for already memoized objects", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `const style = createMemo(() => ({ color: 'red', fontSize: '16px' }));
           <MyComponent style={style()} />`,
          `const config = createMemo(() => ({ width: 100, height: 200 }));
           <MyComponent config={config()} />`,
        ],
        invalid: [],
      });
    });

    it("should not trigger for already memoized arrays", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `const items = createMemo(() => ['item1', 'item2', 'item3']);
           <MyComponent data-items={items()} />`,
          `const classes = createMemo(() => ['class1', 'class2']);
           <MyComponent className={classes().join(' ')} />`,
        ],
        invalid: [],
      });
    });
  });

  describe("Signal Dependencies", () => {
    it("should detect unstable signal dependencies", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Stable signal operations
          `<div>{signal1()}</div>`,
          `<div>{signal2()}</div>`,
          `<div>{signal1()}</div>`,
        ],
        invalid: [
          {
            code: `<div>{signal1() + signal2()}</div>`,
            errors: [{ messageId: "unstableDependency" }],
          },
          {
            code: `<div>{signal1() - signal2()}</div>`,
            errors: [{ messageId: "unstableDependency" }],
          },
        ],
      });
    });

    it("should not trigger for stable signal operations", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `<div>{signal1()}</div>`,
          `<div>{signal1() * 2}</div>`,
          `<div>{signal1() / 2}</div>`,
        ],
        invalid: [],
      });
    });
  });

  describe("Disabled Rule Scenarios", () => {
    it("should respect disabled rule configuration", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          {
            code: `<MyComponent onClick={() => console.log('clicked')} />`,
            options: [{ enabled: false }],
          },
          {
            code: `<MyComponent style={{ color: 'red' }} />`,
            options: [{ checkRerenders: false }],
          },
        ],
        invalid: [],
      });
    });
  });

  describe("Edge Case Expressions", () => {
    it("should handle null and undefined props", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `<MyComponent onClick={null} />`,
          `<MyComponent style={undefined} />`,
          `<MyComponent data-items={null} />`,
        ],
        invalid: [],
      });
    });

    it("should handle boolean props", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `<MyComponent disabled={true} />`,
          `<MyComponent visible={false} />`,
          `<MyComponent active={isActive} />`,
        ],
        invalid: [],
      });
    });

    it("should handle template literals", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `<MyComponent title={\`Hello \${name}\`} />`,
          `<MyComponent className={\`btn \${variant}\`} />`,
        ],
        invalid: [],
      });
    });
  });

  describe("Complex Object Structures", () => {
    it("should detect inline objects with nested properties", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly memoized nested object
          `const config = {
            api: { baseUrl: 'https://api.example.com', timeout: 5000 },
            ui: { theme: 'dark', fontSize: 16 }
          };
          <MyComponent config={config} />`,
        ],
        invalid: [
          {
            code: `<MyComponent config={{
              api: { baseUrl: 'https://api.example.com', timeout: 5000 },
              ui: { theme: 'dark', fontSize: 16 }
            }} />`,
            errors: [{ messageId: "inlineObject" }],
          },
        ],
      });
    });

    it("should detect inline arrays with complex objects", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly memoized complex array
          `const items = [
            { id: 1, name: 'Item 1', config: { active: true } },
            { id: 2, name: 'Item 2', config: { active: false } }
          ];
          <MyComponent data-items={items} />`,
        ],
        invalid: [
          {
            code: `<MyComponent data-items={[
              { id: 1, name: 'Item 1', config: { active: true } },
              { id: 2, name: 'Item 2', config: { active: false } }
            ]} />`,
            errors: [{ messageId: "inlineArray" }],
          },
        ],
      });
    });
  });

  describe("Function Context Edge Cases", () => {
    it("should handle functions defined in component but outside JSX", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `function MyComponent() {
            const handleClick = () => console.log('clicked');
            return <button onClick={handleClick}>Click me</button>;
          }`,
        ],
        invalid: [],
      });
    });

    it("should handle functions defined outside component", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `const handleClick = () => console.log('clicked');
           function MyComponent() {
             return <button onClick={handleClick}>Click me</button>;
           }`,
        ],
        invalid: [],
      });
    });
  });

  describe("JSX Edge Cases", () => {
    it("should handle self-closing elements", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly memoized self-closing element props
          `const handleClick = () => console.log('clicked');
           <MyComponent onClick={handleClick} />`,
          `const style = { color: 'red' };
           <UserProfile style={style} />`,
          `const items = [1, 2, 3];
           <DataTable data-items={items} />`,
        ],
        invalid: [
          {
            code: `<MyComponent onClick={() => console.log('clicked')} />`,
            errors: [{ messageId: "inlineFunction" }],
          },
          {
            code: `<UserProfile style={{ color: 'red' }} />`,
            errors: [{ messageId: "inlineObject" }],
          },
          {
            code: `<DataTable data-items={[1, 2, 3]} />`,
            errors: [{ messageId: "inlineArray" }],
          },
        ],
      });
    });

    it("should handle fragments", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly memoized fragment props
          `const handleClick = () => console.log('clicked');
           <>{
             <MyComponent onClick={handleClick} />
           }</>`,
        ],
        invalid: [
          {
            code: `<>{
              <MyComponent onClick={() => console.log('clicked')} />
            }</>`,
            errors: [{ messageId: "inlineFunction" }],
          },
        ],
      });
    });

    it("should handle conditional rendering", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly memoized conditional rendering props
          `const handleClick = () => console.log('clicked');
           {condition && <MyComponent onClick={handleClick} />}`,
          `const style = { color: 'red' };
           {condition ? <MyComponent style={style} /> : <div>Fallback</div>}`,
        ],
        invalid: [
          {
            code: `{condition && <MyComponent onClick={() => console.log('clicked')} />}`,
            errors: [{ messageId: "inlineFunction" }],
          },
          {
            code: `{condition ? <MyComponent style={{ color: 'red' }} /> : <div>Fallback</div>}`,
            errors: [{ messageId: "inlineObject" }],
          },
        ],
      });
    });
  });

  describe("TypeScript Edge Cases", () => {
    it("should handle type assertions", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          `<MyComponent onClick={handleClick as () => void} />`,
        ],
        invalid: [
          {
            code: `<MyComponent onClick={(handleClick as () => void) || (() => console.log('fallback'))} />`,
            errors: [{ messageId: "inlineFunction" }],
          },
        ],
      });
    });

    it("should handle generic components", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly memoized generic component props
          `const handleClick = () => console.log('clicked');
           <MyComponent<string> onClick={handleClick} />`,
        ],
        invalid: [
          {
            code: `<MyComponent<string> onClick={() => console.log('clicked')} />`,
            errors: [{ messageId: "inlineFunction" }],
          },
        ],
      });
    });
  });

  describe("Multiple Issues in Single Element", () => {
    it("should detect multiple inline issues", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly memoized multiple props
          `const handleClick = () => console.log('clicked');
           const handleMouseOver = () => setHovered(true);
           const style = { color: 'red', fontSize: '16px' };
           const items = [1, 2, 3];
           const config = { api: 'test' };
           <MyComponent 
             onClick={handleClick}
             onMouseOver={handleMouseOver}
             style={style}
             data-items={items}
             config={config}
           />`,
        ],
        invalid: [
          {
            code: `<MyComponent 
              onClick={() => console.log('clicked')}
              onMouseOver={() => setHovered(true)}
              style={{ color: 'red', fontSize: '16px' }}
              data-items={[1, 2, 3]}
              config={{ api: 'test' }}
            />`,
            errors: [
              { messageId: "inlineFunction" },
              { messageId: "inlineFunction" },
              { messageId: "inlineObject" },
              { messageId: "inlineArray" },
              { messageId: "inlineObject" },
            ],
          },
        ],
      });
    });
  });
});
