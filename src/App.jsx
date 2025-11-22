import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import SkillsList from "./components/skills/SkillsList";
import SkillDetail from "./components/skills/SkillDetail";
import Analytics from "./components/analytics/Analytics";

// Common Navigation Bar (new)
import CommonNav from "./components/layout/CommonNav";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();

  return (
    <>
      {/* Show CommonNav only when logged in */}
      {user && <CommonNav />}

      <Routes>
        {/* Home — standalone landing page */}
        <Route path="/" element={<Home />} />

        {/* Public Auth Routes */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/dashboard" />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/skills"
          element={user ? <SkillsList /> : <Navigate to="/login" />}
        />
        <Route
          path="/skills/:id"
          element={user ? <SkillDetail /> : <Navigate to="/login" />}
        />
        <Route
          path="/analytics"
          element={user ? <Analytics /> : <Navigate to="/login" />}
        />

        {/* Unknowns → Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
