import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTodos } from "../contexts/TodoContext";
import Sidebar from "../components/layout/Sidebar";
import { FaBell } from "react-icons/fa";
import "./calendar.css";

export default function Calendar() {
  const { user } = useAuth();
  const { todos } = useTodos();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // Jan 6, 2025

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getTasksForDate = (day) => {
    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      const todoDate = new Date(todo.dueDate);
      return (
        todoDate.getDate() === day &&
        todoDate.getMonth() === currentDate.getMonth() &&
        todoDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  return (
    <div className="calendar-wrapper">
      <Sidebar />
      <div className="calendar-page">
        {/* Header */}
        <header className="calendar-header">
          <div className="header-left">
            <h2>Calendar</h2>
            <p className="header-subtitle">View your tasks by date</p>
          </div>
          <div className="header-right">
            <button className="notification-btn">
              <FaBell />
            </button>
            <img src={`https://i.pravatar.cc/40?u=${user?.email}`} alt="avatar" className="avatar" />
          </div>
        </header>

        {/* Calendar Card */}
        <div className="calendar-card">
          <div className="calendar-header-controls">
            <button className="nav-btn" onClick={previousMonth}>←</button>
            <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
            <button className="nav-btn" onClick={nextMonth}>→</button>
          </div>

          <div className="calendar-grid">
            {dayNames.map(day => (
              <div key={day} className="day-header">
                {day}
              </div>
            ))}

            {days.map((day, index) => {
              const tasksForDay = day ? getTasksForDate(day) : [];
              return (
                <div key={index} className={`calendar-day ${!day ? "empty" : ""}`}>
                  {day && (
                    <>
                      <span className="day-number">{day}</span>
                      {tasksForDay.length > 0 && (
                        <div className="task-indicators">
                          {tasksForDay.slice(0, 3).map(task => (
                            <div key={task.id} className={`indicator ${task.priority?.toLowerCase() || "low"}`} title={task.title} />
                          ))}
                          {tasksForDay.length > 3 && <span className="more">+{tasksForDay.length - 3}</span>}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="calendar-legend">
            <div className="legend-item">
              <span className="indicator high" />
              <span>High Priority</span>
            </div>
            <div className="legend-item">
              <span className="indicator medium" />
              <span>Medium Priority</span>
            </div>
            <div className="legend-item">
              <span className="indicator low" />
              <span>Low Priority</span>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="tasks-by-date">
          <h3>Tasks in {monthNames[currentDate.getMonth()]}</h3>
          {todos.length > 0 ? (
            <div className="tasks-list">
              {todos
                .filter(todo => {
                  if (!todo.dueDate) return false;
                  const todoDate = new Date(todo.dueDate);
                  return (
                    todoDate.getMonth() === currentDate.getMonth() &&
                    todoDate.getFullYear() === currentDate.getFullYear()
                  );
                })
                .map(task => (
                  <div key={task.id} className="task-item">
                    <div className="task-info">
                      <h4>{task.title}</h4>
                      <p>{task.dueDate}</p>
                    </div>
                    <span className={`priority ${task.priority?.toLowerCase() || "low"}`}>
                      {task.priority || "Medium"}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="no-tasks">No tasks scheduled. Add tasks with due dates!</p>
          )}
        </div>
      </div>
    </div>
  );
}
