import { createContext, useState, useContext, useEffect } from "react";
import { todoService } from "../services/todoService";
import { useAuth } from "../hooks/useAuth";

export const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Load todos from backend when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadTodos();
    } else {
      setTodos([]);
    }
  }, [isAuthenticated]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await todoService.getTodos();
      console.log('Loaded todos response:', response);
      setTodos(response.data || []);
    } catch (err) {
      console.error('Error loading todos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add a new To-Do
  const addTodo = async (todo) => {
    try {
      setError(null);
      const newTodo = await todoService.createTodo(todo);
      console.log('Created todo:', newTodo);
      setTodos(prev => [newTodo, ...prev]);
      return newTodo;
    } catch (err) {
      console.error('Error adding todo:', err);
      setError(err.message);
      throw err;
    }
  };

  // Edit an existing To-Do
  const editTodo = async (id, updated) => {
    try {
      setError(null);
      const updatedTodo = await todoService.updateTodo(id, updated);
      setTodos(prev =>
        prev.map(todo => (todo.id === id ? updatedTodo : todo))
      );
      return updatedTodo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete a To-Do
  const deleteTodo = async (id) => {
    try {
      setError(null);
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        error,
        addTodo,
        editTodo,
        deleteTodo,
        loadTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

// Custom hook for easier use
export const useTodos = () => useContext(TodoContext);
