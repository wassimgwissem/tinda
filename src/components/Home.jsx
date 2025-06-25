import homeicon from '../icons/land.jpg';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import logoicon from "../icons/navicon.png"
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import icon from '../icons/navicon.png'

const Home = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const popupRef = useRef()
    const navigate = useNavigate()
    const [showlogin, setShowLogin] = useState(false);
    
    useEffect(() => {
        if (showlogin) {
            setTimeout(() => {
                popupRef.current.style.opacity = 1;
                popupRef.current.style.transform = 'scale(1) translateY(0)';
            }, 10);
        }
    }, [showlogin]);

    return (
        <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
            <div className="container-fluid flex-grow-1 px-0 overflow-hidden">
                <div className="row g-0 h-100">
                    {/* Left image column - full width on mobile, half on lg+ */}
                    <div className=" col-lg-6 p-0 min-vh-100" style={{ overflow: "hidden" }}>
                        <img src={homeicon} className="w-100 h-100 img-fluid object-fit-cover" alt="Home" />
                    </div>

                    {/* Right content column - full width on mobile, half on lg+ */}
                    <div className="col-lg-6 p-0 min-vh-100 d-flex flex-column" style={{ backgroundColor: "#E9E8E8" }}>
                        
                        <Navbar expand={false} className="bg-transparent px-4 py-3">
                          <Container fluid className="px-0">
                            <div className="d-flex justify-content-between w-100 align-items-center">
                              {/* Left-aligned group (Logo + Links + Dropdown) */}
                              <div className="d-flex align-items-center gap-5">
                                <Navbar.Brand className="me-0">
                                  <img 
                                    src={logoicon} 
                                    alt="Logo" 
                                    style={{ cursor:'pointer',height: '100px', transition: 'transform 0.3s ease' }}
                                    className="hover-grow"
                                  />
                                </Navbar.Brand>
                                
                                <div className="d-flex align-items-center gap-4 m-0">
                                  <Nav.Link 
                                    onClick={() => navigate('/aboutus')} 
                                    className="nav-link-custom"
                                  >
                                    About Us
                                  </Nav.Link>

                                 <NavDropdown 
                                  title="Safety" 
                                  id="safety-dropdown"
                                  className="nav-link-custom"
                                  show={true} // Let hover control visibility
                                  onMouseEnter={(e) => e.currentTarget.querySelector('.dropdown-menu').style.display = 'block'}
                                  onMouseLeave={(e) => e.currentTarget.querySelector('.dropdown-menu').style.display = 'none'}
                                >
                                  <NavDropdown.Item 
                                    onClick={() => navigate('/communityguidelines')}
                                    className="dropdown-item-custom"
                                  >
                                    Community Guidelines
                                  </NavDropdown.Item>
                                  <NavDropdown.Item 
                                    onClick={() => navigate('/safetytips')}
                                    className="dropdown-item-custom"
                                  >
                                    Safety Tips
                                  </NavDropdown.Item>
                                </NavDropdown>
                                  <Nav.Link 
                                    onClick={() => navigate('/contact')} 
                                    className="nav-link-custom"
                                  >
                                    Contact
                                  </Nav.Link>
                                </div>
                              </div>

                              {/* Right-aligned login and signup buttons */}
                              <div className="d-flex gap-3">
                                <button 
                                  onClick={() => setShowLogin(true)}
                                  className="btn-login-custom"
                                >
                                  Login
                                </button>
                                <button 
                                  onClick={() => navigate('/signup')}
                                  className="btn btn-signup-custom"
                                >
                                  Sign Up
                                </button>
                              </div>
                            </div>
                          </Container>
                        </Navbar>
                        <div className='d-flex flex-column justify-content-center align-items-center mx-auto flex-grow-1'
                            style={{
                                width: '60%',
                                marginTop: '2rem',
                                marginBottom: '2rem',
                            }}>
                            <h1 className="text-center" style={{ fontSize: 55, lineHeight: 1.6, letterSpacing: 2, fontWeight: 'bolder' }}>WORKSPACES THAT WORK FOR YOU</h1>
                            <button onClick={()=>navigate('/aboutus')} className='btn btn-dark mt-5 p-2 btn-learn-custom' style={{ width: "30%", letterSpacing: 1.6 }}>Learn more</button>
                            <div className='d-flex gap-5 mt-5'>
                                <i className="fa-brands fa-facebook" id='socials' style={{ cursor: "pointer", fontSize: "2rem" }}></i>
                                <i className="fa-brands fa-x-twitter" id='socials' style={{ cursor: "pointer", fontSize: "2rem" }}></i>
                                <i className="fa-brands fa-instagram" id='socials' style={{ cursor: "pointer", fontSize: "2rem" }}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

         {showlogin && (
  <div className='position-fixed top-0 w-100 h-100 d-flex align-items-center justify-content-center start-0' 
       style={{ zIndex: 1000, backdropFilter: "blur(3px)", background: "rgba(0,0,0,0.5)" }}>
    
    <div onClick={() => setShowLogin(false)} className="position-fixed top-0 w-100 h-100 start-0" style={{ zIndex: 1049 }} />
    
    <div className=" rounded p-4 d-flex flex-column align-items-center" style={{
    backgroundColor: "#E9E8E8",
     width: '400px',
      maxWidth: '90vw',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      zIndex: 1051,
      position: 'relative',
      opacity: 0,
      transform: 'scale(0.95) translateY(10px)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      transformOrigin: 'center bottom'
    }} ref={popupRef}>
      
      <i className="fa-solid fa-xmark" 
         onClick={() => setShowLogin(false)} 
         style={{ fontSize: 28, position: "absolute", top: 17.5, right: 22, cursor: "pointer" }}></i>
      
      <img src={icon} width="100px" className="my-3" />
      
      <h2 className="fw-bolder mb-3">Get Started</h2>
      <p className="text-muted mb-4">Sign in to access your account</p>
      
      <div className="w-100 mb-3">
        <label className="form-label">Email address</label>
        <input
          style={{ outline: 'none', boxShadow: 'none', borderColor: "black" }}
          type="email"
          className="form-control w-100"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      
      <div className="w-100 mb-3">
        <label className="form-label">Password</label>
        <input
          style={{ outline: 'none', boxShadow: 'none', borderColor: "black" }}
          type="password"
          className="form-control w-100"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </div>
      
      <div className="w-100 mb-4 d-flex justify-content-between align-items-center">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{ 
              outline: 'none', 
              boxShadow: 'none', 
              borderColor: "black",
              backgroundColor: rememberMe ? 'black' : 'white' 
            }}
          />
          <label className="form-check-label">
            Remember me
          </label>
        </div>
        <button 
          className="btn btn-link p-0 text-decoration-none" 
          style={{ color: 'black' }}
        >
          Forgot password?
        </button>
      </div>
      
      <button
        className="btn btn-dark w-100 py-2 mb-3"
        style={{ backgroundColor: 'black' }}
      >
        Sign In
      </button>
      
      <div className="text-center mt-3">
        <p className="text-muted mb-0">
          Don't have an account?{' '}
          <button 
            className="btn btn-link p-0 align-baseline" 
            style={{ color: 'black' }}
            onClick={() => {
              setShowLogin(false);
              navigate('/signup');
            }}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  </div>
)}
        </div>
    );
};

export default Home;