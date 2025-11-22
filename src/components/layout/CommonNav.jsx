// src/components/common/CommonNav.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CommonNav.css";
import { useAuth } from "../../contexts/AuthContext";

const CommonNav = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate("/login");
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <>
            {/* NAVBAR */}
            <nav className="nav-container">
                <div className="nav-left" onClick={() => navigate("/dashboard")}>
                    <i className="bi bi-journal-bookmark-fill nav-logo-icon"></i>
                    <span className="nav-logo-text">SkillStack</span>
                </div>

                {/* DESKTOP MENU */}
                <div className="nav-links">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/skills">Skills</Link>
                    <Link to="/analytics">Analytics</Link>
                </div>

                {/* PROFILE */}
                <div className="nav-profile">
                    {/* <div className="nav-profile-name">{user?.username}</div> */}
                    <div className="nav-profile-name">
                        <i className="bi bi-person-circle me-2"></i> {user?.username}
                    </div>
                    <div className="nav-profile-menu">
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </div>

                {/* MOBILE HAMBURGER */}
                <div className="nav-hamburger" onClick={() => setMenuOpen(true)}>
                    <i className="bi bi-list"></i>
                </div>
            </nav>

            {/* FULL SCREEN MOBILE MENU */}
            {menuOpen && (
                <div className="mobile-menu-overlay">
                    <div className="mobile-menu-box">
                        <div className="mobile-menu-header">
                            <span className="mobile-menu-title">Menu</span>
                            <i
                                className="bi bi-x-lg mobile-close"
                                onClick={closeMenu}
                            ></i>
                        </div>

                        <div className="mobile-menu-links">
                            <Link to="/dashboard" onClick={closeMenu}>
                                Dashboard
                            </Link>
                            <Link to="/skills" onClick={closeMenu}>
                                Skills
                            </Link>
                            <Link to="/analytics" onClick={closeMenu}>
                                Analytics
                            </Link>

                            <div className="mobile-profile-section">
                                <span className="mobile-username">{user?.username}</span>
                                <button className="logout-btn-mobile" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CommonNav;
