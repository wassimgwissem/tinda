// Import necessary React hooks and components
import { useState, useRef, useEffect } from 'react'; // React core hooks
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom'; // Routing utilities
import './App.css'; // CSS styles for this component
import Home from './components/Home'; // Home page component
import SafetyTips from './components/SafetyTips'; // Safety tips page component
import CommunityGuidelines from './components/CommunityGuidelines'; // Guidelines page component
import AboutUs from './components/AboutUs'; // About us page component
import Contact from './components/Contact'; // Contact page component
import Signup from './components/Signup'; // Signup page component
import Login from './components/Login'; // Login page component
import Individual from './components/Individual'; // Individual user page component
import Host from "./components/Host"; // Host user page component
import { getUser } from './utils/api'; // API function to get user data
import AuthWrapper from '../AuthWrappers/AuthWrapper'; // Wrapper for protected routes
import UsersList from './components/UsersList'; // Users list page component
import LoadingScreen from '../LoadingScreen'; // Loading screen component
import RestrictedWrapper from '../AuthWrappers/RestrictedWrapper'; // Wrapper for public routes

// Main App component
function App() {
  // State for showing/hiding the contact popup
  const [showContactPopup, setShowContactPopup] = useState(false);
  // State for storing the logged-in user data
  const [loggedUser, setLoggedUser] = useState(null);
  // State for loading status
  const [loading, setLoading] = useState(true);
  // State for navigation status (to show loading during route changes)
  const [isNavigating, setIsNavigating] = useState(false);
  
  // React Router hooks for navigation and location
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ref for the popup div (to potentially handle clicks outside)
  const popupRef = useRef();

  // Effect to handle route changes and show loading during navigation
  useEffect(() => {
    const MIN_LOADING_TIME = 1000; // Minimum loading time (1 second)
    
    // Set navigating to true when route changes
    setIsNavigating(true);
    // Set a timer to turn off navigating status after minimum time
    const timer = setTimeout(() => setIsNavigating(false), MIN_LOADING_TIME);
    
    // Cleanup function to clear the timer if component unmounts
    return () => clearTimeout(timer);
  }, [location.key]); // Runs when location.key changes (on route change)

  // Effect to fetch user data when component mounts
  useEffect(() => {
    const fetchUser = async () => {
      const startTime = Date.now();
      const MIN_LOADING_TIME = 2000; // Minimum loading time (2 seconds)
      
      try {
        setLoading(true); // Start loading
        const user = await getUser(); // Fetch user data from API
        setLoggedUser(user); // Store user data in state
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setLoggedUser(null); // Reset user if error occurs
      } finally {
        // Calculate remaining time to ensure minimum loading time
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed);
        // Set loading to false after remaining time
        setTimeout(() => setLoading(false), remainingTime);
      }
    };

    fetchUser(); // Call the async function
  }, []); // Empty dependency array means this runs only once on mount

  // Show loading screen if either loading or navigating
  if (loading || isNavigating) {
    return <LoadingScreen />;
  }

  // Main component render
  return (
    <div>
      {/* Define all application routes */}
      <Routes>
        {/* Public routes - restricted for logged-in users */}
        <Route path='/' element={
          <RestrictedWrapper>
            <Home />
          </RestrictedWrapper>
        } />
        <Route path='/login' element={
          <RestrictedWrapper>
            <Login setLoggedUser={setLoggedUser} />
          </RestrictedWrapper>
        } />
        <Route path='/signup' element={
          <RestrictedWrapper>
            <Signup />
          </RestrictedWrapper>
        } />
        <Route path='/aboutus' element={
          <RestrictedWrapper>
            <AboutUs />
          </RestrictedWrapper>
        } />
        <Route path='/safetytips' element={
          <RestrictedWrapper>
            <SafetyTips />
          </RestrictedWrapper>
        } />
        <Route path='/communityguidelines' element={
          <RestrictedWrapper>
            <CommunityGuidelines />
          </RestrictedWrapper>
        } />
        <Route path='/contact' element={
          <RestrictedWrapper>
            <Contact />
          </RestrictedWrapper>
        } />

        {/* Protected routes - require authentication */}
        <Route path='/userslist' element={
          <AuthWrapper>
            <UsersList />
          </AuthWrapper>
        } />
        <Route path="/host" element={
          <AuthWrapper>
            <Host loggedUser={loggedUser} />
          </AuthWrapper>
        } />
        <Route path="/individual" element={
          <AuthWrapper>
            <Individual loggedUser={loggedUser} />
          </AuthWrapper>  
        } />
      </Routes>

      {/* Floating question mark icon for contact support */}
      <i 
        className="fa-solid fa-circle-question" 
        style={{
          position: "fixed", 
          right: "1.5vw",
          bottom: "2vh",
          fontSize: 46,
          cursor: "pointer",
          transition: 'transform 0.2s'
        }}
        onClick={() => setShowContactPopup(!showContactPopup)} // Toggle popup
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} // Grow on hover
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} // Return to normal
      />

      {/* Contact Popup - shown conditionally */}
      {showContactPopup && (
        <div 
          ref={popupRef}
          className="bg-white  p-4 d-flex flex-column"
          style={{
            borderRadius:22,
            width: '400px',
            maxWidth: '90vw',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            position: 'fixed',
            bottom:"63px",
            right:"66px",
            transform: 'scale(0.95) translateY(10px)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transformOrigin: 'center bottom'
          }}
        >
          {/* Close button for the popup */}
          <i 
            className="fa-solid fa-xmark" 
            onClick={() => setShowContactPopup(false)}
            style={{
              fontSize: 28,
              position: "absolute",
              top: 17.5,
              right: 22,
              cursor: "pointer"
            }}
          />
          
          {/* Popup content */}
          <h2 className="fw-bolder mb-4 text-center">Contact Support</h2>
    
          {/* Contact form */}
          <form className="d-flex flex-column gap-3">
            {/* Email input */}
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                placeholder="example@domain.com"
                onFocus={(e) => { 
                  e.target.style.boxShadow = '0 0 0 0.01rem #454545';
                  e.target.style.borderColor = '#ced4da';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>
            
            {/* Subject input */}
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input 
                type="text" 
                className="form-control" 
                id="subject" 
                placeholder="What's this about?"
                onFocus={(e) => { 
                  e.target.style.boxShadow = '0 0 0 0.01rem #454545';
                  e.target.style.borderColor = '#ced4da';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>
            
            {/* Message textarea */}
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                className="form-control" 
                id="message" 
                rows="4"
                placeholder="How can we help you?"
                onFocus={(e) => { 
                  e.target.style.boxShadow = '0 0 0 0.01rem #454545';
                  e.target.style.borderColor = '#ced4da';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                }}
                required
              ></textarea>
            </div>
            
            {/* Submit button */}
            <button 
              type="submit" 
              className="btn btn-dark mt-2"
              onClick={(e) => {
                e.preventDefault();
                // In a real app, this would submit to a backend
                setShowContactPopup(false);
                alert("Message sent! We'll get back to you soon.");
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;