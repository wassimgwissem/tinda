// Import necessary hooks from React
import { useState, useEffect } from 'react';

// Import UI components from React Bootstrap
import { Card, Button, Nav, Badge, Container, Row, Col, Form, Table, Image, Alert, Modal } from 'react-bootstrap';

// Import icons from Font Awesome
import { FaHouse, FaCalendarDays, FaMoneyBillWave, FaUser, FaPlus, FaPenToSquare, FaCamera, FaCheck, FaXmark, FaPen, FaGear, FaCircleInfo, FaRightFromBracket } from 'react-icons/fa6';

// Import local assets and API functions
import navicon from '../icons/navicon.png';
import { getUser, logout, updateUser, createWorkspace, getWorkspaces, toggleWorkspaceStatus, updateWorkspace } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const HostDashboard = () => {
  // Navigation hook for programmatic routing
  const navigate = useNavigate();
  
  // API base URL
  const API = 'http://localhost:5000';

  // STATE MANAGEMENT

  // Track which tab is currently active in the dashboard
  const [activeTab, setActiveTab] = useState('my-listings');
  
  // Loading state for API calls
  const [loading, setLoading] = useState(false);
  
  // Error state for displaying error messages
  const [error, setError] = useState(null);
  
  // USER PROFILE STATE
  
  // Store user data fetched from API
  const [userData, setUserData] = useState(null);
  
  // Toggle edit mode for profile
  const [editMode, setEditMode] = useState(false);
  
  // Store edited user data before saving
  const [editedUser, setEditedUser] = useState({});
  
  // Store profile image file when uploading
  const [profileImageFile, setProfileImageFile] = useState(null);
  
  // Control visibility of profile dropdown
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // WORKSPACES STATE
  
  // Store list of workspaces owned by the host
  const [hostWorkspaces, setHostWorkspaces] = useState([]);
  
  // Control visibility of "Add Workspace" modal
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Store new workspace image file when uploading
  const [workspaceImageFile, setWorkspaceImageFile] = useState(null);
  
  // Store data for a new workspace being created
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    location: '',
    capacity: '',
    amenities: [],
    price: '',
    description: ''
  });

  // WORKSPACE EDITING STATE
  
  // Toggle edit mode for workspaces
  const [editMode2, setEditMode2] = useState(false);
  
  // Store workspace data being edited
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  
  // Store edited workspace image file when uploading
  const [editWorkspaceImageFile, setEditWorkspaceImageFile] = useState(null);

  // EFFECT HOOKS

  // Fetch user data and workspaces when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Use Promise.all to fetch user and workspaces simultaneously
        const [user, workspaces] = await Promise.all([
          getUser(),
          getWorkspaces()
        ]);
        setUserData(user);
        setHostWorkspaces(workspaces);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs only once on mount

  // HELPER FUNCTIONS

  /**
   * Constructs a full URL for an image path
   * @param {string} imagePath - The image path from the database
   * @returns {string|null} Full URL or null if no path provided
   */
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // If imagePath is already a full URL (starts with http), return as-is
    // Otherwise, prepend the API base URL
    return imagePath.startsWith('http') ? imagePath : `${API}/${imagePath}`;
  };

  // WORKSPACE HANDLERS

  /**
   * Handles input changes for the new workspace form
   * @param {Object} e - The event object from the input field
   */
  const handleWorkspaceInputChange = (e) => {
    const { name, value } = e.target;
    // Update newWorkspace state while preserving other properties
    setNewWorkspace(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Toggles an amenity in the new workspace's amenities array
   * @param {string} amenity - The amenity to toggle
   */
  const handleAmenityChange = (amenity) => {
    setNewWorkspace(prev => ({
      ...prev,
      // If amenity already exists, remove it. Otherwise, add it.
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  /**
   * Handles workspace image upload for new workspaces
   * @param {Object} e - The event object from the file input
   */
  const handleWorkspaceImageChange = (e) => {
    if (e.target.files[0]) {
      setWorkspaceImageFile(e.target.files[0]);
    }
  };

  /**
   * Submits a new workspace to the API
   */
  const handleAddWorkspace = async () => {
    try {
      setLoading(true);
      // Prepare form data for API call
      const formData = {
        name: newWorkspace.name,
        location: newWorkspace.location,
        capacity: newWorkspace.capacity,
        amenities: newWorkspace.amenities,
        price: newWorkspace.price,
        description: newWorkspace.description,
        imageFile: workspaceImageFile
      };

      // Call API to create workspace
      const createdWorkspace = await createWorkspace(formData);
      
      // Add new workspace to state
      setHostWorkspaces(prev => [...prev, createdWorkspace]);
      
      // Close modal and reset form
      setShowAddModal(false);
      setNewWorkspace({
        name: '',
        location: '',
        capacity: '',
        amenities: [],
        price: '',
        description: ''
      });
      setWorkspaceImageFile(null);
    } catch (err) {
      setError(err.message || 'Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggles a workspace's active/inactive status
   * @param {string} id - The ID of the workspace to toggle
   */
  const handleToggleStatus = async (id) => {
    try {
      setLoading(true);
      // Call API to toggle status
      const updatedWorkspace = await toggleWorkspaceStatus(id);
      
      // Update the workspace in state
      setHostWorkspaces(prev => 
        prev.map(ws => ws._id === id ? updatedWorkspace : ws)
      );
    } catch (err) {
      setError('Failed to update workspace status');
      console.error('Error toggling status:', err);
    } finally {
      setLoading(false);
    }
  };

  // WORKSPACE EDITING FUNCTIONS

  /**
   * Prepares a workspace for editing by setting it in state
   * @param {Object} workspace - The workspace to edit
   */
  const handleEditWorkspaceClick = (workspace) => {
    // Create a copy of the workspace data for editing
    setEditingWorkspace({
      _id: workspace._id,
      name: workspace.name,
      location: workspace.location,
      capacity: workspace.capacity,
      amenities: [...workspace.amenities], // Create new array to avoid mutation
      price: workspace.price,
      description: workspace.description,
      image: workspace.image
    });
    setEditMode2(true); // Enter edit mode
  };

  /**
   * Handles input changes for the workspace edit form
   * @param {Object} e - The event object from the input field
   */
  const handleEditWorkspaceInputChange = (e) => {
    const { name, value } = e.target;
    // Update editingWorkspace state while preserving other properties
    setEditingWorkspace(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Handles image upload for workspace editing
   * @param {Object} e - The event object from the file input
   */
  const handleEditWorkspaceImageChange = (e) => {
    if (e.target.files[0]) {
      // Store the actual file for later upload
      setEditWorkspaceImageFile(e.target.files[0]);
      
      // Create a preview URL for immediate display
      setEditingWorkspace(prev => ({
        ...prev,
        image: URL.createObjectURL(e.target.files[0])
      }));
    }
  };

  /**
   * Saves the edited workspace to the API
   */
  const handleSaveWorkspace = async () => {
    try {
      setLoading(true);
      // Prepare form data for API call
      const formData = new FormData();
      formData.append('name', editingWorkspace.name);
      formData.append('location', editingWorkspace.location);
      formData.append('capacity', editingWorkspace.capacity);
      formData.append('price', editingWorkspace.price);
      formData.append('description', editingWorkspace.description);
      formData.append('amenities', JSON.stringify(editingWorkspace.amenities));
      
      // Only append image if a new one was selected
      if (editWorkspaceImageFile) {
        formData.append('image', editWorkspaceImageFile);
      }

      // Call API to update workspace
      const updatedWorkspace = await updateWorkspace(editingWorkspace._id, formData);
      
      // Update the workspace in state
      setHostWorkspaces(prev => 
        prev.map(ws => ws._id === editingWorkspace._id ? updatedWorkspace : ws)
      );
      
      // Exit edit mode and reset related state
      setEditMode2(false);
      setEditingWorkspace(null);
      setEditWorkspaceImageFile(null);
      setError(null);
    } catch (err) {
      setError('Failed to update workspace. Please try again.');
      console.error('Error updating workspace:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancels workspace editing and resets related state
   */
  const handleCancelWorkspaceEdit = () => {
    setEditMode2(false);
    setEditingWorkspace(null);
    setEditWorkspaceImageFile(null);
  };

  // PROFILE HANDLERS

  /**
   * Enters profile edit mode and initializes the editedUser state
   */
  const handleEditClick = () => {
    // Copy current user data to editedUser state
    setEditedUser({ 
      name: userData?.name || '',
      email: userData?.email || '',
      image: userData?.image || ''
    });
    setEditMode(true); // Enter edit mode
  };

  /**
   * Handles input changes for the profile edit form
   * @param {Object} e - The event object from the input field
   */
  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    // Update editedUser state while preserving other properties
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Handles profile image upload
   * @param {Object} e - The event object from the file input
   */
  const handleProfileImageChange = (e) => {
    if (e.target.files[0]) {
      // Store the actual file for later upload
      setProfileImageFile(e.target.files[0]);
      
      // Create a preview URL for immediate display
      setEditedUser(prev => ({
        ...prev,
        image: URL.createObjectURL(e.target.files[0])
      }));
    }
  };

  /**
   * Saves the edited profile to the API
   */
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      // Prepare form data for API call
      const formData = new FormData();
      formData.append('name', editedUser.name);
      formData.append('email', editedUser.email);
      
      // Only append image if a new one was selected
      if (profileImageFile) {
        formData.append('image', profileImageFile);
      }

      // Call API to update user
      const updatedUser = await updateUser(userData._id, formData);
      
      // Update user data in state
      setUserData(updatedUser);
      
      // Exit edit mode and reset related state
      setEditMode(false);
      setProfileImageFile(null);
      setError(null);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancels profile editing and resets related state
   */
  const handleCancelEdit = () => {
    setEditMode(false);
    setProfileImageFile(null);
  };

  /**
   * Handles user logout
   */
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to login page after logout
      navigate('/login', { replace: true });
    } catch (err) {
      setError('Failed to logout. Please try again.');
      console.error('Error logging out:', err);
    }
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }


  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <div className="d-flex flex-column bg-dark text-white sticky-top" style={{width: '110px', height: '100vh'}}>
        <div className="d-flex align-items-center justify-content-center p-3">
          <img src={navicon} width={60} style={{ filter: 'invert(1)' }} alt="Logo" />
        </div>
        
        <Nav className="flex-column flex-grow-1 py-4 align-items-center gap-4">
          <Nav.Link 
            onClick={() => setActiveTab('my-listings')} 
            className={`d-flex flex-column align-items-center p-0 ${activeTab === 'my-listings' ? 'text-white' : 'text-secondary'}`}
          >
            <FaHouse className="fs-4 mb-1" />
            <span className="fs-xs">LISTINGS</span>
          </Nav.Link>
          <Nav.Link 
            onClick={() => setActiveTab('bookings')} 
            className={`d-flex flex-column align-items-center p-0 ${activeTab === 'bookings' ? 'text-white' : 'text-secondary'}`}
          >
            <FaCalendarDays className="fs-4 mb-1" />
            <span className="fs-xs">BOOKINGS</span>
          </Nav.Link>
          <Nav.Link 
            onClick={() => setActiveTab('earnings')} 
            className={`d-flex flex-column align-items-center p-0 ${activeTab === 'earnings' ? 'text-white' : 'text-secondary'}`}
          >
            <FaMoneyBillWave className="fs-4 mb-1" />
            <span className="fs-xs">EARNINGS</span>
          </Nav.Link>
          <Nav.Link 
            onClick={() => setActiveTab('profile')} 
            className={`d-flex flex-column align-items-center p-0 ${activeTab === 'profile' ? 'text-white' : 'text-secondary'}`}
          >
            <FaUser className="fs-4 mb-1" />
            <span className="fs-xs">PROFILE</span>
          </Nav.Link>
        </Nav>

        {/* Profile dropdown */}
        <div className="mt-auto p-3 border-top border-secondary">
          <div 
            className="position-relative"
            onMouseEnter={() => setShowProfileDropdown(true)}
            onMouseLeave={() => setShowProfileDropdown(false)}
          >
            <button 
              className="bg-transparent border-0 p-0 d-flex align-items-center justify-content-center w-100"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              {userData?.image ? (
                <img 
                  src={getImageUrl(userData.image)}
                  className="rounded-circle border border-white"
                  width={55}
                  height={55}
                  alt="Profile"
                  style={{ minWidth: 40 }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-profile.jpg';
                  }}
                />
              ) : (
                <div className="bg-white text-dark rounded-circle d-flex align-items-center justify-content-center" 
                    style={{width: '40px', height: '40px', minWidth: 40}}>
                  <FaUser />
                </div>
              )}
            </button>

            {showProfileDropdown && (
              <div 
                className="position-absolute start-100 bottom-0 mb-2 ms-1 bg-dark text-white p-2 shadow"
                style={{
                  width: '300px',
                  zIndex: 10000,
                  border: '1px solid #444'
                }}
              >
                <div className="d-flex align-items-center gap-2 p-2 border-bottom border-secondary">
                  {userData?.image ? (
                    <img 
                      src={getImageUrl(userData.image)}
                      className="rounded-circle border border-white"
                      width={55}
                      height={55}
                      alt="Profile"
                    />
                  ) : (
                    <div className="bg-white text-dark rounded-circle d-flex align-items-center justify-content-center" 
                        style={{width: '40px', height: '40px'}}>
                      <FaUser />
                    </div>
                  )}
                  <div>
                    <div className="text-white normal fw-bold">{userData?.name || 'User'}</div>
                    <div className="text-white xsmall">{userData?.email || ''}</div>
                  </div>
                </div>
                <button 
                  className="w-100 bg-transparent border-0 text-start text-white p-2 d-flex align-items-center gap-2 hover-bg-gray"
                  onClick={() => {
                    setActiveTab('profile');
                    setShowProfileDropdown(false);
                  }}
                >
                  <FaUser /> Profile
                </button>
                <button 
                  className="w-100 bg-transparent border-0 text-start text-white p-2 d-flex align-items-center gap-2 hover-bg-gray"
                  onClick={handleLogout}
                >
                  <FaRightFromBracket /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="d-flex flex-column flex-grow-1">
        {/* Header */}
        <div className="p-4 bg-white border-bottom d-flex justify-content-between align-items-center shadow-sm">
          <h4 className="m-0 fw-bold text-dark">
            {activeTab === 'my-listings' && 'My Workspace Listings'}
            {activeTab === 'bookings' && 'Bookings Management'}
            {activeTab === 'earnings' && 'Earnings Overview'}
            {activeTab === 'profile' && 'Host Profile'}
          </h4>
          
          {activeTab === 'my-listings' && (
            <Button 
              variant="dark" 
              onClick={() => setShowAddModal(true)}
              className="rounded-0"
              disabled={loading}
            >
              <FaPlus className="me-2" />
              Add New Space
            </Button>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="m-3" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        {/* Content Area */}
        <div className="flex-grow-1 p-4 overflow-auto">
          {/* My Listings Tab */}
          {activeTab === 'my-listings' && (
            <Container fluid>
              <Row className="g-4">
                {hostWorkspaces.length > 0 ? (
                  hostWorkspaces.map(workspace => (
                    <Col key={workspace._id} md={6} lg={4}>
                      <Card className="h-100 border-0 rounded-0 shadow-sm">
                        {workspace.image && (
                          <div style={{ height: '200px', overflow: 'hidden' }}>
                            <Image
                              src={getImageUrl(workspace.image)}
                              alt={workspace.name}
                              className="w-100 h-100 object-fit-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/default-workspace.jpg';
                              }}
                            />
                          </div>
                        )}
                        <Card.Body className="p-4">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <Card.Title className="fw-bold m-0 text-dark">{workspace.name}</Card.Title>
                            <Badge pill bg={workspace.status === "active" ? "dark" : "secondary"} className="rounded-0">
                              {workspace.status.toUpperCase()}
                            </Badge>
                          </div>
                          <Card.Subtitle className="text-muted fw-medium mb-3">
                            {workspace.location}
                          </Card.Subtitle>
                          <div className="d-flex flex-wrap gap-2 mb-3">
                            <Badge pill bg="light" text="dark" className="fw-medium border rounded-0">
                              {workspace.capacity}
                            </Badge>
                            {workspace.amenities.map((item, i) => (
                              <Badge key={i} pill bg="light" text="dark" className="fw-medium border rounded-0">
                                {item}
                              </Badge>
                            ))}
                          </div>
                          <div className="mb-3">
                            <span className="fw-bold fs-5 text-dark">${workspace.price}/day</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <Button 
                              variant={workspace.status === "active" ? "outline-dark" : "outline-secondary"}
                              onClick={() => handleToggleStatus(workspace._id)}
                              className="rounded-0"
                              disabled={loading}
                            >
                              {workspace.status === "active" ? "Deactivate" : "Activate"}
                            </Button>
                            <Button 
                              variant="outline-dark" 
                              onClick={() => handleEditWorkspaceClick(workspace)}
                              className="rounded-0"
                            >
                              <FaPenToSquare className="me-1" />
                              Edit
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col className="text-center py-5">
                    <h5 className="fw-medium text-muted">You haven't listed any workspaces yet</h5>
                    <Button 
                      variant="dark" 
                      onClick={() => setShowAddModal(true)}
                      className="mt-3 rounded-0"
                      disabled={loading}
                    >
                      <FaPlus className="me-2" />
                      Add Your First Space
                    </Button>
                  </Col>
                )}
              </Row>
            </Container>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-0 p-4 shadow-sm">
              <h5 className="mb-4 text-dark">Upcoming Bookings</h5>
              <Table striped bordered hover className="rounded-0">
                <thead className="bg-dark text-white">
                  <tr>
                    <th>Workspace</th>
                    <th>Date</th>
                    <th>Guest</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hostWorkspaces.flatMap(ws => 
                    ws.bookings?.map(booking => (
                      <tr key={booking._id}>
                        <td className="text-dark">{ws.name}</td>
                        <td className="text-dark">{new Date(booking.date).toLocaleDateString()}</td>
                        <td className="text-dark">{booking.guest?.name || 'Unknown'}</td>
                        <td>
                          <Button variant="outline-dark" size="sm" className="rounded-0">
                            <FaCircleInfo className="me-1" />
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                  {hostWorkspaces.every(ws => !ws.bookings || ws.bookings.length === 0) && (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        No upcoming bookings
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div className="bg-white rounded-0 p-4 shadow-sm">
              <h5 className="mb-4 text-dark">Earnings Overview</h5>
              <Row className="g-4 mb-4">
                <Col md={4}>
                  <Card className="border-0 shadow-sm rounded-0">
                    <Card.Body>
                      <h6 className="text-muted">Total Earnings</h6>
                      <h3 className="fw-bold text-dark">
                        ${hostWorkspaces.reduce((sum, ws) => sum + (ws.bookings?.length || 0) * (ws.price || 0), 0)}
                      </h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border-0 shadow-sm rounded-0">
                    <Card.Body>
                      <h6 className="text-muted">Upcoming Payout</h6>
                      <h3 className="fw-bold text-dark">
                        ${hostWorkspaces.reduce((sum, ws) => {
                          const upcoming = ws.bookings?.filter(b => new Date(b.date) > new Date()) || [];
                          return sum + upcoming.length * (ws.price || 0);
                        }, 0)}
                      </h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border-0 shadow-sm rounded-0">
                    <Card.Body>
                      <h6 className="text-muted">Bookings This Month</h6>
                      <h3 className="fw-bold text-dark">
                        {hostWorkspaces.reduce((sum, ws) => {
                          const thisMonth = ws.bookings?.filter(b => {
                            const bookingDate = new Date(b.date);
                            const now = new Date();
                            return bookingDate.getMonth() === now.getMonth() && 
                                   bookingDate.getFullYear() === now.getFullYear();
                          }) || [];
                          return sum + thisMonth.length;
                        }, 0)}
                      </h3>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <h6 className="mb-3 text-dark">Recent Transactions</h6>
              <Table striped bordered hover className="rounded-0">
                <thead className="bg-dark text-white">
                  <tr>
                    <th>Date</th>
                    <th>Workspace</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {hostWorkspaces.flatMap(ws => 
                    ws.bookings?.map(booking => (
                      <tr key={booking._id}>
                        <td className="text-dark">{new Date(booking.date).toLocaleDateString()}</td>
                        <td className="text-dark">{ws.name}</td>
                        <td className="text-dark">${ws.price}</td>
                        <td className="text-dark">Paid</td>
                      </tr>
                    ))
                  ).slice(0, 5)}
                  {hostWorkspaces.every(ws => !ws.bookings || ws.bookings.length === 0) && (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        No recent transactions
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && userData && (
            <div className="flex-grow-1 p-4 bg-white">
              <h5 className="fw-bold mb-4">Host Profile</h5>
              <div className="bg-light p-4 rounded-0">
                <div className="d-flex align-items-center mb-4">
                  {editMode ? (
                    <>
                      <div className="position-relative">
                        <img 
                          src={editedUser.image?.startsWith('blob:') ? editedUser.image : 
                              (editedUser.image ? getImageUrl(editedUser.image) : '/default-profile.jpg')}
                          className="rounded-circle border border-dark"
                          width={80}
                          height={80}
                          alt="Profile"
                        />
                        <label className="position-absolute bottom-0 end-0 bg-dark text-white rounded-circle p-2 cursor-pointer">
                          <FaCamera />
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            className="d-none"
                          />
                        </label>
                      </div>
                      <div className="ms-4">
                        <Form.Control
                          type="text"
                          name="name"
                          value={editedUser.name || ''}
                          onChange={handleProfileInputChange}
                          className="mb-2"
                          placeholder="Name"
                        />
                        <Form.Control
                          type="email"
                          name="email"
                          value={editedUser.email || ''}
                          onChange={handleProfileInputChange}
                          placeholder="Email"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {userData.image ? (
                        <img 
                          src={getImageUrl(userData.image)}
                          className="rounded-circle border border-dark"
                          width={80}
                          height={80}
                          alt="Profile"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-profile.jpg';
                          }}
                        />
                      ) : (
                        <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" 
                            style={{width: '80px', height: '80px'}}>
                          <FaUser className="fs-3" />
                        </div>
                      )}
                      <div className="ms-4">
                        <h4 className="fw-bold mb-1 text-dark">{userData.name || 'Host Name'}</h4>
                        <p className="text-muted mb-0">{userData.email || 'host@example.com'}</p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Member Since</label>
                      <p className="text-dark">
                        {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">User Type</label>
                      <p className="text-dark text-capitalize">
                        {userData.userType === 'business' ? 'Business' : 
                        userData.userType === 'individual' ? 'Individual' : 
                        'Host'}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Total Listings</label>
                      <p className="text-dark">{hostWorkspaces.length}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Account Status</label>
                      <p className="text-dark text-capitalize">
                        {userData.verified ? 'Verified' : 'Not Verified'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {editMode ? (
                  <div className="d-flex gap-2">
                    <Button 
                      variant="success" 
                      onClick={handleSaveProfile} 
                      className="rounded-0"
                      disabled={loading}
                    >
                      <FaCheck className="me-2" />
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      onClick={handleCancelEdit} 
                      className="rounded-0"
                      disabled={loading}
                    >
                      <FaXmark className="me-2" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="d-flex gap-2">
                    <Button 
                      variant="dark" 
                      onClick={handleEditClick} 
                      className="rounded-0 me-2"
                      disabled={loading}
                    >
                      <FaPen className="me-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline-dark" className="rounded-0" disabled={loading}>
                      <FaGear className="me-2" />
                      Settings
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Workspace Modal */}
      <Modal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Add New Workspace</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-dark">Workspace Name *</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name"
                    value={newWorkspace.name}
                    onChange={handleWorkspaceInputChange}
                    className="rounded-0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-dark">Location *</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="location"
                    value={newWorkspace.location}
                    onChange={handleWorkspaceInputChange}
                    className="rounded-0"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-dark">Capacity *</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="capacity"
                    value={newWorkspace.capacity}
                    onChange={handleWorkspaceInputChange}
                    placeholder="e.g. 4 Persons"
                    className="rounded-0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-dark">Price (per day) *</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="price"
                    value={newWorkspace.price}
                    onChange={handleWorkspaceInputChange}
                    placeholder="e.g. 35"
                    className="rounded-0"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Amenities</Form.Label>
              <div className="d-flex flex-wrap gap-3">
                {["WiFi", "Coffee", "Projector", "Whiteboards", "Parking", "Printing"].map(item => (
                  <Form.Check
                    key={item}
                    type="checkbox"
                    id={`amenity-${item}`}
                    label={item}
                    checked={newWorkspace.amenities.includes(item)}
                    onChange={() => handleAmenityChange(item)}
                    className="text-dark"
                  />
                ))}
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                name="description"
                value={newWorkspace.description}
                onChange={handleWorkspaceInputChange}
                className="rounded-0"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Workspace Image</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/*"
                onChange={handleWorkspaceImageChange}
                className="rounded-0"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="outline-light" onClick={() => setShowAddModal(false)} className="rounded-0">
            Cancel
          </Button>
          <Button 
            variant="light" 
            onClick={handleAddWorkspace} 
            className="rounded-0"
            disabled={loading || !newWorkspace.name || !newWorkspace.location || !newWorkspace.price}
          >
            {loading ? 'Adding...' : 'Add Workspace'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Workspace Modal */}
      <Modal 
        show={editMode2} 
        onHide={handleCancelWorkspaceEdit}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Edit Workspace</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          {editingWorkspace && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-dark">Workspace Name *</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="name"
                      value={editingWorkspace.name}
                      onChange={handleEditWorkspaceInputChange}
                      className="rounded-0"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-dark">Location *</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="location"
                      value={editingWorkspace.location}
                      onChange={handleEditWorkspaceInputChange}
                      className="rounded-0"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-dark">Capacity *</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="capacity"
                      value={editingWorkspace.capacity}
                      onChange={handleEditWorkspaceInputChange}
                      className="rounded-0"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-dark">Price (per day) *</Form.Label>
                    <Form.Control 
                      type="number" 
                      name="price"
                      value={editingWorkspace.price}
                      onChange={handleEditWorkspaceInputChange}
                      className="rounded-0"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label className="text-dark">Amenities</Form.Label>
                <div className="d-flex flex-wrap gap-3">
                  {["WiFi", "Coffee", "Projector", "Whiteboards", "Parking", "Printing"].map(item => (
                    <Form.Check
                      key={item}
                      type="checkbox"
                      id={`edit-amenity-${item}`}
                      label={item}
                      checked={editingWorkspace.amenities.includes(item)}
                      onChange={() => {
                        setEditingWorkspace(prev => ({
                          ...prev,
                          amenities: prev.amenities.includes(item)
                            ? prev.amenities.filter(a => a !== item)
                            : [...prev.amenities, item]
                        }));
                      }}
                      className="text-dark"
                    />
                  ))}
                </div>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="text-dark">Description</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  name="description"
                  value={editingWorkspace.description}
                  onChange={handleEditWorkspaceInputChange}
                  className="rounded-0"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="text-dark">Workspace Image</Form.Label>
                <div className="d-flex align-items-center gap-3 mb-3">
                  {editingWorkspace.image && (
                    <Image 
                      src={getImageUrl(editingWorkspace.image)} 
                      width={100} 
                      height={100} 
                      thumbnail 
                      className="rounded-0"
                    />
                  )}
                  <Form.Control 
                    type="file" 
                    accept="image/*"
                    onChange={handleEditWorkspaceImageChange}
                            className="rounded-0"
                  />
                </div>
                <small className="text-muted">Leave empty to keep current image</small>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button 
            variant="outline-light" 
            onClick={handleCancelWorkspaceEdit} 
            className="rounded-0"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="light" 
            onClick={handleSaveWorkspace} 
            className="rounded-0"
            disabled={loading || !editingWorkspace?.name || !editingWorkspace?.location || !editingWorkspace?.price}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HostDashboard;