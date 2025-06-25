// RestrictedWrapper.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../src/utils/api';
import LoadingScreen from '../LoadingScreen'; // Your loading component

const RestrictedWrapper = ({ children }) => {
  const [isAllowed, setIsAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getUser();
        if (user) {
          // Immediately redirect without showing the protected page
          if (user.role === 'admin') {
            navigate('/userslist', { replace: true });
            return;
          }
          if (user.userType === 'business') {
            navigate('/host', { replace: true });
            return;
          }
          navigate('/individual', { replace: true });
          return;
        }
        // If no user, allow access
        setIsAllowed(true);
      } catch (error) {
        // If error, assume not logged in and allow access
        setIsAllowed(true);
      }
    };

    checkAuth();
  }, [navigate]);

  // Show loading screen until auth check completes
  if (!isAllowed) return <LoadingScreen />;

  return children;
};

export default RestrictedWrapper;