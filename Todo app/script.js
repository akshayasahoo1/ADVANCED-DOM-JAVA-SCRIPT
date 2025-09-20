const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');
const searchInput = document.getElementById('searchInput');
const todoCounter = document.getElementById('todoCounter');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let filter = 'all';
let debounceTimer;

const debounce = (callback, delay) => {
  return (...args) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => callback(...args), delay);
  };
};

function renderTodos() {
  let filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const searchText = searchInput.value.toLowerCase();
  filteredTodos = filteredTodos.filter(todo => todo.text.toLowerCase().includes(searchText));

  todoList.innerHTML = '';
  if (filteredTodos.length === 0) {
    todoList.textContent = 'No results found';
    return;
  }

  filteredTodos.forEach(todo => {
    const div = document.createElement('div');
    div.innerHTML = \`<input type="checkbox" data-id="\${todo.id}" \${todo.completed ? 'checked' : ''}>
                     <span class="\${todo.completed ? 'completed' : ''}">\${todo.text}</span>
                     <button data-id="\${todo.id}" class="delete-btn">Delete</button>\`;
    todoList.appendChild(div);
  });

  const completedCount = todos.filter(t => t.completed).length;
  todoCounter.textContent = \`\${todos.length} total, \${completedCount} completed\`;
}

addTodoBtn.addEventListener('click', () => {
  const text = todoInput.value.trim();
  if (!text) return;
  const newTodo = {
    id: Date.now(),
    text,
    completed: false,
    createdAt: new Date().toISOString()
  };
  todos.push(newTodo);
  localStorage.setItem('todos', JSON.stringify(todos));
  todoInput.value = '';
  renderTodos();
});

todoList.addEventListener('click', (e) => {
  const id = e.target.getAttribute('data-id');
  if (e.target.type === 'checkbox') {
    todos = todos.map(todo => todo.id == id ? { ...todo, completed: !todo.completed } : todo);
  } else if (e.target.classList.contains('delete-btn')) {
    todos = todos.filter(todo => todo.id != id);
  }
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos();
});

document.querySelectorAll('[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    filter = btn.getAttribute('data-filter');
    renderTodos();
  });
});

searchInput.addEventListener('input', debounce(() => renderTodos(), 400));

window.addEventListener('load', renderTodos);
