import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/layout/Sidebar";
import { FaBell, FaSignOutAlt, FaUser, FaEnvelope } from "react-icons/fa";
import "./profile.css";

export default function Profile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, you'd update this in the auth service/context
    const currentUser = JSON.parse(localStorage.getItem("tasks_user"));
    const updatedUser = {
      ...currentUser,
      name: formData.name,
      email: formData.email
    };
    localStorage.setItem("tasks_user", JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  return (
    <div className="profile-wrapper">
      <Sidebar />
      <div className="profile-page">
        {/* Header */}
        <header className="profile-header">
          <div className="header-left">
            <h2>Profile</h2>
            <p className="header-subtitle">Manage your account settings</p>
          </div>
          <div className="header-right">
            <button className="notification-btn">
              <FaBell />
            </button>
            <img src={`https://i.pravatar.cc/40?u=${user?.email}`} alt="avatar" className="avatar" />
          </div>
        </header>

        {/* Profile Content */}
        <div className="profile-content">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-avatar-section">
              <img src={`https://i.pravatar.cc/150?u=${user?.email}`} alt="profile" className="profile-avatar" />
              <h3>{formData.name}</h3>
              <p className="email">{formData.email}</p>
            </div>

            {/* Profile Information */}
            <div className="profile-info">
              <h4>Account Information</h4>

              {isEditing ? (
                <div className="edit-form">
                  <div className="form-group">
                    <label htmlFor="profile-fullname">
                      <FaUser /> Full Name
                    </label>
                    <input
                      id="profile-fullname"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="profile-email">
                      <FaEnvelope /> Email
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-actions">
                    <button className="btn primary" onClick={handleSave}>
                      Save Changes
                    </button>
                    <button className="btn secondary" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-details">
                  <div className="detail-item">
                    <label>Full Name</label>
                    <p>{formData.name}</p>
                  </div>

                  <div className="detail-item">
                    <label>Email Address</label>
                    <p>{formData.email}</p>
                  </div>

                  <button className="btn primary" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="danger-card">
            <h4>Danger Zone</h4>
            <p>Log out of your account</p>
            <button className="btn danger" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
