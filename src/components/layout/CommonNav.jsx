import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./CommonNav.css";

const CommonNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="common-nav">
      {/* Left - Logo */}
      <div className="nav-left" onClick={() => navigate("/dashboard")}>
        <div className="nav-logo-icon">
          <i className="bi bi-journal-bookmark-fill"></i>
        </div>
        <span className="nav-logo-text">SkillStack</span>
      </div>

      {/* Center Links */}
      <nav className="nav-center">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/skills">Skills</Link>
        <Link to="/analytics">Analytics</Link>
      </nav>

      {/* Right Profile */}
      <div className="nav-right">
        <div
          className="profile-box"
          onClick={() => setShowMenu(!showMenu)}
        >
          <i className="bi bi-person-circle profile-icon"></i>
          <span className="username">{user?.username}</span>
          <i className="bi bi-chevron-down caret"></i>
        </div>

        {showMenu && (
          <div className="profile-dropdown">
            <button className="dropdown-item" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default CommonNav;
