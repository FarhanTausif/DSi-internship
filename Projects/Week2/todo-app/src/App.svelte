<script>
  
  // On app start, load todos from localStorage if available
  function loadTodos(){
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      try {
        const parsedTodos = JSON.parse(storedTodos);
      // Convert createdAt strings back to Date objects
        return parsedTodos.map(todo => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
       }));
      } catch (error) {
        console.error('Failed to load todos:', error);
        return [];
      }
    }

    // Default todos if nothing in localStorage
    return [
      { id: 1, text: "Learn Svelte", completed: false, createdAt: new Date() },
      { id: 2, text: "Build a Todo App", completed: false, createdAt: new Date() },
    ];
  }
  
  function loadNextTodoId() {
    const storedNextTodoId = localStorage.getItem('nextTodoId');
    return storedNextTodoId ? parseInt(storedNextTodoId) : 3;
  }
  
  let todos = $state(loadTodos());
  let nextTodo = $state("");
  let nextTodoId = $state(loadNextTodoId());
  let hasEmptyTodoError = $state(false);

  // what happening here?
  // -- This effect runs whenever the 'todos' or 'nextTodoId' state changes.
  // -- It saves the current state of 'todos' and 'nextTodoId' to localStorage,
  // -- ensuring that the data persists across page reloads. 
  $effect(()=> {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('nextTodoId', nextTodoId.toString());
  });

  function addTodo() {
    // prevent adding empty todos, show error state
    if (nextTodo.trim() === "") {
      hasEmptyTodoError = true;
      return;
    }

    todos.push({
      id: nextTodoId,
      text: nextTodo,
      completed: false,
      createdAt: new Date(),
    });
    nextTodoId += 1;
    nextTodo = "";
    hasEmptyTodoError = false;
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
      class={hasEmptyTodoError ? "error" : ""}
      type="text"
      bind:value={nextTodo}
      placeholder={hasEmptyTodoError ? "Please enter a todo" : "Add a todo"}
      onkeydown={(event) => event.key === "Enter" && addTodo()}
    />
    <button id="add-btn" onclick={addTodo}>
      <!-- Add Icon -->
       <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 32 32"><path fill="#fff" d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5v2H5v14h14v-5z" stroke-width="32" /><path fill="#fff" d="M21 7h-4V3h-2v4h-4v2h4v4h2V9h4z"/></svg>
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

        if no (todo.id) what would happen?
        - Svelte may have to re-render the entire list on any change, leading to performance issues
			-->
      {#each todos as todo (todo.id)}
        <!-- <li class:completed={todo.completed}>
          -->
        <li class={todo.completed && "completed"}>
          <!-- class:completed?? what is this?
					 - Dynamic class binding in Svelte
					 Explain Dynamic class binding 
					 - It allows you to conditionally apply a CSS class based on a boolean expression	
					 - Adds the "completed" CSS class to the <li> element when todo.completed is true
					 -->
          <!-- what could be an alternative to class:completed={todo.completed}?
            li class={todo.completed ? 'completed' : ''}>
            
            Or,

            <li class="{todo.completed && 'completed'}">
           -->
          <input type="checkbox" bind:checked={todo.completed} />
          <!-- this binding with the checkbox and todo.completed does what?
                - It creates a two-way binding between the checkbox's checked state and the todo.completed property.
                - When the checkbox is checked or unchecked, it automatically updates the todo.completed property.
                - Conversely, if the todo.completed property changes programmatically, the checkbox will reflect that change.
           
          -->
          <span id="todo-text">{todo.text}</span>
          <span>{todo.createdAt.toLocaleString()}</span>
          <button
            id="edit-btn"
            onclick={() => {
              const newText = prompt("Edit todo:", todo.text);
              if (newText !== null && newText.trim() !== "") {
                editTodo(todo.id, newText.trim());
              } else {
                alert("Todo text cannot be empty.");
              }
            }}
          >
            <!-- edit icon -->
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M384 224v184a40 40 0 0 1-40 40H104a40 40 0 0 1-40-40V168a40 40 0 0 1 40-40h167.48"/><path fill="currentColor" d="M459.94 53.25a16.06 16.06 0 0 0-23.22-.56L424.35 65a8 8 0 0 0 0 11.31l11.34 11.32a8 8 0 0 0 11.34 0l12.06-12c6.1-6.09 6.67-16.01.85-22.38M399.34 90L218.82 270.2a9 9 0 0 0-2.31 3.93L208.16 299a3.91 3.91 0 0 0 4.86 4.86l24.85-8.35a9 9 0 0 0 3.93-2.31L422 112.66a9 9 0 0 0 0-12.66l-9.95-10a9 9 0 0 0-12.71 0"/></svg>
          </button>
          <button id="delete-btn" onclick={() => deleteTodo(todo.id)}>
            <!-- delete icon -->
             <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 48 48"><path fill="currentColor" d="M20 10.5v.5h8v-.5a4 4 0 0 0-8 0m-2.5.5v-.5a6.5 6.5 0 1 1 13 0v.5h11.25a1.25 1.25 0 1 1 0 2.5h-2.917l-2 23.856A7.25 7.25 0 0 1 29.608 44H18.392a7.25 7.25 0 0 1-7.224-6.644l-2-23.856H6.25a1.25 1.25 0 1 1 0-2.5zm-3.841 26.147a4.75 4.75 0 0 0 4.733 4.353h11.216a4.75 4.75 0 0 0 4.734-4.353L36.324 13.5H11.676zM21.5 20.25a1.25 1.25 0 1 0-2.5 0v14.5a1.25 1.25 0 1 0 2.5 0zM27.75 19c.69 0 1.25.56 1.25 1.25v14.5a1.25 1.25 0 1 1-2.5 0v-14.5c0-.69.56-1.25 1.25-1.25"/></svg>
          </button>
        </li>
      {/each}
    </ul>
  {/if}

  <div id="timer">
    <p>{time}</p>
  </div>
</main>

<style>
  main {
    width: 720px;
    margin: 0 auto;
    padding: 1em;
  }

  h1 {
    font-family: 'assets/Science_Gothic/static/Condensed-Black.ttf', 'Courier New', Courier, monospace;
    text-align: center;
    color: #ff3e00;
    line-height: 0%;
  }

  #add-todo {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    position: relative;
  }

  #todo-input {
    flex: 1;
    padding: 1.5rem;
    font-family: 'poppins', monospace;
    font-weight: bold;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.2);
  }

  #todo-input:focus {
    border: none;
    outline: none;
  }
  
  #todo-input.error::placeholder {
    color: red;
    font-weight: bold;
  }
  
  button {
    cursor: pointer;
  }
  
  #add-btn {
    border: none;
    background: none;
    margin-left: -10px; 
    position: absolute; 
    right: 6px; 
    top: 15px;
  }

  #add-btn:hover {
    fill-opacity: 0.5;
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
    color: #00ffff;
  }

  #todo-list {
    list-style-type: none;
    padding: 0;
    margin-top: 2rem;
  }
  
  #todo-text {
    word-break: break-word;
    text-wrap: wrap;
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
    background-color: rgba(255, 255, 255, 0.2);
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
    background: none;
    margin-right: 0.75rem;
    border: none;
  }

  #edit-btn:hover {
    color: blue;
  }

  #delete-btn {
    background: none;
    border: none;
  }

  #delete-btn:hover {
    color: red;
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
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: larger;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 0.75rem;
  }



  /* Responsive Design - Tablet */
  @media (max-width: 768px) {
    main {
      width: 90%;
      padding: 0.75em;
    }

    h1 {
      font-size: 1.75rem;
    }

    #todo-input {
      padding: 1rem;
      font-size: 0.95rem;
    }

    #add-btn {
      right: 5px;
      top: 8px;
    }

    #add-btn svg {
      width: 32px;
      height: 32px;
    }

    #stats {
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem;
      font-size: small;
    }

    #stats span:nth-child(even) {
      display: none; /* Hide separator | on smaller screens */
    }

    li {
      padding: 1.25rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    li span:last-of-type {
      width: 100%;
      font-size: 0.85rem;
      margin-left: 2rem;
    }

    #edit-btn svg,
    #delete-btn svg {
      width: 28px;
      height: 28px;
    }

    #timer {
      font-size: medium;
    }
  }

  /* Responsive Design - Mobile */
  @media (max-width: 480px) {
    main {
      width: 95%;
      padding: 0.5em;
    }

    h1 {
      font-size: 1.5rem;
    }

    #add-todo {
      flex-direction: column;
      gap: 1rem;
    }

    #todo-input {
      padding: 0.85rem;
      font-size: 0.9rem;
    }

    #add-btn {
      position: absolute;
      right: 6px;
      top: 8px;
    }

    #add-btn svg {
      width: 30px;
      height: 30px;
    }

    #stats {
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
    }

    li {
      padding: 1rem;
      font-size: 0.9rem;
    }

    li span:first-of-type {
      flex: 2;
    }

    li span:last-of-type {
      font-size: 0.75rem;
      margin-left: 1.5rem;
    }

    #edit-btn {
      margin-right: 0.5rem;
    }

    #edit-btn svg,
    #delete-btn svg {
      width: 24px;
      height: 24px;
    }

    #timer {
      font-size: small;
      padding: 0.3rem 0.6rem;
    }

    #timer p {
      font-size: 0.85rem;
    }
  }

  /* Responsive Design - Very Small Mobile */
  @media (max-width: 360px) {
    h1 {
      font-size: 1.25rem;
    }

    #todo-input {
      font-size: 0.85rem;
      padding: 0.75rem;
    }

    #stats {
      font-size: 0.8rem;
      padding: 0.5rem 0.75rem;
    }

    li {
      padding: 0.75rem;
      font-size: 0.85rem;
    }

    li span:last-of-type {
      font-size: 0.7rem;
    }

    #edit-btn svg,
    #delete-btn svg {
      width: 20px;
      height: 20px;
    }

    #timer {
      font-size: x-small;
    }

    #timer p {
      font-size: 0.75rem;
    }
  }
</style>
