import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/layout/Sidebar";
import { FaPlus, FaBell, FaTrash } from "react-icons/fa";
import "./notes.css";

export default function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("tasks_notes");
    return saved ? JSON.parse(saved) : [];
  });
  const [newNote, setNewNote] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");

  const colors = [
    { id: "yellow", label: "Yellow", hex: "#f7d959" },
    { id: "orange", label: "Orange", hex: "#fb923c" },
    { id: "pink", label: "Pink", hex: "#ec4899" },
    { id: "blue", label: "Blue", hex: "#667eea" },
    { id: "green", label: "Green", hex: "#34d399" }
  ];

  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        text: newNote,
        color: selectedColor,
        createdAt: new Date().toLocaleDateString()
      };
      const updatedNotes = [...notes, note];
      setNotes(updatedNotes);
      localStorage.setItem("tasks_notes", JSON.stringify(updatedNotes));
      setNewNote("");
    }
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem("tasks_notes", JSON.stringify(updatedNotes));
  };

  const colorMap = {
    yellow: { bg: "linear-gradient(135deg, #f7d959 0%, #fcd34d 100%)", text: "#1a1a1a" },
    orange: { bg: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)", text: "#1a1a1a" },
    pink: { bg: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)", text: "#fff" },
    blue: { bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", text: "#fff" },
    green: { bg: "linear-gradient(135deg, #34d399 0%, #10b981 100%)", text: "#fff" }
  };

  return (
    <div className="notes-wrapper">
      <Sidebar />
      <div className="notes-page">
        {/* Header */}
        <header className="notes-header">
          <div className="header-left">
            <h2>My Notes</h2>
            <p className="header-subtitle">Create and organize your notes</p>
          </div>
          <div className="header-right">
            <button className="notification-btn">
              <FaBell />
            </button>
            <img src={`https://i.pravatar.cc/40?u=${user?.email}`} alt="avatar" className="avatar" />
          </div>
        </header>

        {/* Add Note Section */}
        <div className="add-note-section">
          <div className="note-input-container">
            <textarea
              placeholder="Write your note here..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="note-textarea"
              onKeyPress={(e) => e.key === "Enter" && e.ctrlKey && addNote()}
            />
            <div className="note-controls">
              <div className="color-selector">
                {colors.map(color => (
                  <button
                    key={color.id}
                    className={`color-btn ${selectedColor === color.id ? "active" : ""}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color.id)}
                    title={color.label}
                  />
                ))}
              </div>
              <button className="add-note-btn" onClick={addNote}>
                <FaPlus /> Add Note
              </button>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="notes-grid">
          {notes.length > 0 ? (
            notes.map(note => (
              <div
                key={note.id}
                className="note-card"
                style={{ background: colorMap[note.color].bg, color: colorMap[note.color].text }}
              >
                <div className="note-header">
                  <p className="note-date">{note.createdAt}</p>
                  <button
                    className="delete-btn"
                    onClick={() => deleteNote(note.id)}
                    title="Delete note"
                  >
                    <FaTrash />
                  </button>
                </div>
                <p className="note-content">{note.text}</p>
              </div>
            ))
          ) : (
            <div className="empty-notes">
              <p>No notes yet. Create your first note!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
