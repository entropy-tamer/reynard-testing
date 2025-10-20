/**
 * AST Parsing Tests for no-unnecessary-rerenders ESLint Rule
 * Tests the detection logic for inline functions, objects, and arrays that cause re-renders
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

describe("no-unnecessary-rerenders ESLint Rule - AST Parsing", () => {
  describe("Inline Function Detection", () => {
    it("should detect inline arrow functions in JSX props", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Functions defined outside component
          `const handleClick = () => console.log('clicked');
           <button onClick={handleClick}>Click me</button>`,
          // Memoized functions
          `const handleClick = createMemo(() => () => console.log('clicked'));
           <button onClick={handleClick()}>Click me</button>`,
        ],
        invalid: [
          {
            code: `<button onClick={() => console.log('clicked')}>Click me</button>`,
            errors: [{ messageId: "inlineFunction" }],
          },
          {
            code: `<input onChange={(e) => setValue(e.target.value)} />`,
            errors: [{ messageId: "inlineFunction" }],
          },
          {
            code: `<div onMouseOver={() => setHovered(true)}>Hover me</div>`,
            errors: [{ messageId: "inlineFunction" }],
          },
        ],
      });
    });

    it("should detect inline function expressions in JSX props", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Function defined outside component
          `function handleSubmit() { console.log('submitted'); }
           <form onSubmit={handleSubmit}>Submit</form>`,
        ],
        invalid: [
          {
            code: `<form onSubmit={function() { console.log('submitted'); }}>Submit</form>`,
            errors: [{ messageId: "inlineFunction" }],
          },
        ],
      });
    });

    it("should detect inline functions in different prop types", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly memoized event handlers
          `const handleClick = () => handleClick();
           <button onClick={handleClick}>Click</button>`,
          `const handleFocus = () => setFocused(true);
           <input onFocus={handleFocus} />`,
          `const handleBlur = () => setFocused(false);
           <div onBlur={handleBlur}>Content</div>`,
          `const handleChange = (e) => setValue(e.target.value);
           <select onChange={handleChange}>Options</select>`,
        ],
        invalid: [
          {
            code: `<button onClick={() => handleClick()}>Click</button>`,
            errors: [{ messageId: "inlineFunction" }],
          },
          {
            code: `<input onFocus={() => setFocused(true)} />`,
            errors: [{ messageId: "inlineFunction" }],
          },
          {
            code: `<div onBlur={() => setFocused(false)}>Content</div>`,
            errors: [{ messageId: "inlineFunction" }],
          },
          {
            code: `<select onChange={(e) => setValue(e.target.value)}>Options</select>`,
            errors: [{ messageId: "inlineFunction" }],
          },
        ],
      });
    });
  });

  describe("Inline Object Detection", () => {
    it("should detect inline objects in JSX props", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Objects defined outside component
          `const style = { color: 'red', fontSize: '16px' };
           <div style={style}>Content</div>`,
          // Memoized objects
          `const style = createMemo(() => ({ color: 'red', fontSize: '16px' }));
           <div style={style()}>Content</div>`,
        ],
        invalid: [
          {
            code: `<div style={{ color: 'red', fontSize: '16px' }}>Content</div>`,
            errors: [{ messageId: "inlineObject" }],
          },
          {
            code: `<div className="test" style={{ margin: '10px' }}>Content</div>`,
            errors: [{ messageId: "inlineObject" }],
          },
        ],
      });
    });

    it("should detect inline objects in different prop types", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly memoized style objects
          `const style = { color: 'red' };
           <div style={style}>Content</div>`,
          `const inputStyle = { width: '100%' };
           <input style={inputStyle} />`,
          `const buttonStyle = { padding: '10px' };
           <button style={buttonStyle}>Click</button>`,
        ],
        invalid: [
          {
            code: `<div style={{ color: 'red' }}>Content</div>`,
            errors: [{ messageId: "inlineObject" }],
          },
          {
            code: `<input style={{ width: '100%' }} />`,
            errors: [{ messageId: "inlineObject" }],
          },
          {
            code: `<button style={{ padding: '10px' }}>Click</button>`,
            errors: [{ messageId: "inlineObject" }],
          },
        ],
      });
    });

    it("should detect complex inline objects", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly memoized complex style object
          `const complexStyle = { 
            color: 'red', 
            fontSize: '16px', 
            backgroundColor: 'white',
            padding: '10px',
            margin: '5px'
          };
          <div style={complexStyle}>Content</div>`,
        ],
        invalid: [
          {
            code: `<div style={{ 
              color: 'red', 
              fontSize: '16px', 
              backgroundColor: 'white',
              padding: '10px',
              margin: '5px'
            }}>Content</div>`,
            errors: [{ messageId: "inlineObject" }],
          },
        ],
      });
    });
  });

  describe("Inline Array Detection", () => {
    it("should detect inline arrays in JSX props", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Arrays defined outside component
          `const items = ['item1', 'item2', 'item3'];
           <div data-items={items}>Content</div>`,
          // Memoized arrays
          `const items = createMemo(() => ['item1', 'item2', 'item3']);
           <div data-items={items()}>Content</div>`,
        ],
        invalid: [
          {
            code: `<div data-items={['item1', 'item2', 'item3']}>Content</div>`,
            errors: [{ messageId: "inlineArray" }],
          },
          {
            code: `<ul data-classes={['list', 'unstyled']}>Items</ul>`,
            errors: [{ messageId: "inlineArray" }],
          },
        ],
      });
    });

    it("should detect inline arrays in different prop types", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly memoized arrays
          `const items = [1, 2, 3];
           <div data-items={items}>Content</div>`,
          `const values = ['a', 'b', 'c'];
           <input data-values={values} />`,
          `const actions = ['click', 'hover'];
           <button data-actions={actions}>Click</button>`,
        ],
        invalid: [
          {
            code: `<div data-items={[1, 2, 3]}>Content</div>`,
            errors: [{ messageId: "inlineArray" }],
          },
          {
            code: `<input data-values={['a', 'b', 'c']} />`,
            errors: [{ messageId: "inlineArray" }],
          },
          {
            code: `<button data-actions={['click', 'hover']}>Click</button>`,
            errors: [{ messageId: "inlineArray" }],
          },
        ],
      });
    });

    it("should detect complex inline arrays", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly memoized complex array
          `const complexItems = [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
            { id: 3, name: 'Item 3' }
          ];
          <div data-items={complexItems}>Content</div>`,
        ],
        invalid: [
          {
            code: `<div data-items={[
              { id: 1, name: 'Item 1' },
              { id: 2, name: 'Item 2' },
              { id: 3, name: 'Item 3' }
            ]}>Content</div>`,
            errors: [{ messageId: "inlineArray" }],
          },
        ],
      });
    });
  });

  describe("Expensive Expression Detection", () => {
    it("should detect expensive expressions in JSX props", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Simple expressions
          `<div data-count={count}>Content</div>`,
          `<div data-name={name}>Content</div>`,
          // Already memoized
          `<div data-processed={createMemo(() => items.map(item => item.name))}>Content</div>`,
        ],
        invalid: [
          {
            code: `<div data-count={items.map(item => item.value).reduce((a, b) => a + b, 0)}>Content</div>`,
            errors: [{ messageId: "missingMemo" }],
          },
          {
            code: `<div data-total={width * height}>Content</div>`,
            errors: [{ messageId: "missingMemo" }],
          },
          {
            code: `<div data-upper={text.toUpperCase()}>Content</div>`,
            errors: [{ messageId: "missingMemo" }],
          },
        ],
      });
    });
  });

  describe("SolidJS Component Detection", () => {
    it("should only check SolidJS components", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Non-SolidJS elements should not trigger
          `<div onClick={() => console.log('clicked')}>Content</div>`,
          `<span style={{ color: 'red' }}>Text</span>`,
          `<p data-items={[1, 2, 3]}>Paragraph</p>`,
        ],
        invalid: [],
      });
    });

    it("should detect SolidJS components with uppercase names", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly memoized props for SolidJS components
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
  });

  describe("Ignore Pattern Matching", () => {
    it("should respect ignore patterns", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          {
            code: `<div className="ignore-rerenders" onClick={() => console.log('clicked')}>Content</div>`,
            options: [{ ignorePatterns: ["ignore-rerenders"] }],
          },
          {
            code: `<div className="test ignore-rerenders" style={{ color: 'red' }}>Content</div>`,
            options: [{ ignorePatterns: ["ignore-rerenders"] }],
          },
        ],
        invalid: [],
      });
    });

    it("should work with multiple ignore patterns", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          {
            code: `<div className="ignore-rerenders" onClick={() => console.log('clicked')}>Content</div>`,
            options: [{ ignorePatterns: ["ignore-rerenders", "skip-check"] }],
          },
          {
            code: `<div className="skip-check" style={{ color: 'red' }}>Content</div>`,
            options: [{ ignorePatterns: ["ignore-rerenders", "skip-check"] }],
          },
        ],
        invalid: [],
      });
    });

    it("should work with regex patterns", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          {
            code: `<div className="test-ignore-rerenders" onClick={() => console.log('clicked')}>Content</div>`,
            options: [{ ignorePatterns: ["ignore-rerenders"] }],
          },
        ],
        invalid: [],
      });
    });
  });

  describe("Multiple Issues Detection", () => {
    it("should detect multiple inline issues in same element", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly memoized props for SolidJS component
          `const handleClick = () => console.log('clicked');
           const style = { color: 'red' };
           const items = [1, 2, 3];
           <MyComponent 
             onClick={handleClick}
             style={style}
             data-items={items}
           />`,
        ],
        invalid: [
          {
            code: `<MyComponent 
              onClick={() => console.log('clicked')}
              style={{ color: 'red' }}
              data-items={[1, 2, 3]}
            />`,
            errors: [
              { messageId: "inlineFunction" },
              { messageId: "inlineObject" },
              { messageId: "inlineArray" },
            ],
          },
        ],
      });
    });

    it("should detect multiple issues across different elements", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly memoized props for multiple components
          `const handleClick = () => console.log('clicked');
           const style = { color: 'red' };
           const items = [1, 2, 3];
           <div>
             <MyComponent onClick={handleClick} />
             <UserProfile style={style} />
             <DataTable data-items={items} />
           </div>`,
        ],
        invalid: [
          {
            code: `
              <div>
                <MyComponent onClick={() => console.log('clicked')} />
                <UserProfile style={{ color: 'red' }} />
                <DataTable data-items={[1, 2, 3]} />
              </div>
            `,
            errors: [
              { messageId: "inlineFunction" },
              { messageId: "inlineObject" },
              { messageId: "inlineArray" },
            ],
          },
        ],
      });
    });
  });

  describe("Nested Component Detection", () => {
    it("should detect issues in nested components", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly memoized nested component props
          `const handleClick = () => console.log('clicked');
           <div>
             <MyComponent>
               <NestedComponent onClick={handleClick} />
             </MyComponent>
           </div>`,
        ],
        invalid: [
          {
            code: `
              <div>
                <MyComponent>
                  <NestedComponent onClick={() => console.log('clicked')} />
                </MyComponent>
              </div>
            `,
            errors: [{ messageId: "inlineFunction" }],
          },
        ],
      });
    });

    it("should detect issues in deeply nested components", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly memoized deeply nested component props
          `const style = { color: 'red' };
           <div>
             <MyComponent>
               <div>
                 <NestedComponent>
                   <DeepComponent style={style} />
                 </NestedComponent>
               </div>
             </MyComponent>
           </div>`,
        ],
        invalid: [
          {
            code: `
              <div>
                <MyComponent>
                  <div>
                    <NestedComponent>
                      <DeepComponent style={{ color: 'red' }} />
                    </NestedComponent>
                  </div>
                </MyComponent>
              </div>
            `,
            errors: [{ messageId: "inlineObject" }],
          },
        ],
      });
    });
  });

  describe("Self-Closing Elements", () => {
    it("should detect issues in self-closing elements", () => {
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
  });

  describe("Fragments", () => {
    it("should detect issues in fragments", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly memoized fragment props
          `const handleClick = () => console.log('clicked');
           const style = { color: 'red' };
           <>
             <MyComponent onClick={handleClick} />
             <UserProfile style={style} />
           </>`,
        ],
        invalid: [
          {
            code: `
              <>
                <MyComponent onClick={() => console.log('clicked')} />
                <UserProfile style={{ color: 'red' }} />
              </>
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
