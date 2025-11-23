<script>
  let todos = $state([
    { id: 1, text: "Learn Svelte", completed: false, createdAt: new Date() },
    {
      id: 2,
      text: "Build a Todo App",
      completed: false,
      createdAt: new Date(),
    },
  ]);

  let nextTodo = $state("");
  let nextTodoId = $state(3);

  function addTodo() {
    // prevent adding empty todos
    if (nextTodo.trim() === "") return;

    todos.push({
      id: nextTodoId,
      text: nextTodo,
      completed: false,
      createdAt: new Date(),
    });
    nextTodoId += 1;
    nextTodo = "";
  }

  function editTodo(id, newText) {
    let todo = todos.find((todo) => todo.id === id);
    if (todo) {
      todo.text = newText;
    }
  }

  function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
  }

  let totalTodos = $derived(todos.length);
  let completedTodos = $derived(todos.filter((todo) => todo.completed).length);
  let pendingTodos = $derived(totalTodos - completedTodos);

  let time = $state(new Date().toLocaleTimeString());
  setInterval(() => {
    time = new Date().toLocaleTimeString();
  }, 1000);
</script>

<main>
  <h1>Todo App</h1>

  <div id="add-todo">
    <input
      id="todo-input"
      type="text"
      bind:value={nextTodo}
      placeholder="What needs to be done?"
      onkeydown={(event) => event.key === "Enter" && addTodo()}
    />
    <button id="add-btn" onclick={addTodo}>
      <!-- Add Icon -->
      <b>&#43;</b>
    </button>
  </div>

  {#if todos.length === 0}
    <p id="empty-message">No todos yet! Add one to get started!</p>
  {:else}
    <div id="stats">
      <span>Total Todos: {totalTodos}</span>
      <span>|</span>
      <span>Completed: {completedTodos}</span>
      <span>|</span>
      <span>Pending Todos: {pendingTodos}</span>
    </div>
    <ul id="todo-list">
			<!-- why (todo.id) 
				- helps Svelte track each item uniquely for efficient updates
				- improves performance during re-renders
				- prevents unnecessary DOM manipulations 
			-->
      {#each todos as todo (todo.id)}
        <li class:completed={todo.completed}>
					<!-- class:completed?? what is this?
					 - Dynamic class binding in Svelte
					 Explain Dynamic class binding 
					 - It allows you to conditionally apply a CSS class based on a boolean expression	
					 - Adds the "completed" CSS class to the <li> element when todo.completed is true
					 -->
          <input type="checkbox" bind:checked={todo.completed} />
          <span>{todo.text}</span>
          <span>{todo.createdAt.toLocaleString()}</span>
          <button
            id="edit-btn"
            onclick={() => {
              const newText = prompt("Edit todo:", todo.text);
              if (newText !== null && newText.trim() !== "") {
                editTodo(todo.id, newText.trim());
              }
            }}
          >
            <!-- edit icon -->
            <b>&#9998;</b>
          </button>
          <button id="delete-btn" onclick={() => deleteTodo(todo.id)}>
            <!-- delete icon -->
            <b>&#128465;</b>
          </button>
        </li>
      {/each}
    </ul>
  {/if}

  <div id="timer">
    <p>Current time: {time}</p>
  </div>
</main>

<style>
  main {
    width: 720px;
    margin: 0 auto;
    padding: 1em;
  }

  h1 {
    text-align: center;
    color: #ff3e00;
  }

  #add-todo {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  #todo-input {
    flex: 1;
    padding: 0.75rem;
    font-size: 1rem;
    border: 2px solid #ddd;
    border-radius: 4px;
  }

  #todo-input:focus {
    font-size: x-large;
    border: none;
    outline: 3px solid #ff7b00;
  }

  button {
    cursor: pointer;
  }

  #add-btn {
    padding: 0.8rem 1.5rem;
    font-size: 2rem;
    background-color: #ff3e00;
    color: white;
    border: none;
    border-radius: 0.25rem;
  }

  #add-btn:hover {
    font-size: 2.2rem;
    outline: 2px solid #ff7b00;
  }

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

  #todo-list {
    list-style-type: none;
    padding: 0;
    margin-top: 2rem;
  }

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

  li.completed span {
    text-decoration: line-through;
    color: rgba(0, 0, 0, 1);
    opacity: 0.8;
  }

  li span {
    flex: 1;
    text-align: left;
    margin-left: 1rem;
  }

  input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    cursor: pointer;
  }

  #edit-btn {
    /* edit button color usual */
    background: #0066ff;
    padding: 0.5rem 1rem 0.5rem 1rem;
    font-size: 1.5rem;
    margin-right: 0.75rem;
    border: none;
    border-radius: 0.25rem;
  }

  #edit-btn:hover {
    background: rgba(0, 0, 255, 0.6);
  }

  #delete-btn {
    background: rgba(255, 0, 0, 1);
    border: none;
    border-radius: 0.25rem;
    padding: 0.5rem 1rem 0.5rem 1rem;
    font-size: 1.3rem;
  }

  #delete-btn:hover {
    background: #a80010;
  }

  #empty-message {
    text-align: center;
    font-style: italic;
    color: yellow;
    margin-top: 2rem;
  }

  #timer {
    position: fixed;
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
</style>
