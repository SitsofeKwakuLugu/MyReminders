import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { noteService } from "../services/noteService";
import Sidebar from "../components/layout/Sidebar";
import { FaPlus, FaBell, FaTrash } from "react-icons/fa";
import "./notes.css";

export default function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadNotes = async () => {
      if (isAuthenticated) {
        try {
          const res = await noteService.getNotes();
          setNotes(Array.isArray(res) ? res : []);
        } catch (err) {
          console.error('Failed to load notes from API:', err);
          // fallback to localStorage
          const saved = localStorage.getItem('tasks_notes');
          setNotes(saved ? JSON.parse(saved) : []);
        }
      } else {
        const saved = localStorage.getItem('tasks_notes');
        setNotes(saved ? JSON.parse(saved) : []);
      }
    };
    loadNotes();
  }, [isAuthenticated]);
  const [newNote, setNewNote] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");

  const colors = [
    { id: "yellow", label: "Yellow", hex: "#f7d959" },
    { id: "orange", label: "Orange", hex: "#fb923c" },
    { id: "pink", label: "Pink", hex: "#ec4899" },
    { id: "blue", label: "Blue", hex: "#667eea" },
    { id: "green", label: "Green", hex: "#34d399" }
  ];

  const addNote = async () => {
    if (!newNote.trim()) return;

    if (isAuthenticated) {
      try {
        const payload = {
          title: newNote.length > 30 ? newNote.slice(0, 30) : newNote,
          content: newNote,
          category: selectedColor,
        };
        const created = await noteService.createNote(payload);
        setNotes(prev => [...prev, created]);
        setNewNote('');
      } catch (err) {
        console.error('Failed to create note via API:', err);
        alert('Failed to save note: ' + err.message);
      }
    } else {
      const note = {
        id: Date.now(),
        title: newNote.length > 30 ? newNote.slice(0, 30) : newNote,
        content: newNote,
        color: selectedColor,
        createdAt: new Date().toLocaleDateString()
      };
      const updatedNotes = [...notes, note];
      setNotes(updatedNotes);
      localStorage.setItem("tasks_notes", JSON.stringify(updatedNotes));
      setNewNote("");
    }
  };

  const deleteNote = async (id) => {
    if (isAuthenticated) {
      try {
        await noteService.deleteNote(id);
        setNotes(prev => prev.filter(note => note.id !== id));
      } catch (err) {
        console.error('Failed to delete note via API:', err);
        alert('Failed to delete note: ' + err.message);
      }
    } else {
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      localStorage.setItem("tasks_notes", JSON.stringify(updatedNotes));
    }
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
            notes.map(note => {
              const colKey = note.category || note.color || 'yellow';
              const cmap = colorMap[colKey] || colorMap.yellow;
              const created = note.createdAt || note.created_at || note.createdAt || new Date().toLocaleDateString();
              const content = note.content || note.text || '';

              return (
                <div
                  key={note.id}
                  className="note-card"
                  style={{ background: cmap.bg, color: cmap.text }}
                >
                  <div className="note-header">
                    <p className="note-date">{created}</p>
                    <button
                      className="delete-btn"
                      onClick={() => deleteNote(note.id)}
                      title="Delete note"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <p className="note-content">{content}</p>
                </div>
              );
            })
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
