import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTodos } from "../../contexts/TodoContext";
import Form from "../common/Form";
import Modal from "../common/Modal";

export default function TodoItem({ todo }) {
  const { editTodo, deleteTodo, addSubTodo, editSubTodo, deleteSubTodo } = useTodos();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingSub, setIsAddingSub] = useState(false);
  const [subOpen, setSubOpen] = useState(false);

  const handleEdit = (data) => {
    editTodo(todo.id, data);
    setIsEditing(false);
  };

  const handleAddSub = (data) => {
    addSubTodo(todo.id, data);
    setIsAddingSub(false);
    setSubOpen(true);
  };

  return (
    <li className="todo-card">
      <div className="todo-header">
        <h3>{todo.title}</h3>
        <div className="todo-actions">
          <button onClick={() => setIsEditing(true)} title="Edit"><FaEdit /></button>
          <button onClick={() => deleteTodo(todo.id)} title="Delete"><FaTrash /></button>
          <button onClick={() => setIsAddingSub(true)} title="Add Sub-To-Do"><FaPlus /></button>
          {todo.subTodos.length > 0 && (
            <button onClick={() => setSubOpen(!subOpen)} title="Toggle Sub-To-Dos">
              {subOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          )}
        </div>
      </div>

      {todo.description && <p className="todo-desc">{todo.description}</p>}

      {subOpen && todo.subTodos.length > 0 && (
        <ul className="sub-todo-list">
          {todo.subTodos.map(sub => (
            <li key={sub.id} className="sub-todo-card">
              <span>{sub.title}</span>
              <div>
                <button onClick={() => {
                  const newTitle = prompt("Edit sub To-Do", sub.title);
                  if (newTitle) editSubTodo(todo.id, sub.id, { title: newTitle });
                }} title="Edit"><FaEdit /></button>
                <button onClick={() => deleteSubTodo(todo.id, sub.id)} title="Delete"><FaTrash /></button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <Modal title="Edit To-Do" onClose={() => setIsEditing(false)}>
          <Form
            title=""
            fields={[
              { name: "title", label: "Title", required: true },
              { name: "description", label: "Description" }
            ]}
            initialValues={todo}
            submitLabel="Save"
            onSubmit={handleEdit}
            onCancel={() => setIsEditing(false)}
          />
        </Modal>
      )}

      {/* Add Sub Modal */}
      {isAddingSub && (
        <Modal title="New Sub-To-Do" onClose={() => setIsAddingSub(false)}>
          <Form
            title=""
            fields={[{ name: "title", label: "Title", required: true }]}
            submitLabel="Add"
            onSubmit={handleAddSub}
            onCancel={() => setIsAddingSub(false)}
          />
        </Modal>
      )}
    </li>
  );
}
