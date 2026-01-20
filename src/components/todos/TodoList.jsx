import TodoItem from "./TodoItem";

export default function TodoList({ todos }) {
  if (todos.length === 0) return <p>No To-Dos yet.</p>;

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
