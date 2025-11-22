import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="white" expand="lg" className="border-bottom shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard" className="fw-bold text-primary">
          <i className="bi bi-journal-bookmark-fill me-2"></i>
          SkillStack
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">
              <i className="bi bi-speedometer2 me-1"></i>
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/skills">
              <i className="bi bi-journal-text me-1"></i>
              My Skills
            </Nav.Link>
            <Nav.Link as={Link} to="/analytics">
              <i className="bi bi-graph-up me-1"></i>
              Analytics
            </Nav.Link>
          </Nav>
          
          <Nav className="align-items-center">
            <Nav.Text className="me-3">
              <i className="bi bi-person-circle me-1"></i>
              Welcome, {user?.username}
            </Nav.Text>
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

// Make sure to export as default
export default NavigationBar;