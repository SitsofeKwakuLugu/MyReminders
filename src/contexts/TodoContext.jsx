import { createContext, useState, useContext } from "react";

export const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);

  // Add a new To-Do
  const addTodo = (todo) => {
    setTodos(prev => [
      ...prev,
      { id: Date.now(), subTodos: [], ...todo }
    ]);
  };

  // Edit an existing To-Do
  const editTodo = (id, updated) => {
    setTodos(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, ...updated } : todo))
    );
  };

  // Delete a To-Do
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // Add a sub To-Do to a parent
  const addSubTodo = (parentId, subTodo) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === parentId
          ? {
              ...todo,
              subTodos: [...todo.subTodos, { id: Date.now(), ...subTodo }]
            }
          : todo
      )
    );
  };

  // Edit a sub To-Do
  const editSubTodo = (parentId, subId, updated) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === parentId
          ? {
              ...todo,
              subTodos: todo.subTodos.map(sub =>
                sub.id === subId ? { ...sub, ...updated } : sub
              )
            }
          : todo
      )
    );
  };

  // Delete a sub To-Do
  const deleteSubTodo = (parentId, subId) => {
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
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        editTodo,
        deleteTodo,
        addSubTodo,
        editSubTodo,
        deleteSubTodo
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

// Custom hook for easier use
export const useTodos = () => useContext(TodoContext);
