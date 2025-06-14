import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content-wrapper">
          <Container>
            <Row className="align-items-center">
              <Col lg={6} className="hero-content">
                <h1>Create Your Professional Resume</h1>
                <p className="hero-description">
                  Build a standout resume that gets you noticed. Our AI-powered platform helps you create professional resumes in minutes.
                </p>
                <Button 
                  as={Link} 
                  to="/templates" 
                  className="cta-button"
                >
                  Create Resume
                </Button>
              </Col>
              <Col lg={6} className="hero-image">
                <img 
                  src="/Images/Main-logo.svg" 
                  alt="Resume Builder" 
                  className="main-logo"
                />
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-wrapper">
          <Container>
            <h2 className="section-title">Our Features</h2>
            <Row>
              <Col md={4}>
                <div className="feature-card">
                  <div className="feature-icon">📝</div>
                  <h3>Smart Templates</h3>
                  <p>Choose from professionally designed templates tailored for your industry</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="feature-card">
                  <div className="feature-icon">🤖</div>
                  <h3>AI Assistance</h3>
                  <p>Get intelligent suggestions to enhance your resume content</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="feature-card">
                  <div className="feature-icon">📱</div>
                  <h3>Easy Export</h3>
                  <p>Download your resume in multiple formats with one click</p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="section-wrapper">
          <Container>
            <h2 className="section-title">How It Works</h2>
            <Row className="justify-content-center">
              <Col lg={10}>
                <div className="process-timeline">
                  <div className="process-step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h3>Choose Your Template</h3>
                      <p>Select from our collection of professionally designed templates tailored for various industries and career levels.</p>
                    </div>
                  </div>
                  <div className="process-step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h3>Fill Your Details</h3>
                      <p>Enter your personal information, work experience, education, and skills. Our AI will analyze your content and provide smart suggestions.</p>
                    </div>
                  </div>
                  <div className="process-step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h3>Customize & Export</h3>
                      <p>Fine-tune your resume with our intuitive editor. Add sections, adjust formatting, and preview in real-time.</p>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-lg-start text-white" style={{ backgroundColor: '#45526e' }}>
        {/* Grid container */}
        <div className="container p-4 pb-0">
          {/* Section: Links */}
          <section>
            {/*Grid row*/}
            <div className="row">
              {/* Grid column */}
              <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">
                  AI Resume Assistant
                </h6>
                <p>
                  We help professionals create stunning resumes that stand out to employers. 
                  Our AI-powered platform makes resume creation easy and effective.
                </p>
              </div>
              {/* Grid column */}

              <hr className="w-100 clearfix d-md-none" />

              {/* Grid column */}
              <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">Features</h6>
                <p>
                  <a className="text-white">Smart Templates</a>
                </p>
                <p>
                  <a className="text-white">AI Assistance</a>
                </p>
                <p>
                  <a className="text-white">Easy Export</a>
                </p>
                <p>
                  <a className="text-white">Real-time Preview</a>
                </p>
              </div>
              {/* Grid column */}

              <hr className="w-100 clearfix d-md-none" />

              {/* Grid column */}
              <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">
                  Useful links
                </h6>
                <p>
                  <a className="text-white">Your Account</a>
                </p>
                <p>
                  <a className="text-white">Privacy Policy</a>
                </p>
                <p>
                  <a className="text-white">Terms of Service</a>
                </p>
                <p>
                  <a className="text-white">Help Center</a>
                </p>
              </div>

              {/* Grid column */}
              <hr className="w-100 clearfix d-md-none" />

              {/* Grid column */}
              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">Contact</h6>
                <p><i className="fas fa-home mr-3"></i> Nairobi, Kenya</p>
                <p><i className="fas fa-envelope mr-3"></i> talentsight@gmail.com</p>
                <p><i className="fas fa-phone mr-3"></i> 0789452687</p>
                <p><i className="fas fa-print mr-3"></i> 0789452687</p>
              </div>
              {/* Grid column */}
            </div>
            {/*Grid row*/}
          </section>
          {/* Section: Links */}

          <hr className="my-3" />

          {/* Section: Copyright */}
          <section className="p-3 pt-0">
            <div className="row d-flex align-items-center">
              {/* Grid column */}
              <div className="col-md-7 col-lg-8 text-center text-md-start">
                {/* Copyright */}
                <div className="p-3">
                  © {new Date().getFullYear()} Copyright:
                  <a className="text-white" href="/"> AI Resume Assistant</a>
                </div>
                {/* Copyright */}
              </div>
              {/* Grid column */}

              {/* Grid column */}
              <div className="col-md-5 col-lg-4 ml-lg-0 text-center text-md-end">
                {/* Facebook */}
                <a
                  className="btn btn-outline-light btn-floating m-1"
                  href="#!"
                  role="button"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>

                {/* Twitter */}
                <a
                  className="btn btn-outline-light btn-floating m-1"
                  href="#!"
                  role="button"
                >
                  <i className="fab fa-twitter"></i>
                </a>

                {/* Google */}
                <a
                  className="btn btn-outline-light btn-floating m-1"
                  href="#!"
                  role="button"
                >
                  <i className="fab fa-google"></i>
                </a>

                {/* Instagram */}
                <a
                  className="btn btn-outline-light btn-floating m-1"
                  href="#!"
                  role="button"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
              {/* Grid column */}
            </div>
          </section>
          {/* Section: Copyright */}
        </div>
        {/* Grid container */}
      </footer>
    </div>
  );
}

export default LandingPage;
