import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import navicon from '../icons/navicon.png';

const SafetyTips = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white vh-100 d-flex flex-column">
      {/* Header */}
      <div className="bg-white sticky-top d-flex align-items-center shadow-sm ps-lg-5" style={{ height: '10.5vh' }}>
        <img 
          src={navicon} 
          alt="SpaceMatch Logo" 
          style={{cursor:'pointer'}}
          className="img-fluid h-100 object-fit-contain pe-2 cursor-pointer"
          onClick={() => navigate('/')}
        />
        <span 
          className="display-3 fw-bolder text-nowrap cursor-pointer" 
          style={{ letterSpacing: '-2px' }}
          onClick={() => navigate('/')}
        >
          SpaceMatch
        </span>
      </div>

      {/* Content */}
      <Container fluid className="flex-grow-1 px-5 py-4">
        <Row className="justify-content-center ">
          <Col lg={10} >
            <h1 className="fw-bold display-5 mb-4">Safety Tips</h1>
            
            <p className="text-muted fs-5 lh-lg mb-4">
              Your safety is our top priority at SpaceMatch. These tips will help ensure secure and positive experiences in all shared workspaces.
            </p>
            
            <h2 className="fw-bold mt-5 mb-4 fs-3">General Safety</h2>
            
            <ListGroup as="ol" numbered className="mb-5">
              <ListGroup.Item as="li" className="border-0 bg-white ps-0 mb-3">
                <strong className="fw-bold text-dark">Verify Spaces</strong>
                <span className="text-muted lh-lg">
                  - Only book spaces with verified badges
                  - Check reviews and ratings before booking
                  - Look for clear photos of the actual workspace
                </span>
              </ListGroup.Item>
              
              <ListGroup.Item as="li" className="border-0 bg-white ps-0 mb-3">
                <strong className="fw-bold text-dark">Protect Personal Information</strong>
                <span className="text-muted lh-lg">
                  - Never share passwords or financial details
                  - Use SpaceMatch messaging for all communications
                  - Be cautious about sharing schedules or routines
                </span>
              </ListGroup.Item>
              
              <ListGroup.Item as="li" className="border-0 bg-white ps-0 mb-3">
                <strong className="fw-bold text-dark">Secure Your Devices</strong>
                <span className="text-muted lh-lg">
                  - Use VPNs on public WiFi
                  - Enable screen privacy filters
                  - Never leave devices unattended
                </span>
              </ListGroup.Item>
            </ListGroup>

            <h2 className="fw-bold mt-5 mb-4 fs-3">Meeting Safely</h2>
            
            <ListGroup as="ul" className="mb-5">
              <ListGroup.Item className="border-0 bg-white ps-0 mb-3">
                <div className="d-flex">
                  <span className="fw-bold text-dark me-2">•</span>
                  <span className="text-muted lh-lg">
                    Meet first in public areas of coworking spaces
                  </span>
                </div>
              </ListGroup.Item>
              
              <ListGroup.Item className="border-0 bg-white ps-0 mb-3">
                <div className="d-flex">
                  <span className="fw-bold text-dark me-2">•</span>
                  <span className="text-muted lh-lg">
                    Inform someone about your meeting plans
                  </span>
                </div>
              </ListGroup.Item>
              
              <ListGroup.Item className="border-0 bg-white ps-0 mb-3">
                <div className="d-flex">
                  <span className="fw-bold text-dark me-2">•</span>
                  <span className="text-muted lh-lg">
                    Trust your instincts - leave if uncomfortable
                  </span>
                </div>
              </ListGroup.Item>
            </ListGroup>

            <h2 className="fw-bold mt-5 mb-4 fs-3">Emergency Protocols</h2>
            
            <div className="bg-light p-4 rounded-3 mb-5">
              <h3 className="h5 fw-bold mb-3">If you feel unsafe:</h3>
              <ul className="text-muted lh-lg ps-3 mb-0">
                <li className="mb-2">1. Move to a public area immediately</li>
                <li className="mb-2">2. Contact SpaceMatch safety team via emergency button in app</li>
                <li className="mb-2">3. If in immediate danger, contact local authorities first</li>
                <li>4. Report the incident through our app for follow-up</li>
              </ul>
            </div>

            <div className="d-flex justify-content-between border-top pt-4">
              <Button 
                variant="outline-dark" 
                onClick={() => navigate('/communityguidelines')}
              >
                ← Community Guidelines
              </Button>
              <Button 
                variant="dark"
                onClick={() => navigate('/contact')}
              >
                Contact Safety Team
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      

      {/* Footer */}
      <div className="copyright-section py-4 border-top text-center bg-white">
        © {new Date().getFullYear()} SpaceMatch. All rights reserved.
      </div>
    </div>
  );
};

export default SafetyTips;