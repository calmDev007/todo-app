const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store
let todos = [
  { id: 1, text: 'Welcome to your todo app!', completed: false },
  { id: 2, text: 'Click the circle to complete a task', completed: false },
  { id: 3, text: 'Hover over a task to delete it', completed: false }
];

let nextId = 4;

// Routes
// Get all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// Create a new todo
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Text is required' });
  }
  
  const newTodo = {
    id: nextId++,
    text: text.trim(),
    completed: false
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Update a todo
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { text, completed } = req.body;
  
  const todo = todos.find(t => t.id === id);
  
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  if (text !== undefined) todo.text = text;
  if (completed !== undefined) todo.completed = completed;
  
  res.json(todo);
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not not found' });
  }
  
  todos.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});