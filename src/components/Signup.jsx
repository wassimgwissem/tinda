import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import homeicon from '../icons/navicon.png';
import { register } from '../utils/api';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('individual');
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [fileToSend, setFileToSend] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setFileToSend(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageChange(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      await register({ name, email, password, userType, imageFile: fileToSend });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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

      <Container className="py-3 d-flex align-items-center justify-content-center min-vh-100">
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
                  <h2 className="fw-bold mb-3">Create Your Account</h2>
                  <p className="text-muted">Join SpaceMatch today</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                {/* Image Upload */}
                <div className="text-center mb-4">
                  <div 
                    className="mx-auto position-relative" 
                    style={{ width: '100px', height: '100px' }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <label 
                      htmlFor="profileUpload"
                      className={`d-block rounded-circle overflow-hidden ${isDragging ? 'drag-active' : 'bg-light'}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer',
                        border: `1px dashed ${isDragging ? '#000' : '#aaa'}`,
                      }}
                    >
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-100 h-100 object-fit-cover"
                        />
                      ) : (
                        <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                          <i className={`fa-solid ${isDragging ? 'fa-cloud-arrow-up' : 'fa-user'} fs-3 text-dark`}></i>
                          <small className="text-muted">{isDragging ? 'Drop image' : 'Add photo'}</small>
                        </div>
                      )}
                    </label>
                    <input 
                      type="file" 
                      id="profileUpload"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="d-none"
                      accept="image/*"
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    style={{ outline: 'none', boxShadow: 'none', borderColor: "black" }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                    style={{ outline: 'none', boxShadow: 'none', borderColor: "black" }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Account Type</label>
                  <div className="d-flex gap-3">
                    {['individual', 'business'].map((type) => (
                      <div key={type} className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id={type}
                          checked={userType === type}
                          onChange={() => setUserType(type)}
                          style={{
                            backgroundColor: userType === type ? 'black' : 'white',
                            outline: 'none',
                            boxShadow: 'none',
                            borderColor: "black"
                          }}
                        />
                        <label className="form-check-label" htmlFor={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
                    required
                    style={{ outline: 'none', boxShadow: 'none', borderColor: "black" }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    required
                    style={{ outline: 'none', boxShadow: 'none', borderColor: "black" }}
                  />
                </div>

                <Button 
                  variant="dark" 
                  type="submit"
                  className="w-100 py-2 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Creating account...
                    </>
                  ) : 'Create Account'}
                </Button>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <Button
                      variant="link"
                      className="p-0 align-baseline text-dark"
                      onClick={() => navigate('/login')}
                    >
                      Log in
                    </Button>
                  </p>
                </div>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signup;