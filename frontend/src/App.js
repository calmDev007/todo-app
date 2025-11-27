import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Check } from 'lucide-react';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api'; 

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_URL}/todos`);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Unable to connect yes  no to server. Make sure the backend is running on port 5000.');
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodo }),
      });
      if (!response.ok) throw new Error('Failed to add todo');
      const data = await response.json();
      setTodos([...todos, data]);
      setNewTodo('');
      setError(null);
    } catch (err) {
      setError('Failed to add todo. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!response.ok) throw new Error('Failed to update todo');
      const data = await response.json();
      setTodos(todos.map(t => t.id === id ? data : t));
      setError(null);
    } catch (err) {
      setError('Failed to update todo. Please try again.');
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete todo');
      setTodos(todos.filter(t => t.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
    }
  };

  const activeTodos = todos.filter(t => !t.completed).length;

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    },
    card: {
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      overflow: 'hidden'
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '30px',
      textAlign: 'center',
      color: 'white'
    },
    title: {
      margin: '0 0 10px 0',
      fontSize: '32px',
      fontWeight: 'bold'
    },
    subtitle: {
      margin: 0,
      opacity: 0.9,
      fontSize: '14px'
    },
    content: {
      padding: '30px'
    },
    error: {
      backgroundColor: '#fee',
      border: '1px solid #fcc',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '20px',
      color: '#c33',
      fontSize: '14px'
    },
    inputContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '25px'
    },
    input: {
      flex: 1,
      padding: '12px 15px',
      border: '2px solid #ddd',
      borderRadius: '8px',
      fontSize: '15px',
      outline: 'none',
      transition: 'border-color 0.3s'
    },
    button: {
      padding: '12px 25px',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'background-color 0.3s'
    },
    todoList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    todoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      padding: '15px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      transition: 'background-color 0.3s'
    },
    checkbox: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      border: '2px solid #ddd',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s',
      flexShrink: 0
    },
    checkboxCompleted: {
      backgroundColor: '#4ade80',
      borderColor: '#4ade80'
    },
    todoText: {
      flex: 1,
      fontSize: '15px',
      color: '#333'
    },
    todoTextCompleted: {
      textDecoration: 'line-through',
      color: '#999'
    },
    deleteButton: {
      padding: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      color: '#999',
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'color 0.3s'
    },
    emptyState: {
      textAlign: 'center',
      padding: '50px 20px',
      color: '#999'
    },
    loading: {
      textAlign: 'center',
      padding: '30px',
      color: '#999'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Todo List</h1>
          <p style={styles.subtitle}>
            {activeTodos} {activeTodos === 1 ? 'task' : 'tasks'} remaining
          </p>
        </div>

        <div style={styles.content}>
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <div style={styles.inputContainer}>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
              placeholder="Add a new task..."
              style={styles.input}
            />
            <button
              onClick={addTodo}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#5568d3'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
              style={styles.button}
            >
              <Plus size={20} />
              Add
            </button>
          </div>

          {loading ? (
            <div style={styles.loading}>Loading todos...</div>
          ) : todos.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>No todos yet!</div>
              <div style={{ fontSize: '14px' }}>Add your first task to get started</div>
            </div>
          ) : (
            <div style={styles.todoList}>
              {todos.map((todo) => (
                <div
                  key={todo._id}
                  style={styles.todoItem}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                >
                  <div
                    onClick={() => toggleTodo(todo.id)}
                    onMouseEnter={(e) => {
                      if (!todo.completed) e.currentTarget.style.borderColor = '#667eea';
                    }}
                    onMouseLeave={(e) => {
                      if (!todo.completed) e.currentTarget.style.borderColor = '#ddd';
                    }}
                    style={{
                      ...styles.checkbox,
                      ...(todo.completed ? styles.checkboxCompleted : {})
                    }}
                  >
                    {todo.completed && <Check size={16} color="white" />}
                  </div>
                  
                  <span style={{
                    ...styles.todoText,
                    ...(todo.completed ? styles.todoTextCompleted : {})
                  }}>
                    {todo.text}
                  </span>
                  
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                    onMouseLeave={(e) => e.target.style.color = '#999'}
                    style={styles.deleteButton}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}