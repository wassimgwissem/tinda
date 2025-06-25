import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import first from '../icons/first.jpg'
import second from '../icons/second.jpg'
import third from '../icons/third.jpg'
import fourth from '../icons/fourth.jpg'
import fifth from '../icons/fifth.jpg'
import sixth from '../icons/sixth.jpg'
import seventh from '../icons/seventh.jpg'
import eighth from '../icons/eighth.jpg'
import nineth from '../icons/nineth.jpg'



const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: "#E9E8E8" }}>
     <Button 
          onClick={() => navigate(-1)}
          variant="outline-dark"
          className="position-absolute top-0 start-0 m-4"
          style={{ zIndex: 1 }}
        >
          ← Back
        </Button>
      {/* Hero Section */}
      <section className=" min-vh-100 d-flex align-items-center">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="order-md-1 mb-5 mb-md-0">
              {/* Right side image placeholder */}
              <div ><img className="ratio ratio-1x1 bg-transparent rounded-3"src={first}/></div>
            </Col>
            <Col md={6} className="pe-md-5">
              <h1 className="display-3 fw-bold mb-4">Find Your Perfect Workspace</h1>
              <p className="lead mb-4">
                SpaceMatch connects professionals with ideal coworking spaces tailored to their needs.
              </p>
              <div className="d-flex gap-3">
                <Button 
                  variant="outline-dark" 
                  size="lg"
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <Container>
          <h2 className="text-center display-5 fw-bold mb-5">How SpaceMatch Works</h2>
          
          <Row className="g-5">
            <Col md={4}>
              <img src={second} className="ratio ratio-1x1 bg-light rounded-3 mb-3"/>
              <h3 className="h4">Smart Matching</h3>
              <p>Our algorithm finds workspaces that fit your preferences and work style.</p>
            </Col>
            <Col md={4}>
              <img src={third} className="ratio ratio-1x1 bg-light rounded-3 mb-3"/>
              <h3 className="h4">Verified Spaces</h3>
              <p>All locations are vetted for quality, amenities, and community standards.</p>
            </Col>
            <Col md={4}>
              <img src={fourth} className="ratio ratio-1x1 bg-light rounded-3 mb-3"/>
              <h3 className="h4">Flexible Plans</h3>
              <p>Choose from hourly, daily, or monthly options to suit your schedule.</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Image + Text Section */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <img src={fifth} className="ratio ratio-1x1 bg-secondary rounded-3"/>
            </Col>
            <Col md={6} className="ps-md-5 mt-5 mt-md-0">
              <h2 className="display-6 fw-bold mb-4">Designed for Productivity</h2>
              <p className="mb-4">
                Our spaces are carefully curated to enhance focus and collaboration. 
                From quiet pods to creative lounges, find the environment that works for you.
              </p>
              <Button variant="outline-dark">Explore Spaces</Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-5 bg-white">
        <Container>
          <h2 className="text-center display-5 fw-bold mb-5">What Our Members Say</h2>
          <Row className="g-4">
            <Col lg={4}>
              <div className="p-4 border rounded-3 h-100">
                <div className="d-flex align-items-center mb-3">
                 <img className="ratio ratio-1x1 rounded-circle bg-light me-3" style={{width: '60px'}}src={sixth}/>
                  <div>
                    <h3 className="h6 mb-0">Sarah K.</h3>
                    <small className="text-muted">Freelance Designer</small>
                  </div>
                </div>
                <p>"Found my perfect workspace in just two clicks. The community is amazing!"</p>
              </div>
            </Col>
            <Col lg={4}>
              <div className="p-4 border rounded-3 h-100">
                <div className="d-flex align-items-center mb-3">
                  <img className="ratio ratio-1x1 rounded-circle bg-light me-3" style={{width: '60px'}} src={seventh}/>
                  <div>
                    <h3 className="h6 mb-0">James L.</h3>
                    <small className="text-muted">Startup Founder</small>
                  </div>
                </div>
                <p>"The flexible plans saved our team thousands in office costs."</p>
              </div>
            </Col>
            <Col lg={4}>
              <div className="p-4 border rounded-3 h-100">
                <div className="d-flex align-items-center mb-3">
                  <img className="ratio ratio-1x1 rounded-circle bg-light me-3" style={{width: '60px'}} src={eighth}/>
                  <div>
                    <h3 className="h6 mb-0">Priya M.</h3>
                    <small className="text-muted">Remote Developer</small>
                  </div>
                </div>
                <p>"Finally a workspace that understands what tech professionals need."</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
<section className="py-5 text-white position-relative">
  <img 
    src={nineth} 
    alt="sign up" 
    className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover z-0 opacity-25"
  />
  
  <Container className="text-center text-dark py-5 position-relative">
    <h2 className="display-5 fw-bold mb-4">Ready to Find Your Space?</h2>
    <p className="lead mb-4">Join thousands of professionals who found their ideal workspace.</p>
    <Button 
      variant="light" 
      size="lg"
      className="px-4"
      onClick={() => navigate('/signup')}
    >
      Sign Up Free
    </Button>
  </Container>
</section>

    </div>
  );
};

export default AboutUs;