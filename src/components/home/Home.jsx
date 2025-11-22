import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className={`home-header ${isScrolled ? 'home-header-scrolled' : ''}`}>
        <Container>
          <div className="home-header-content">
            <div className="home-logo">
              <div className="home-logo-icon">
                <i className="bi bi-journal-bookmark-fill"></i>
              </div>
              <span className="home-logo-text">SkillStack</span>
            </div>

            <nav className="home-nav">
              <button 
                className="home-nav-link" 
                onClick={() => scrollToSection('home-about')}
              >
                About
              </button>
              <button 
                className="home-nav-link" 
                onClick={() => scrollToSection('home-features')}
              >
                Features
              </button>
              <button 
                className="home-nav-link" 
                onClick={() => scrollToSection('home-contact')}
              >
                Contact
              </button>
              <button 
                className="home-nav-btn home-nav-login" 
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button 
                className="home-nav-btn home-nav-register" 
                onClick={() => navigate('/register')}
              >
                Get Started
              </button>
            </nav>
          </div>
        </Container>
      </header>

      {/* Hero Section */}
      <section id="home-hero" className="home-hero">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="home-hero-title">
                Master New Skills
                <span className="home-hero-highlight"> Smarter</span>
              </h1>
              <p className="home-hero-subtitle">
                Track your learning journey, set achievable goals, and unlock your potential 
                with our intelligent skill-building platform. From coding to cooking, we help 
                you learn effectively.
              </p>
              <div className="home-hero-buttons">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="me-3 home-cta-btn"
                  onClick={() => navigate('/register')}
                >
                  Start Learning Now
                  <i className="bi bi-arrow-right ms-2"></i>
                </Button>
                <Button 
                  variant="primary" 
                  size="lg"
                  className="home-cta-btn"
                  onClick={() => scrollToSection('home-features')}
                >
                  Learn More
                  <i className="bi bi-chevron-down ms-2"></i>
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
        <div className="home-scroll-indicator" onClick={() => scrollToSection('home-about')}>
          <i className="bi bi-chevron-down"></i>
        </div>
      </section>

      {/* About Section */}
      <section id="home-about" className="home-about">
        <Container>
          <Row className="justify-content-center text-center mb-5">
            <Col lg={8}>
              <h2 className="home-section-title">Why SkillStack?</h2>
              <p className="home-section-desc">
                SkillStack transforms how you learn by providing intelligent tracking, 
                personalized insights, and structured learning paths. Whether you're advancing 
                your career or exploring new hobbies, we make skill acquisition systematic and rewarding.
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            <Col md={4} className="text-center">
              <Card className="home-stat-card border-0">
                <Card.Body>
                  <div className="home-stat-number">80%</div>
                  <div className="home-stat-label">More Consistent Learning</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="text-center">
              <Card className="home-stat-card border-0">
                <Card.Body>
                  <div className="home-stat-number">2.5x</div>
                  <div className="home-stat-label">Faster Skill Acquisition</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="text-center">
              <Card className="home-stat-card border-0">
                <Card.Body>
                  <div className="home-stat-number">10K+</div>
                  <div className="home-stat-label">Skills Tracked</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section id="home-features" className="home-features">
        <Container>
          <Row className="justify-content-center text-center mb-5">
            <Col lg={8}>
              <h2 className="home-section-title">Powerful Learning Features</h2>
              <p className="home-section-desc">
                Everything you need to build skills effectively and track your progress
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            <Col lg={4} md={6}>
              <Card className="home-feature-card border-0 h-100">
                <Card.Body className="text-center">
                  <div className="home-feature-icon">
                    <i className="bi bi-diagram-3"></i>
                  </div>
                  <Card.Title>Structured Learning Paths</Card.Title>
                  <Card.Text>
                    Break down complex skills into manageable subtopics with AI-powered learning paths
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6}>
              <Card className="home-feature-card border-0 h-100">
                <Card.Body className="text-center">
                  <div className="home-feature-icon">
                    <i className="bi bi-graph-up"></i>
                  </div>
                  <Card.Title>Progress Analytics</Card.Title>
                  <Card.Text>
                    Visualize your learning journey with detailed charts and progress tracking
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6}>
              <Card className="home-feature-card border-0 h-100">
                <Card.Body className="text-center">
                  <div className="home-feature-icon">
                    <i className="bi bi-award"></i>
                  </div>
                  <Card.Title>Achievement System</Card.Title>
                  <Card.Text>
                    Earn certificates and badges for completing skills and maintaining streaks
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6}>
              <Card className="home-feature-card border-0 h-100">
                <Card.Body className="text-center">
                  <div className="home-feature-icon">
                    <i className="bi bi-clock"></i>
                  </div>
                  <Card.Title>Time Tracking</Card.Title>
                  <Card.Text>
                    Monitor your learning hours and optimize your study schedule
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6}>
              <Card className="home-feature-card border-0 h-100">
                <Card.Body className="text-center">
                  <div className="home-feature-icon">
                    <i className="bi bi-bell"></i>
                  </div>
                  <Card.Title>Smart Reminders</Card.Title>
                  <Card.Text>
                    Get notifications to stay on track with your learning goals
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6}>
              <Card className="home-feature-card border-0 h-100">
                <Card.Body className="text-center">
                  <div className="home-feature-icon">
                    <i className="bi bi-phone"></i>
                  </div>
                  <Card.Title>Mobile Friendly</Card.Title>
                  <Card.Text>
                    Access your skills anywhere with our responsive design
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="home-cta">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <div className="home-cta-content">
                <h2>Ready to Master New Skills?</h2>
                <p>Join thousands of learners who are achieving their goals with SkillStack</p>
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="home-cta-btn-large"
                  onClick={() => navigate('/register')}
                >
                  Start Your Learning Journey
                  <i className="bi bi-arrow-right ms-2"></i>
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <section id="home-contact" className="home-contact">
        <Container>
          <Row className="justify-content-center text-center mb-5">
            <Col lg={8}>
              <h2 className="home-section-title">Get In Touch</h2>
              <p className="home-section-desc">
                Have questions about SkillStack? We're here to help you on your learning journey.
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            <Col md={4} className="text-center">
              <Card className="home-contact-card border-0">
                <Card.Body>
                  <div className="home-contact-icon">
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <Card.Title>Email</Card.Title>
                  <Card.Text>support@skillstack.com</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="text-center">
              <Card className="home-contact-card border-0">
                <Card.Body>
                  <div className="home-contact-icon">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <Card.Title>Location</Card.Title>
                  <Card.Text>Kochi</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="text-center">
              <Card className="home-contact-card border-0">
                <Card.Body>
                  <div className="home-contact-icon">
                    <i className="bi bi-chat-dots-fill"></i>
                  </div>
                  <Card.Title>Support</Card.Title>
                  <Card.Text>24/7 Learning Support</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <Container>
          <div className="home-footer-content text-center">
            <div className="home-footer-logo">
              <i className="bi bi-journal-bookmark-fill"></i>
              <span>SkillStack</span>
            </div>
            <p className="home-footer-text">
              &copy; 2024 SkillStack. Build skills, build your future.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Home;