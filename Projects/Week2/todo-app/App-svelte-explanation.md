# App.svelte - Complete Explanation

This document provides a line-by-line explanation of the `App.svelte` component, the main component of our Todo App.

---

## 📋 Table of Contents
1. [Script Section - State & Logic](#script-section)
2. [Template Section - UI Structure](#template-section)
3. [Style Section - CSS Styling](#style-section)

---

## Script Section - State & Logic

### Initial State Setup (Lines 2-12)

```javascript
let todos = $state([
  { id: 1, text: "Learn Svelte", completed: false, createdAt: new Date() },
  { id: 2, text: "Build a Todo App", completed: false, createdAt: new Date() },
]);
```

**Explanation:**
- `$state()` - **Svelte 5's reactive state** primitive
- Creates a reactive array of todo objects
- Each todo has:
  - `id` - Unique identifier (number)
  - `text` - Todo description (string)
  - `completed` - Completion status (boolean)
  - `createdAt` - Timestamp when created (Date object)

---

```javascript
let nextTodo = $state("");
let nextTodoId = $state(3);
```

**Explanation:**
- `nextTodo` - **Bound to input field**, stores the text user is typing
- `nextTodoId` - **Counter** for generating unique IDs (starts at 3 since we have 2 initial todos)
- Both use `$state()` for reactivity

---

### Functions - CRUD Operations

#### Add Todo (Lines 15-25)

```javascript
function addTodo() {
  if (nextTodo.trim() === "") return;  // Guard clause - prevent empty todos
  todos.push({
    id: nextTodoId,
    text: nextTodo,
    completed: false,
    createdAt: new Date(),
  });
  nextTodoId += 1;   // Increment ID for next todo
  nextTodo = "";     // Clear input field
}
```

**Concepts Used:**
- ✅ **Event handling** - Called on button click or Enter key
- ✅ **State mutation** - `.push()` adds new todo to array
- ✅ **Reactivity** - Svelte automatically updates UI when `todos` changes

---

#### Edit Todo (Lines 27-31)

```javascript
function editTodo(id, newText) {
		let todo = todos.find((todo) => todo.id === id);
		if (todo) {
			todo.text = newText;
		}
  }
```

**Explanation:**
- Takes `id` and `newText` as parameters
- Uses **`.find()`** to locate the todo with matching ID
- If found, directly updates the `text` property
**Benefit:** Simpler and more efficient than mapping the entire array

---

#### Delete Todo (Lines 33-35)

```javascript
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
}
```

**Explanation:**
- Uses **`.filter()`** to remove todo with matching ID
- Creates new array excluding the deleted item
- Reassignment triggers Svelte's reactivity

---

### Derived State (Lines 43-45)

```javascript
let totalTodos = $derived(todos.length);
let completedTodos = $derived(todos.filter((todo) => todo.completed).length);
let pendingTodos = $derived(totalTodos - completedTodos);
```

**Explanation:**
- `$derived()` - **Svelte 5's computed values** (like `$:` in Svelte 4)
- **Automatically recalculates** when dependencies change
- `totalTodos` - Total count of all todos
- `completedTodos` - Count of todos where `completed === true`
- `pendingTodos` - Simple math: total minus completed

**Benefit:** No manual updates needed - values update automatically!

---

### Timer State (Lines 47-50)

```javascript
let time = $state(new Date().toLocaleTimeString());
setInterval(() => {
  time = new Date().toLocaleTimeString();
}, 1000);
```

**Explanation:**
- `time` - Reactive state holding current time string
- `setInterval()` - JavaScript function that runs code every 1000ms (1 second)
- `.toLocaleTimeString()` - Formats time in user's locale (e.g., "11:30:45 AM")
- Updates `time` every second → UI updates automatically

---

## Template Section - UI Structure

### Main Container & Header (Lines 53-54)

```svelte
<main>
  <h1>Todo App</h1>
```

Simple semantic HTML - `<main>` for main content area.

---

### Add Todo Input Section (Lines 56-67)

```svelte
<div id="add-todo">
  <input
    id="todo-input"
    type="text"
    bind:value={nextTodo}
    placeholder="What needs to be done?"
    onkeydown={(event) => event.key === "Enter" && addTodo()}
  />
  <button id="add-btn" onclick={addTodo}>
    <b>&#43;</b>
  </button>
</div>
```

**Line-by-Line:**
- `bind:value={nextTodo}` - **Two-way binding**: input ↔ state sync
- `onkeydown={...}` - **Event handler** for keyboard events
- `event.key === "Enter" && addTodo()` - **Short-circuit evaluation**: if Enter key, call function
- `onclick={addTodo}` - **Click handler** for button
- `&#43;` - HTML entity for "+" symbol

**Concepts:**
- ✅ Bindings (Day 4)
- ✅ Event handling (Day 3)

---

### Conditional Rendering (Lines 69-116)

```svelte
{#if todos.length === 0}
  <p id="empty-message">No todos yet! Add one to get started!</p>
{:else}
  <!-- Stats and todo list -->
{/if}
```

**Explanation:**
- `{#if}...{:else}...{/if}` - **Conditional rendering** (Day 3)
- Shows empty message when no todos exist
- Otherwise shows stats and todo list

---

### Statistics Bar (Lines 71-78)

```svelte
<div id="stats">
  <span>Total Todos: {totalTodos}</span>
  <span>|</span>
  <span>Completed: {completedTodos}</span>
  <span>|</span>
  <span>Pending Todos: {pendingTodos}</span>
</div>
```

**Explanation:**
- `{totalTodos}` - **Text interpolation**: displays reactive value
- Uses derived state variables
- Updates automatically when todos change

---

### Todo List - Loop (Lines 79-110)

```svelte
<ul id="todo-list">
  {#each todos as todo (todo.id)}
    <li class:completed={todo.completed}>
      <!-- Todo item content -->
    </li>
  {/each}
</ul>
```

**Explanation:**
- `{#each todos as todo (todo.id)}` - **Loop directive** (Day 3)
  - Iterates over `todos` array
  - Each item assigned to `todo` variable
  - `(todo.id)` - **Key** for efficient DOM updates
- `class:completed={todo.completed}` - **Dynamic class binding**
  - Adds `completed` class when `todo.completed` is true
  - Used for strikethrough styling

---

### Todo Item Structure (Lines 81-108)

```svelte
<input
  type="checkbox"
  bind:checked={todo.completed}
  onchange={() => toggleTodoCompletion(todo.id)}
/>
```

**Explanation:**
- `bind:checked={todo.completed}` - **Checkbox binding** (Day 4)
- Checkbox state syncs with todo's completed property
- `onchange` - Calls toggle function when checked/unchecked

---

```svelte
<span>{todo.text}</span>
<span>{todo.createdAt.toLocaleString()}</span>
```

**Explanation:**
- First `<span>` - Todo text content
- Second `<span>` - Formatted timestamp (date + time)

---

```svelte
<button
  id="edit-btn"
  onclick={() => {
    const newText = prompt("Edit todo:", todo.text);
    if (newText !== null && newText.trim() !== "") {
      editTodo(todo.id, newText.trim());
    }
  }}
>
  <b>&#9998;</b>
</button>
```

**Explanation:**
- **Inline event handler** with logic
- `prompt()` - Browser dialog for text input
- Returns `null` if cancelled, string if confirmed
- `&#9998;` - Pencil/edit icon (✎)

---

```svelte
<button id="delete-btn" onclick={() => deleteTodo(todo.id)}>
  <b>&#128465;</b>
</button>
```

**Explanation:**
- **Arrow function** passes todo ID to delete function
- `&#128465;` - Trash can icon (🗑️)

---

### Timer Display (Lines 113-115)

```svelte
<div id="timer">
  <p>Current time: {time}</p>
</div>
```

**Explanation:**
- Fixed position (styled in CSS)
- `{time}` - Displays reactive time state
- Updates every second automatically

---

## Style Section - CSS Styling

### Main Layout (Lines 119-122)

```css
main {
  width: 720px;
  margin: 0 auto;
  padding: 1em;
}
```

- `width: 720px` - Fixed width container
- `margin: 0 auto` - **Centers horizontally**
- `padding: 1em` - Inner spacing

---

### Title Styling (Lines 124-127)

```css
h1 {
  text-align: center;
  color: #ff3e00;  /* Svelte orange */
}
```

---

### Add Todo Section (Lines 129-132)

```css
#add-todo {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
```

- **Flexbox layout** - Items in a row
- `gap` - Space between input and button

---

### Input Field (Lines 134-144)

```css
input[type="text"] {
  flex: 1;                    /* Grows to fill space */
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
}

input[type="text"]:focus {
  font-size: larger;          /* Grows on focus */
  border: none;
  outline: 3px solid #ff7b00;
}
```

- `:focus` - Styling when input is active
- Visual feedback for user interaction

---

### Add Button (Lines 150-160)

```css
#add-btn {
  padding: 0.8rem 1.5rem;
  font-size: 2rem;
  background-color: #ff3e00;
  color: white;
  border: none;
  border-radius: 0.25rem;
}

#add-btn:hover {
  font-size: 2.2rem;          /* Grows on hover */
  outline: 2px solid #ff7b00;
}
```

- Hover effect for interactivity

---

### Statistics Bar (Lines 162-171)

```css
#stats {
  display: flex;
  justify-content: space-between;
  border: 2px dashed #ff7b00;
  border-radius: 4px;
  padding: 1rem 2rem;
  margin-top: 2rem;
  font-size: large;
  font-weight: bold;
  color: #ff7b00;
}
```

- `justify-content: space-between` - Evenly spreads items
- Dashed border for visual distinction

---

### Todo List (Lines 173-177)

```css
#todo-list {
  list-style-type: none;  /* Removes bullet points */
  padding: 0;
  margin-top: 2rem;
}
```

---

### Todo Item (Lines 179-189)

```css
li {
  display: flex;
  font-weight: bold;
  align-items: center;
  justify-content: space-between;
  padding: 1.75rem;
  border: 1px solid #ddd;
  border-radius: 0.75rem;
  margin-bottom: 0.5rem;
  background-color: rgba(255, 255, 255, 0.3);
}
```

- Flexbox for horizontal layout
- Generous padding for clickability

---

### Completed State (Lines 191-195)

```css
li.completed span {
  text-decoration: line-through;
  color: oklch(0% 0 0);  /* Black in OKLCH color space */
  opacity: 0.8;
}
```

- **Class binding in action**: Applied when `todo.completed === true`
- Strikethrough + opacity for visual feedback

---

### Edit Button (Lines 209-218)

```css
#edit-btn {
  background: #0066ff;  /* Blue */
  padding: 0.5rem 1rem 0.5rem 1rem;
  font-size: 1.5rem;
  margin-right: 0.75rem;
  border: none;
  border-radius: 0.25rem;
}

#edit-btn:hover {
  background: rgba(0, 0, 255, 0.6);  /* Semi-transparent on hover */
}
```

---

### Delete Button (Lines 220-228)

```css
#delete-btn {
  background: rgba(255, 0, 0, 1);  /* Red */
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem 0.5rem 1rem;
  font-size: 1.3rem;
}

#delete-btn:hover {
  background: #a80010;  /* Darker red on hover */
}
```

---

### Timer (Lines 238-248)

```css
#timer {
  position: fixed;          /* Stays in place when scrolling */
  font-family: "assets/digital-7 (mono).ttf", monospace;
  bottom: 1rem;
  right: 1rem;
  background: #ff3e00;
  color: white;
  font-size: large;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
}
```

- `position: fixed` - Stays in viewport corner
- Custom font for digital clock look

---

## 🎓 Svelte Concepts Summary

| Concept | Usage in App |
|---------|-------------|
| **$state()** | todos, nextTodo, nextTodoId, time |
| **$derived()** | totalTodos, completedTodos, pendingTodos |
| **bind:value** | Input field two-way binding |
| **bind:checked** | Checkbox binding |
| **{#if}...{:else}** | Empty state vs todo list |
| **{#each}** | Loop through todos |
| **onclick / onkeydown** | Event handlers |
| **class:** | Dynamic completed class |
| **Text interpolation** | {todo.text}, {time}, {totalTodos} |

---

## 🐛 Known Bug

**Line 40** in `toggleTodoCompletion`:
```javascript
completed: todo.completed  // ❌ Should be !todo.completed
```

This doesn't actually toggle the completion state!

---

## 💡 Improvement Suggestions

1. **Replace `prompt()`** with a modal for better UX
2. **Add localStorage** to persist todos
3. **Fix toggle bug** by adding negation operator
4. **Add filter** (All/Active/Completed)
5. **Add animations** for add/delete
