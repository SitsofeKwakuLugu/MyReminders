import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTodos } from "../contexts/TodoContext";
import Form from "../components/common/Form";
import Modal from "../components/common/Modal";
import Sidebar from "../components/layout/Sidebar";
import { FaPlus, FaBell, FaThumbtack, FaEdit, FaTrash } from "react-icons/fa";
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import "./dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const { todos, addTodo, editTodo, deleteTodo, addSubTodo, editSubTodo, deleteSubTodo } = useTodos();

  const [isAdding, setIsAdding] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [addingSubTodoId, setAddingSubTodoId] = useState(null);
  const [editingSubTodo, setEditingSubTodo] = useState(null);

  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = todos.length - completedCount;
  const filteredTodos = todos;

  const handleAddTodo = async (data) => {
    try {
      await addTodo(data);
      setIsAdding(false);
    } catch (err) {
      console.error('Failed to add todo:', err);
      alert('Failed to create task: ' + err.message);
    }
  };

  const editingTodo = todos.find(t => t.id === editingTodoId);

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-page">

        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h2>Welcome Back, {user?.name || "User"}!</h2>
            <p className="header-subtitle">Complete your task today!</p>
          </div>
          <div className="header-right">
            <button className="notification-btn"><FaBell /></button>
            <button className="add-task-top-btn" onClick={() => setIsAdding(true)}>
              <FaPlus /> Add Task +
            </button>
            <img src={`https://i.pravatar.cc/40?u=${user?.email}`} alt="avatar" className="avatar" />
          </div>
        </header>

        {/* Charts & Date Section */}
        <div className="charts-section">
          {/* Active Task Pie Chart */}
          <div className="chart-card">
            <h3>Active Task</h3>
            <div className="donut-chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Completed Task", value: completedCount },
                      { name: "Pending Task", value: pendingCount }
                    ]}
                    cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value"
                  >
                    <Cell fill="#f7d959" />
                    <Cell fill="#667eea" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-center"><span className="donut-value">{todos.length}</span></div>
            </div>
          </div>

          {/* This Week Line Chart */}
          <div className="chart-card">
            <h3>This Week</h3>
            {todos.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart
                  data={[
                    { day: "Sun", tasks: todos.filter(t => t.dueDate?.includes("Sun")).length },
                    { day: "Mon", tasks: todos.filter(t => t.dueDate?.includes("Mon")).length },
                    { day: "Tue", tasks: todos.filter(t => t.dueDate?.includes("Tue")).length },
                    { day: "Wed", tasks: todos.filter(t => t.dueDate?.includes("Wed")).length },
                    { day: "Thu", tasks: todos.filter(t => t.dueDate?.includes("Thu")).length },
                    { day: "Fri", tasks: todos.filter(t => t.dueDate?.includes("Fri")).length },
                    { day: "Sat", tasks: todos.filter(t => t.dueDate?.includes("Sat")).length },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ background: "rgba(31,31,58,0.9)", border: "1px solid rgba(255,255,255,0.2)" }} labelStyle={{ color: "#fff" }} />
                  <Line type="monotone" dataKey="tasks" stroke="#667eea" strokeWidth={3} dot={{ fill: "#f7d959", r: 6 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: "240px", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)" }}>
                <p>Add tasks to see weekly activity</p>
              </div>
            )}
          </div>

          {/* Date/Time Card */}
          <div className="date-time-card">
            <div className="time-display">
              <div className="date-info">
                <p className="month-year">Jan 2025</p>
                <p className="current-time">07:18 AM</p>
              </div>
              <div className="day-display">
                <p className="day-name">Monday</p>
                <p className="day-number">6</p>
              </div>
            </div>
            <div className="next-schedule">
              <p className="schedule-label">Next schedule</p>
              <p className="schedule-item">Morning brief - 08:00 AM</p>
              <label className="checkbox-item">
                <input type="checkbox" />
              </label>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="tasks-section">
          {/* Today's Task */}
          <div className="task-list-card">
            <div className="task-card-header">
              <h3>Today's Task</h3>
              <span className="task-count">{filteredTodos.filter(t => !t.completed).length}</span>
            </div>
            {filteredTodos.filter(t => !t.completed).length > 0 ? (
              <ul className="task-items-list">
                {filteredTodos.filter(t => !t.completed).slice(0,5).map(todo => (
                  <li key={todo.id} className="task-item-row">
                    <span className="task-title">{todo.title}</span>
                    <span className={`task-priority ${todo.priority?.toLowerCase() || "low"}`}>{todo.priority || "Medium"}</span>
                    <input type="checkbox" checked={todo.completed} onChange={() => editTodo(todo.id,{completed: !todo.completed})} />
                    <button onClick={() => setEditingTodoId(todo.id)}>Edit</button>
                    <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                    <button onClick={() => setAddingSubTodoId(todo.id)}><FaPlus /></button>

                    {/* Sub-Todos */}
                    {todo.subTodos?.length > 0 && (
                      <ul className="sub-todo-list">
                        {todo.subTodos.map(sub => (
                          <li key={sub.id} className="sub-todo-item">
                            <span className="sub-todo-title">{sub.title}</span>
                            <input type="checkbox" checked={sub.completed} onChange={() => editSubTodo(todo.id, sub.id, {completed: !sub.completed})} />
                            <button onClick={() => setEditingSubTodo({parentId: todo.id, subId: sub.id})}><FaEdit /></button>
                            <button onClick={() => deleteSubTodo(todo.id, sub.id)}><FaTrash /></button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            ) : (<p className="no-tasks">No tasks for today</p>)}
          </div>

          {/* Upcoming Task */}
          <div className="task-list-card">
            <div className="task-card-header">
              <h3>Upcoming Task</h3>
              <span className="task-count">{pendingCount}</span>
            </div>
            {pendingCount > 0 ? (
              <ul className="task-items-list">
                {filteredTodos.filter(t => t.completed).slice(0,5).map(todo => (
                  <li key={todo.id} className="task-item-row">
                    <span className="task-title">{todo.title}</span>
                    <input type="checkbox" checked={todo.completed} readOnly />
                  </li>
                ))}
              </ul>
            ) : (<p className="no-tasks">No upcoming tasks</p>)}
          </div>
        </div>

        {/* Progress & Pinned Notes */}
        <div className="progress-pinned-section">
          {/* Progress Card */}
          <div className="progress-card">
            <h3>Progress</h3>
            {todos.length > 0 ? (
              <>
                <div className="progress-bar-container">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(completedCount / todos.length) * 100}%` }}></div>
                  </div>
                  <div className="progress-stats">
                    <span className="completed-count">{completedCount}</span>
                    <span className="total-count">{todos.length}</span>
                  </div>
                </div>
                <p className="progress-text">{completedCount} of {todos.length} Completed</p>
                <div className="progress-buttons">
                  <button className="progress-btn">Total Task : {todos.length}</button>
                  <button className="progress-btn">Task Completed : {completedCount}</button>
                  <button className="progress-btn">Remaining Task : {pendingCount}</button>
                  <button className="progress-btn">Delayed Task : 0</button>
                </div>
              </>
            ) : (
              <p className="no-tasks">Add tasks to track your progress</p>
            )}
          </div>

          {/* Pinned Notes Card */}
          <div className="pinned-notes-card">
            <h3><FaThumbtack /> Pinned Notes</h3>
            <div className="notes-grid">
              <div className="note-item note-yellow">
                <p className="note-title">Get Started</p>
                <p className="note-text">Click "Add Task +" to create your first task</p>
                <p className="note-date">Start Today</p>
              </div>
              <div className="note-item note-orange">
                <p className="note-title">Organize Tasks</p>
                <p className="note-text">Set priorities and categories for better management</p>
                <p className="note-date">Stay Organized</p>
              </div>
              <div className="note-item note-pink">
                <p className="note-title">Track Progress</p>
                <p className="note-text">Complete tasks and watch your progress grow</p>
                <p className="note-date">Celebrate Wins</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {editingTodo && (
          <Modal title="Edit Task" onClose={() => setEditingTodoId(null)}>
            <Form
              title=""
              fields={[
                { name:"title", label:"Title", required:true },
                { name:"description", label:"Description" },
                { name:"due_date", label:"Due Date", type:"date" },
                { name:"priority", label:"Priority", type:"select", options:["low","medium","high"] },
                { name:"category", label:"Category", type:"select", options:["Work","Personal","Shopping","Health","Other"] }
              ]}
              initialValues={editingTodo}
              submitLabel="Save"
              onSubmit={(data) => {editTodo(editingTodo.id,data); setEditingTodoId(null)}}
              onCancel={()=>setEditingTodoId(null)}
            />
          </Modal>
        )}

        {isAdding && (
          <Modal title="New To-Do" onClose={()=>setIsAdding(false)}>
            <Form
              title=""
              fields={[
                { name:"title", label:"Title", required:true },
                { name:"description", label:"Description" },
                { name:"due_date", label:"Due Date", type:"date" },
                { name:"priority", label:"Priority", type:"select", options:["low","medium","high"] },
                { name:"category", label:"Category", type:"select", options:["Work","Personal","Shopping","Health","Other"] }
              ]}
              submitLabel="Create"
              onSubmit={handleAddTodo}
              onCancel={()=>setIsAdding(false)}
            />
          </Modal>
        )}

        {addingSubTodoId && (
          <Modal title="Add Sub-Task" onClose={()=>setAddingSubTodoId(null)}>
            <Form
              title=""
              fields={[{name:"title", label:"Sub-Task Title", required:true}]}
              submitLabel="Create"
              onSubmit={(data)=>{addSubTodo(addingSubTodoId,data); setAddingSubTodoId(null)}}
              onCancel={()=>setAddingSubTodoId(null)}
            />
          </Modal>
        )}

        {editingSubTodo && (
          <Modal title="Edit Sub-Task" onClose={()=>setEditingSubTodo(null)}>
            <Form
              title=""
              fields={[{name:"title", label:"Sub-Task Title", required:true}]}
              initialValues={filteredTodos.find(t=>t.id===editingSubTodo.parentId).subTodos.find(s=>s.id===editingSubTodo.subId)}
              submitLabel="Save"
              onSubmit={(data)=>{editSubTodo(editingSubTodo.parentId, editingSubTodo.subId, data); setEditingSubTodo(null)}}
              onCancel={()=>setEditingSubTodo(null)}
            />
          </Modal>
        )}

      </div>
    </div>
  );
}
