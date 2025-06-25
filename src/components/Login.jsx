import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import homeicon from '../icons/navicon.png';
import { login } from '../utils/api';
import ForgotPasswordPopup from './ForgotPasswordPopup';

const Login = ({ setLoggedUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const final = await login(email, password);
      setLoggedUser(final.user);
      
      if (final.user.role === 'admin') {
        navigate('/userslist', { replace: true });
      } else {
        navigate(final.user.userType === 'business' ? '/host' : '/individual', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#E9E8E8" }}>
      <button 
        onClick={() => navigate('/')}
        className="btn btn-outline-dark mb-5 position-absolute top-0 start-0 m-4"
      >
        ← Back Home
      </button>

      <Container className="py-5 min-vh-100 d-flex align-items-center justify-content-center">
        <Row className="justify-content-center w-100">
          <Col md={8} lg={6}>
            <form onSubmit={handleSubmit}>
              <div className="p-4 p-md-5 border rounded-4 bg-white shadow-sm">
                <img 
                  src={homeicon}
                  style={{ height: "170px" }} 
                  className="mx-auto d-block img-fluid object-fit-cover" 
                  alt="Logo" 
                />
                
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-3">Welcome Back</h2>
                  <p className="text-muted">Sign in to access your account</p>
                </div>

                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    style={{ outline: 'none', boxShadow: 'none', borderColor: "black" }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    style={{ outline: 'none', boxShadow: 'none', borderColor: "black" }}
                  />
                </div>

                <div className="mb-3 d-flex justify-content-between align-items-center">
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
                    <label className="form-check-label">Remember me</label>
                  </div>
                  <Button
                    variant="link"
                    className="p-0 text-decoration-none"
                    style={{ color: 'black' }}
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button
                  variant="dark"
                  type="submit"
                  className="w-100 py-2 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" ></span>
                      Signing in...
                    </>
                  ) : 'Sign in'}
                </Button>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Don't have an account?{' '}
                    <Button
                      variant="link"
                      className="p-0 align-baseline text-dark"
                      onClick={() => navigate('/signup')}
                    >
                      Sign up
                    </Button>
                  </p>
                </div>
              </div>
            </form>
          </Col>
        </Row>
      </Container>

      {showForgotPassword && (
        <ForgotPasswordPopup onClose={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
};

export default Login;