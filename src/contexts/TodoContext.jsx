import { createContext, useState, useContext, useEffect } from "react";
import { todoService } from "../services/todoService";
import { useAuth } from "../hooks/useAuth";

const TodoContext = createContext();

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
      // Handle both paginated and direct responses
      const todos = response.data || response;
      setTodos(Array.isArray(todos) ? todos : []);
    } catch (err) {
      console.error('Error loading todos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const addSubTodo = async (parentId, subTodo) => {
    try {
      setError(null);
      const response = await todoService.createSubTodo(parentId, subTodo);
      setTodos(prev =>
        prev.map(todo =>
          todo.id === parentId
            ? { ...todo, subTodos: [...(todo.subTodos || []), response] }
            : todo
        )
      );
      return response;
    } catch (err) {
      console.error('Error adding sub-todo:', err);
      setError(err.message);
      throw err;
    }
  };

  const editSubTodo = async (parentId, subId, updated) => {
    try {
      setError(null);
      const response = await todoService.updateSubTodo(parentId, subId, updated);
      setTodos(prev =>
        prev.map(todo =>
          todo.id === parentId
            ? {
                ...todo,
                subTodos: todo.subTodos.map(sub =>
                  sub.id === subId ? response : sub
                )
              }
            : todo
        )
      );
      return response;
    } catch (err) {
      console.error('Error editing sub-todo:', err);
      setError(err.message);
      throw err;
    }
  };

  const deleteSubTodo = async (parentId, subId) => {
    try {
      setError(null);
      await todoService.deleteSubTodo(parentId, subId);
      setTodos(prev =>
        prev.map(todo =>
          todo.id === parentId
            ? {
                ...todo,
                subTodos: todo.subTodos.filter(sub => sub.id !== subId)
              }
            : todo
        )
      );
    } catch (err) {
      console.error('Error deleting sub-todo:', err);
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
        addSubTodo,
        editSubTodo,
        deleteSubTodo,
        loadTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

// Custom hook for easier use
const useTodos = () => useContext(TodoContext);

export { TodoContext, useTodos };
