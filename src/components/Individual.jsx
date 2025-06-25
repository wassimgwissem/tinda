// Import necessary React hooks and components
import { useState, useEffect } from 'react'; // Basic React hooks
import { Card, Button, Nav, Badge, Container, Row, Col, Form } from 'react-bootstrap'; // UI components
import navicon from '../icons/navicon.png'; // Navigation icon
import { getUser, logout, getWorkspaces, getAllWorkspaces, updateUser } from '../utils/api'; // API functions
import { useNavigate } from 'react-router-dom'; // For navigation between pages

// Main Individual component
const Individual = () => {
  // State management for various features:

  // Track which tab is currently active (discover, my-spaces, or profile)
  const [activeTab, setActiveTab] = useState('discover');
  
  // Filter states for workspaces:
  const [location, setLocation] = useState(''); // Selected location filter
  const [capacity, setCapacity] = useState(''); // Selected capacity filter
  const [amenities, setAmenities] = useState([]); // Selected amenities (array)
  const [priceRange, setPriceRange] = useState([0, 100]); // Price range filter
  
  // User data and workspace states:
  const [savedWorkspaces, setSavedWorkspaces] = useState([]); // IDs of saved workspaces
  const [userData, setUserData] = useState(null); // Current user's data
  const [workspaces, setWorkspaces] = useState([]); // All workspaces data
  const [loading, setLoading] = useState(false); // Loading state for API calls
  
  // Profile editing states:
  const [editMode, setEditMode] = useState(false); // Whether profile is in edit mode
  const [editedUser, setEditedUser] = useState({}); // Temporary edited user data
  const [imageFile, setImageFile] = useState(null); // New profile image file
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // Profile dropdown visibility
  
  // API base URL and navigation hook:
  const API = "http://localhost:5000"; // Backend API base URL
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Fetch user and workspaces data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading state to true
        // Fetch both user data and workspaces data in parallel
        const [user, workspacesData] = await Promise.all([
          getUser(), // Get current user's data
          getAllWorkspaces() // Get all available workspaces
        ]);
        setUserData(user); // Store user data in state
        setWorkspaces(workspacesData); // Store workspaces in state
      } catch (error) {
        console.error('Failed to fetch data:', error); // Log errors
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };
    
    fetchData(); // Call the fetch function
  }, []); // Empty dependency array means this runs once on mount

  // Get all unique locations from workspaces for filter dropdown
  const allLocations = [...new Set(workspaces.map(ws => ws.location))];
  
  // Static list of possible amenities
  const allAmenities = ["WiFi", "Coffee", "Projector", "Whiteboards", "Parking", "Printing"];

  // Filter workspaces based on selected filters
const filteredWorkspaces = workspaces.filter(ws => {
  // First check the status - if not active, exclude immediately
  if (ws.status !== 'active') return false;

  // Location filter (case-insensitive match)
  const locationMatch = !location || 
    ws.location.toLowerCase().includes(location.toLowerCase());

  let capacityMatch = true;
if (capacity) {
  if (capacity === '1-4') {
    capacityMatch = ws.capacity.includes('1') || ws.capacity.includes('4') || ws.capacity === '1-4';
  } else if (capacity === '5-10') {
    capacityMatch = ws.capacity.includes('5') || ws.capacity.includes('10') || ws.capacity === '5-10';
  } else if (capacity === '10+') {
    capacityMatch = ws.capacity.includes('10') || ws.capacity.startsWith('10');
  }
}


  // Price range filter
  const priceMatch = ws.price >= priceRange[0] && ws.price <= priceRange[1];

  // Amenities filter (must include all selected amenities)
  const amenitiesMatch = amenities.length === 0 || 
    amenities.every(a => ws.amenities.includes(a));

  // Combine all conditions
  return locationMatch && capacityMatch && priceMatch && amenitiesMatch;
});

  // Toggle workspace save status
  const toggleSaved = (id) => {
    setSavedWorkspaces(prev =>
      // If already saved, remove it from saved list
      prev.includes(id) 
        ? prev.filter(workspaceId => workspaceId !== id) 
        // If not saved, add it to saved list
        : [...prev, id]
    );
  };

  // Toggle an amenity in the filter
  const toggleAmenity = (amenity) => {
    setAmenities(prev =>
      // If already selected, remove it
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        // If not selected, add it
        : [...prev, amenity]
    );
  };

  // Reset all filters to default values
  const clearFilters = () => {
    setLocation('');
    setCapacity('');
    setAmenities([]);
    setPriceRange([0, 100]);
  };

  // Handle user logout
  const handleLogout = () => {
    logout(); // Call API logout function
    navigate('/login', { replace: true }); // Redirect to login page
  };

  // Profile edit functions:

  // Enter edit mode and copy current user data to editedUser
  const handleEditClick = () => {
    setEditedUser({ ...userData }); // Copy user data to edit buffer
    setEditMode(true); // Enable edit mode
  };

  // Handle input changes in edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Get field name and value
    setEditedUser(prev => ({ ...prev, [name]: value })); // Update edited user data
  };

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get selected file
    if (file) {
      setImageFile(file); // Store file object
      // Create preview URL and update edited user
      setEditedUser(prev => ({
        ...prev,
        image: URL.createObjectURL(file) // Create blob URL for preview
      }));
    }
  };

  // Save edited profile
  const handleSave = async () => {
    try {
      const formData = new FormData(); // Create form data for file upload
      
      // Append all edited fields to form data
      Object.entries(editedUser).forEach(([key, value]) => {
        if (value && key !== 'image') formData.append(key, value);
      });
      
      // Append image file if selected
      if (imageFile) formData.append('image', imageFile);

      // Call API to update user
      const updatedUser = await updateUser(userData._id, formData, !!imageFile);
      
      // Update state with new user data
      setUserData(updatedUser);
      setEditMode(false); // Exit edit mode
      setImageFile(null); // Clear image file state
    } catch (error) {
      console.error('Failed to update profile:', error); // Log errors
    }
  };

  // Cancel editing and discard changes
  const handleCancel = () => {
    setEditMode(false); // Exit edit mode
    setImageFile(null); // Clear any selected image
  };
  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Left-side Navbar */}
      <div className="d-flex flex-column bg-dark text-white position-sticky top-0" style={{width: '100px', minWidth:100,height: '100vh'}}>
        <div className="p-3 text-center border-bottom border-secondary">
          <img src={navicon} width={60} style={{ filter: 'invert(1)' }} alt="Logo" />
        </div>
        
        <Nav className="flex-column flex-grow-1 py-4 align-items-center gap-4">
          <Nav.Link onClick={() => setActiveTab('discover')} className={`d-flex flex-column align-items-center p-0 ${activeTab === 'discover' ? 'text-white' : 'text-secondary'}`}>
            <i className="fa-solid fa-magnifying-glass fs-4 mb-1"></i>
            <span className="fs-xs">DISCOVER</span>
          </Nav.Link>
          <Nav.Link onClick={() => setActiveTab('my-spaces')} className={`d-flex flex-column align-items-center p-0 ${activeTab === 'my-spaces' ? 'text-white' : 'text-secondary'}`}>
            <i className="fa-solid fa-briefcase fs-4 mb-1"></i>
            <span className="fs-xs">MY SPACES</span>
          </Nav.Link>
          <Nav.Link onClick={() => setActiveTab('profile')} className={`d-flex flex-column align-items-center p-0 ${activeTab === 'profile' ? 'text-white' : 'text-secondary'}`}>
            <i className="fa-solid fa-user fs-4 mb-1"></i>
            <span className="fs-xs">PROFILE</span>
          </Nav.Link>
        </Nav>
        
        {/* Profile dropdown */}
        <div className="mt-auto p-3 border-top border-secondary">
          <div className="position-relative"
            onMouseEnter={() => setShowProfileDropdown(true)}
            onMouseLeave={() => setShowProfileDropdown(false)}>
            <button className="bg-transparent border-0 p-0 d-flex align-items-center justify-content-center w-100"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
              {userData?.image ? (
                <img 
                  src={userData.image.startsWith('http') ? userData.image : `${API}/${userData.image}`}
                  className="rounded-circle border border-white"
                  width={55}
                  height={55}
                  alt="Profile"
                  style={{ minWidth: 40 }}
                />
              ) : (
                <div className="bg-white text-dark rounded-circle d-flex align-items-center justify-content-center" 
                    style={{width: '40px', height: '40px', minWidth: 40}}>
                  <i className="fa-solid fa-user"></i>
                </div>
              )}
            </button>

            {showProfileDropdown && (
              <div className="position-absolute start-100 bottom-0 mb-2 ms-1 bg-dark text-white p-2 shadow"
                style={{ width: '300px', zIndex: 10000, border: '1px solid #444' }}>
                <div className="d-flex align-items-center gap-2 p-2 border-bottom border-secondary">
                  {userData?.image ? (
                    <img 
                      src={userData.image.startsWith('http') ? userData.image : `${API}/${userData.image}`}
                      className="rounded-circle border border-white"
                      width={55}
                      height={55}
                      alt="Profile"
                    />
                  ) : (
                    <div className="bg-white text-dark rounded-circle d-flex align-items-center justify-content-center" 
                        style={{width: '40px', height: '40px'}}>
                      <i className="fa-solid fa-user"></i>
                    </div>
                  )}
                  <div>
                    <div className="text-white normal fw-bold">{userData?.name || 'User'}</div>
                    <div className="text-white xsmall">{userData?.email || ''}</div>
                  </div>
                </div>
                <button className="w-100 bg-transparent border-0 text-start text-white p-2 d-flex align-items-center gap-2 hover-bg-gray"
                  onClick={() => { setActiveTab('profile'); setShowProfileDropdown(false); }}>
                  <i className="fa-solid fa-user"></i> Profile
                </button>
                <button className="w-100 bg-transparent border-0 text-start text-white p-2 d-flex align-items-center gap-2 hover-bg-gray"
                  onClick={handleLogout}>
                  <i className="fa-solid fa-right-from-bracket"></i> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="d-flex flex-column flex-grow-1">
        {/* Header */}
        <div className="p-4 bg-white border-bottom">
          <h4 className="m-0 fw-bold text-uppercase">
            {activeTab === 'discover' && 'Find Your Perfect Workspace'}
            {activeTab === 'my-spaces' && 'My Saved Workspaces'}
            {activeTab === 'profile' && 'My Profile'}
          </h4>
        </div>

        {/* Content Area */}
        {activeTab === 'discover' && (
          <div className="d-flex flex-grow-1">
            {/* Filters Sidebar - Hidden on small screens */}
            <div className="bg-white min-vw-10 p-4 border-end d-none d-md-block" style={{width: '300px'}}>
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <i className="fa-solid fa-filter"></i> FILTERS
              </h5>

              <div className="mb-4">
                <label className="fw-bold d-flex align-items-center gap-2 mb-2">
                  <i className="fa-solid fa-location-dot"></i> Location
                </label>
                <select className="form-select rounded-0" value={location} onChange={(e) => setLocation(e.target.value)}>
                  <option value="">All Locations</option>
                  {allLocations.map((loc, index) => (
                    <option key={index} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="fw-bold d-flex align-items-center gap-2 mb-2">
                  <i className="fa-solid fa-users"></i> Capacity
                </label>
               <select 
                className="form-select rounded-0" 
                value={capacity} 
                onChange={(e) => setCapacity(e.target.value)}
              >
                <option value="">Any Capacity</option>
                <option value="1-4">1-4 Persons</option>
                <option value="5-10">5-10 Persons</option>
                <option value="10+">10+ Persons</option>
              </select>
              </div>

              <div className="mb-4">
                <label className="fw-bold">Price Range (${priceRange[0]} - ${priceRange[1]})</label>
                <div className="px-2">
                  <input type="range" className="form-range" min="0" max="100" value={priceRange[1]} 
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} />
                </div>
                <div className="d-flex justify-content-between">
                  <span>$0</span>
                  <span>$100+</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Amenities</label>
                <div className="d-flex flex-column gap-2">
                  {allAmenities.map((amenity, index) => (
                    <div key={index} className="form-check">
                      <input type="checkbox" className="form-check-input rounded-0" id={`amenity-${index}`}
                        checked={amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} />
                      <label className="form-check-label" htmlFor={`amenity-${index}`}>{amenity}</label>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="outline-dark" onClick={clearFilters} className="w-100 rounded-0">
                Clear All Filters
              </Button>
            </div>

            {/* Workspaces Grid */}
            <div className="flex-grow-1 p-4 overflow-auto">
              <Container fluid>
                {/* Mobile filters toggle */}
                <div className="d-block d-md-none mb-4">
                  <Button 
                    variant="outline-dark" 
                    className="w-100 rounded-0 mb-3"
                    onClick={() => document.getElementById('mobileFilters').classList.toggle('d-none')}
                  >
                    <i className="fa-solid fa-filter me-2"></i> Show Filters
                  </Button>
                  
                  <div id="mobileFilters" className="bg-white p-3 mb-4 d-none">
                    <div className="mb-3">
                      <label className="fw-bold d-flex align-items-center gap-2 mb-2">
                        <i className="fa-solid fa-location-dot"></i> Location
                      </label>
                      <select className="form-select rounded-0" value={location} onChange={(e) => setLocation(e.target.value)}>
                        <option value="">All Locations</option>
                        {allLocations.map((loc, index) => (
                          <option key={index} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="fw-bold d-flex align-items-center gap-2 mb-2">
                        <i className="fa-solid fa-users"></i> Capacity
                      </label>
                      <select className="form-select rounded-0" value={capacity} onChange={(e) => setCapacity(e.target.value)}>
                        <option value="">Any Capacity</option>
                        <option value="1-4">1-4 Persons</option>
                        <option value="5-10">5-10 Persons</option>
                        <option value="10+">10+ Persons</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="fw-bold">Price Range (${priceRange[0]} - ${priceRange[1]})</label>
                      <div className="px-2">
                        <input type="range" className="form-range" min="0" max="100" value={priceRange[1]} 
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} />
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>$0</span>
                        <span>$100+</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold">Amenities</label>
                      <div className="d-flex flex-wrap gap-2">
                        {allAmenities.map((amenity, index) => (
                          <div key={index} className="form-check">
                            <input type="checkbox" className="form-check-input rounded-0" id={`mobile-amenity-${index}`}
                              checked={amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} />
                            <label className="form-check-label" htmlFor={`mobile-amenity-${index}`}>{amenity}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button variant="outline-dark" onClick={clearFilters} className="w-100 rounded-0">
                      Clear All Filters
                    </Button>
                  </div>
                </div>

                <Row className="g-4">
                  {loading ? (
                    <Col className="text-center py-5">
                      <div className="spinner-border text-dark" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </Col>
                  ) : filteredWorkspaces.length > 0 ? (
                    filteredWorkspaces.map(workspace => (
                      <Col key={workspace._id} xs={12} sm={6} md={6} lg={4} xl={3}>
                        <Card className="h-100 border-0 rounded-0 shadow-sm">
                          <img 
                        src={workspace.image ? 
                          (workspace.image.startsWith('http') ? workspace.image : `${API}/${workspace.image}`) : 
                          'https://via.placeholder.com/300x200'}
                        className="card-img-top rounded-0"
                        style={{ height: '200px', objectFit: 'cover' }}
                        alt={workspace.name}
                      />
                          <button onClick={() => toggleSaved(workspace._id)}
                            className="position-absolute top-3 end-3 bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                            style={{ width: '36px', height: '36px', border: 'none' }}>
                            {savedWorkspaces.includes(workspace._id) ? (
                              <i className="fa-solid fa-heart text-danger"></i>
                            ) : (
                              <i className="fa-regular fa-heart"></i>
                            )}
                          </button>
                          <Card.Body className="p-3">
                            <Card.Title className="fw-bold mb-2 text-dark text-truncate">{workspace.name}</Card.Title>
                            <Card.Subtitle className="text-muted fw-medium mb-2 text-truncate">{workspace.location}</Card.Subtitle>
                            <div className="d-flex flex-wrap gap-2 mb-3" style={{ minHeight: '40px' }}>
                              <Badge pill bg="light" text="dark" className="fw-medium border rounded-0">
                                {workspace.capacity}
                              </Badge>
                              {workspace.amenities.slice(0, 3).map((item, i) => (
                                <Badge key={i} pill bg="light" text="dark" className="fw-medium border rounded-0">
                                  {item}
                                </Badge>
                              ))}
                              {workspace.amenities.length > 3 && (
                                <Badge pill bg="light" text="dark" className="fw-medium border rounded-0">
                                  +{workspace.amenities.length - 3}
                                </Badge>
                              )}
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-bold fs-5 text-dark">${workspace.price}/day</span>
                              <Button variant="dark" className="rounded-0 px-2 py-1" style={{ whiteSpace: 'nowrap' }}>
                                Book Now
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                  ) : (
                    <Col className="text-center py-5">
                      <h5 className="fw-medium text-muted">No workspaces match your filters</h5>
                      <Button variant="outline-dark" onClick={clearFilters} className="mt-3 rounded-0">
                        Clear Filters
                      </Button>
                    </Col>
                  )}
                </Row>
              </Container>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="flex-grow-1 p-4 bg-white">
            <h5 className="fw-bold mb-4">Profile Information</h5>
            <div className="bg-light p-4 rounded-0">
              <div className="d-flex align-items-center mb-4">
                {editMode ? (
                  <>
                    <div className="position-relative">
                      <img 
                        src={editedUser.image?.startsWith('blob:') ? editedUser.image : 
                             (editedUser.image ? `${API}/${editedUser.image}` : '/default-profile.jpg')}
                        className="rounded-circle border border-dark"
                        width={80}
                        height={80}
                        alt="Profile"
                      />
                      <label className="position-absolute bottom-0 end-0 bg-dark text-white rounded-circle p-2 cursor-pointer">
                        <i className="fa-solid fa-camera"></i>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="d-none" />
                      </label>
                    </div>
                  </>
                ) : (
                  userData?.image ? (
                    <img 
                      src={userData.image.startsWith('http') ? userData.image : `${API}/${userData.image}`}
                      className="rounded-circle border border-dark"
                      width={80}
                      height={80}
                      alt="Profile"
                    />
                  ) : (
                    <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" 
                        style={{width: '80px', height: '80px'}}>
                      <i className="fa-solid fa-user fs-3"></i>
                    </div>
                  )
                )}
                <div className="ms-4">
                  {editMode ? (
                    <Form.Control type="text" name="name" value={editedUser.name || ''} 
                      onChange={handleInputChange} className="mb-2" />
                  ) : (
                    <h4 className="fw-bold mb-1 text-dark">{userData?.name || 'User Name'}</h4>
                  )}
                  <p className="text-muted mb-0">
                    {editMode ? (
                      <Form.Control type="email" name="email" value={editedUser.email || ''} 
                        onChange={handleInputChange} />
                    ) : (
                      userData?.email || 'user@example.com'
                    )}
                  </p>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Member Since</label>
                    <p className="text-dark">
                      {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">User Type</label>
                    <p className="text-dark text-capitalize">
                      {userData?.userType === 'business' ? 'Business' : 
                       userData?.userType === 'individual' ? 'Individual' : 'Host'}
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Saved Workspaces</label>
                    <p className="text-dark">{savedWorkspaces.length}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Account Status</label>
                    <p className="text-dark text-capitalize">
                      {userData?.verified ? 'Verified' : 'Not Verified'}
                    </p>
                  </div>
                </div>
              </div>
              
              {editMode ? (
                <div className="d-flex gap-2">
                  <Button variant="success" onClick={handleSave} className="rounded-0">
                    <i className="fa-solid fa-check me-2"></i>Save Changes
                  </Button>
                  <Button variant="outline-secondary" onClick={handleCancel} className="rounded-0">
                    <i className="fa-solid fa-times me-2"></i>Cancel
                  </Button>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Button variant="dark" onClick={handleEditClick} className="rounded-0 me-2">
                    <i className="fa-solid fa-pen me-2"></i>Edit Profile
                  </Button>
                  <Button variant="outline-dark" className="rounded-0">
                    <i className="fa-solid fa-gear me-2"></i>Settings
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Spaces Tab */}
        {activeTab === 'my-spaces' && (
          <div className="flex-grow-1 p-4 bg-white">
            <h5 className="fw-bold mb-4">Saved Workspaces</h5>
            {savedWorkspaces.length > 0 ? (
              <Row className="g-4">
                {workspaces.filter(ws => savedWorkspaces.includes(ws._id)).map(workspace => (
                  <Col key={workspace._id} xs={12} sm={6} md={4} lg={3}>
                    <Card className="h-100 border-0 rounded-0 shadow-sm">
                     <img 
                        src={workspace.image ? 
                          (workspace.image.startsWith('http') ? workspace.image : `${API}/${workspace.image}`) : 
                          'https://via.placeholder.com/300x200'}
                        className="card-img-top rounded-0"
                        style={{ height: '200px', objectFit: 'cover' }}
                        alt={workspace.name}
                      />
                      <Card.Body className="p-3">
                        <Card.Title className="fw-bold mb-2 text-dark text-truncate">{workspace.name}</Card.Title>
                        <Card.Subtitle className="text-muted fw-medium mb-2 text-truncate">{workspace.location}</Card.Subtitle>
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          <Badge pill bg="light" text="dark" className="fw-medium border rounded-0">
                            {workspace.capacity}
                          </Badge>
                          {workspace.amenities.slice(0, 2).map((item, i) => (
                            <Badge key={i} pill bg="light" text="dark" className="fw-medium border rounded-0">
                              {item}
                            </Badge>
                          ))}
                          {workspace.amenities.length > 2 && (
                            <Badge pill bg="light" text="dark" className="fw-medium border rounded-0">
                              +{workspace.amenities.length - 2}
                            </Badge>
                          )}
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold fs-5 text-dark">${workspace.price}/day</span>
                          <Button variant="dark" className="rounded-0 px-2 py-1" style={{ whiteSpace: 'nowrap' }}>
                            Book Now
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="text-center py-5">
                <h5 className="fw-medium text-muted">You haven't saved any workspaces yet</h5>
                <Button 
                  variant="dark" 
                  className="rounded-0 mt-3"
                  onClick={() => setActiveTab('discover')}
                >
                  <i className="fa-solid fa-magnifying-glass me-2"></i>Browse Workspaces
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Individual;