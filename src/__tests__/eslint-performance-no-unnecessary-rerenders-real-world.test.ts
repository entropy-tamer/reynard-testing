/**
 * Real-World Test Suite for no-unnecessary-rerenders ESLint Rule
 * Tests practical examples from actual SolidJS components
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

describe("no-unnecessary-rerenders ESLint Rule - Real-World Scenarios", () => {
  describe("Form Components", () => {
    it("should detect inline event handlers in forms", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly structured form
          `function ContactForm() {
            const handleSubmit = (e) => {
              e.preventDefault();
              console.log('Form submitted');
            };
            const handleInputChange = (e) => {
              setValue(e.target.value);
            };
            return (
              <form onSubmit={handleSubmit}>
                <input onChange={handleInputChange} />
                <button type="submit">Submit</button>
              </form>
            );
          }`,
        ],
        invalid: [
          {
            code: `
              function ContactForm() {
                return (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    console.log('Form submitted');
                  }}>
                    <input onChange={(e) => setValue(e.target.value)} />
                    <button type="submit">Submit</button>
                  </form>
                );
              }
            `,
            errors: [{ messageId: "inlineFunction" }, { messageId: "inlineFunction" }],
          },
        ],
      });
    });

    it("should detect inline style objects in form components", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly structured form with stable styles
          `function StyledForm() {
            const formStyle = { 
              padding: '20px', 
              border: '1px solid #ccc',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            };
            const inputStyle = { width: '100%', padding: '10px' };
            const buttonStyle = { 
              backgroundColor: '#007bff', 
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px'
            };
            return (
              <form style={formStyle}>
                <input style={inputStyle} />
                <button style={buttonStyle}>Submit</button>
              </form>
            );
          }`,
        ],
        invalid: [
          {
            code: `
              function StyledForm() {
                return (
                  <form style={{ 
                    padding: '20px', 
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9'
                  }}>
                    <input style={{ width: '100%', padding: '10px' }} />
                    <button style={{ 
                      backgroundColor: '#007bff', 
                      color: 'white',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '4px'
                    }}>Submit</button>
                  </form>
                );
              }
            `,
            errors: [{ messageId: "inlineObject" }, { messageId: "inlineObject" }, { messageId: "inlineObject" }],
          },
        ],
      });
    });
  });

  describe("List and Grid Components", () => {
    it("should detect inline functions in list item handlers", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly structured list
          `function TodoList({ todos }) {
            const handleToggle = (id) => {
              setTodos(todos.map(todo => 
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
              ));
            };
            const handleDelete = (id) => {
              setTodos(todos.filter(todo => todo.id !== id));
            };
            return (
              <ul>
                {todos.map(todo => (
                  <TodoItem 
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
              </ul>
            );
          }`,
        ],
        invalid: [
          {
            code: `
              function TodoList({ todos }) {
                return (
                  <ul>
                    {todos.map(todo => (
                      <TodoItem 
                        key={todo.id}
                        todo={todo}
                        onToggle={(id) => {
                          setTodos(todos.map(t => 
                            t.id === id ? { ...t, completed: !t.completed } : t
                          ));
                        }}
                        onDelete={(id) => {
                          setTodos(todos.filter(t => t.id !== id));
                        }}
                      />
                    ))}
                  </ul>
                );
              }
            `,
            errors: [{ messageId: "inlineFunction" }, { messageId: "inlineFunction" }],
          },
        ],
      });
    });

    it("should detect inline arrays in grid configurations", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        valid: [
          // Properly structured grid with stable configurations
          `function DataGrid({ data }) {
            const columns = [
              { key: 'id', title: 'ID', width: 100 },
              { key: 'name', title: 'Name', width: 200 },
              { key: 'email', title: 'Email', width: 250 }
            ];
            const handleRowClick = (row) => console.log('Row clicked:', row);
            return (
              <Grid 
                columns={columns}
                data={data}
                onRowClick={handleRowClick}
              />
            );
          }`,
        ],
        invalid: [
          {
            code: `
              function DataGrid({ data }) {
                return (
                  <Grid 
                    columns={[
                      { key: 'id', title: 'ID', width: 100 },
                      { key: 'name', title: 'Name', width: 200 },
                      { key: 'email', title: 'Email', width: 250 }
                    ]}
                    data={data}
                    onRowClick={(row) => console.log('Row clicked:', row)}
                  />
                );
              }
            `,
            errors: [{ messageId: "inlineArray" }, { messageId: "inlineFunction" }],
          },
        ],
      });
    });
  });

  describe("Modal and Dialog Components", () => {
    it("should detect inline handlers in modal components", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        invalid: [
          {
            code: `
              function Modal({ isOpen, onClose, children }) {
                return (
                  <div 
                    className={isOpen ? 'modal open' : 'modal'}
                    onClick={(e) => {
                      if (e.target === e.currentTarget) {
                        onClose();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        onClose();
                      }
                    }}
                  >
                    <div className="modal-content" style={{ 
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'white',
                      padding: '20px',
                      borderRadius: '8px'
                    }}>
                      {children}
                    </div>
                  </div>
                );
              }
            `,
            errors: [{ messageId: "inlineFunction" }, { messageId: "inlineFunction" }, { messageId: "inlineObject" }],
          },
        ],
      });
    });
  });

  describe("Navigation Components", () => {
    it("should detect inline handlers in navigation menus", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        invalid: [
          {
            code: `
              function NavigationMenu({ items, currentPath }) {
                return (
                  <nav>
                    {items.map(item => (
                      <NavItem 
                        key={item.id}
                        item={item}
                        isActive={currentPath === item.path}
                        onClick={() => {
                          navigate(item.path);
                          closeMenu();
                        }}
                        style={{
                          color: currentPath === item.path ? '#007bff' : '#333',
                          fontWeight: currentPath === item.path ? 'bold' : 'normal',
                          padding: '10px 15px',
                          textDecoration: 'none'
                        }}
                      />
                    ))}
                  </nav>
                );
              }
            `,
            errors: [{ messageId: "inlineFunction" }, { messageId: "inlineObject" }],
          },
        ],
      });
    });
  });

  describe("Data Visualization Components", () => {
    it("should detect inline configurations in chart components", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        invalid: [
          {
            code: `
              function Chart({ data, type }) {
                return (
                  <ChartComponent 
                    data={data}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Chart Title' }
                      },
                      scales: {
                        y: { beginAtZero: true },
                        x: { type: 'category' }
                      }
                    }}
                    onDataPointClick={(point) => {
                      console.log('Point clicked:', point);
                      setSelectedPoint(point);
                    }}
                    style={{
                      width: '100%',
                      height: '400px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                );
              }
            `,
            errors: [{ messageId: "inlineObject" }, { messageId: "inlineFunction" }, { messageId: "inlineObject" }],
          },
        ],
      });
    });
  });

  describe("Interactive Widget Components", () => {
    it("should detect inline handlers in interactive widgets", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        invalid: [
          {
            code: `
              function InteractiveWidget({ data }) {
                return (
                  <div className="widget">
                    <div 
                      className="draggable-item"
                      onMouseDown={(e) => {
                        setDragging(true);
                        setStartPosition({ x: e.clientX, y: e.clientY });
                      }}
                      onMouseMove={(e) => {
                        if (isDragging) {
                          setPosition({
                            x: e.clientX - startPosition.x,
                            y: e.clientY - startPosition.y
                          });
                        }
                      }}
                      onMouseUp={() => setDragging(false)}
                      style={{
                        position: 'absolute',
                        left: position.x,
                        top: position.y,
                        cursor: isDragging ? 'grabbing' : 'grab',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ccc',
                        padding: '10px'
                      }}
                    >
                      {data.title}
                    </div>
                  </div>
                );
              }
            `,
            errors: [
              { messageId: "inlineFunction" },
              { messageId: "inlineFunction" },
              { messageId: "inlineFunction" },
              { messageId: "inlineObject" },
            ],
          },
        ],
      });
    });
  });

  describe("Search and Filter Components", () => {
    it("should detect inline handlers in search components", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        invalid: [
          {
            code: `
              function SearchComponent({ onSearch, onFilter }) {
                return (
                  <div className="search-container">
                    <input 
                      type="text"
                      placeholder="Search..."
                      onChange={(e) => {
                        const query = e.target.value;
                        onSearch(query);
                        setSearchQuery(query);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          performSearch();
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '16px'
                      }}
                    />
                    <div className="filters">
                      {filters.map(filter => (
                        <button
                          key={filter.id}
                          onClick={() => {
                            toggleFilter(filter.id);
                            onFilter(getActiveFilters());
                          }}
                          style={{
                            backgroundColor: filter.active ? '#007bff' : '#f8f9fa',
                            color: filter.active ? 'white' : '#333',
                            border: '1px solid #ddd',
                            padding: '5px 10px',
                            margin: '0 5px',
                            borderRadius: '4px'
                          }}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }
            `,
            errors: [
              { messageId: "inlineFunction" },
              { messageId: "inlineFunction" },
              { messageId: "inlineObject" },
              { messageId: "inlineFunction" },
              { messageId: "inlineObject" },
            ],
          },
        ],
      });
    });
  });

  describe("Complex Business Logic Components", () => {
    it("should detect inline handlers in complex business components", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        invalid: [
          {
            code: `
              function OrderManagement({ orders, onUpdateOrder }) {
                return (
                  <div className="order-management">
                    {orders.map(order => (
                      <OrderCard 
                        key={order.id}
                        order={order}
                        onStatusChange={(newStatus) => {
                          const updatedOrder = { ...order, status: newStatus };
                          onUpdateOrder(updatedOrder);
                          updateOrderInDatabase(updatedOrder);
                          showNotification(\`Order \${order.id} status changed to \${newStatus}\`);
                        }}
                        onPriorityChange={(newPriority) => {
                          const updatedOrder = { ...order, priority: newPriority };
                          onUpdateOrder(updatedOrder);
                          updateOrderInDatabase(updatedOrder);
                          logPriorityChange(order.id, newPriority);
                        }}
                        style={{
                          border: order.priority === 'high' ? '2px solid red' : '1px solid #ddd',
                          backgroundColor: order.status === 'completed' ? '#f0f8f0' : 'white',
                          padding: '15px',
                          margin: '10px 0',
                          borderRadius: '8px'
                        }}
                      />
                    ))}
                  </div>
                );
              }
            `,
            errors: [{ messageId: "inlineFunction" }, { messageId: "inlineFunction" }, { messageId: "inlineObject" }],
          },
        ],
      });
    });
  });

  describe("Performance-Critical Components", () => {
    it("should detect inline handlers in performance-critical components", () => {
      ruleTester.run("no-unnecessary-rerenders", noUnnecessaryRerenders, {
        invalid: [
          {
            code: `
              function VirtualizedList({ items, itemHeight, containerHeight }) {
                return (
                  <div 
                    className="virtual-list"
                    onScroll={(e) => {
                      const scrollTop = e.target.scrollTop;
                      const startIndex = Math.floor(scrollTop / itemHeight);
                      const endIndex = Math.min(
                        startIndex + Math.ceil(containerHeight / itemHeight),
                        items.length
                      );
                      setVisibleRange({ start: startIndex, end: endIndex });
                    }}
                    style={{
                      height: containerHeight,
                      overflow: 'auto',
                      position: 'relative'
                    }}
                  >
                    {items.slice(visibleRange.start, visibleRange.end).map((item, index) => (
                      <div
                        key={item.id}
                        style={{
                          position: 'absolute',
                          top: (visibleRange.start + index) * itemHeight,
                          height: itemHeight,
                          width: '100%'
                        }}
                        onClick={() => {
                          selectItem(item);
                          scrollToItem(item.id);
                        }}
                      >
                        {item.content}
                      </div>
                    ))}
                  </div>
                );
              }
            `,
            errors: [
              { messageId: "inlineFunction" },
              { messageId: "inlineObject" },
              { messageId: "inlineObject" },
              { messageId: "inlineFunction" },
            ],
          },
        ],
      });
    });
  });
});
