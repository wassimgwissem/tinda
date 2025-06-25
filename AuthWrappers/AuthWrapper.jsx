import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser } from '../src/utils/api';

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkAuthAndRole = async () => {
      try {
        const user = await getUser();
        const currentPath = location.pathname;

        // Admin has access everywhere
        if (user.role === 'admin') {
          setIsReady(true);
          return;
        }

        // Regular users
        if (user.role === 'user') {
          if (user.userType === 'business' && !currentPath.startsWith('/host')) {
            navigate('/host', { replace: true });
            return;
          }
          if (user.userType === 'individual' && !currentPath.startsWith('/individual')) {
            navigate('/individual', { replace: true });
            return;
          }
          setIsReady(true);
          return;
        }

        // Default fallback (shouldn't happen with your schema)
        navigate('/login', { replace: true });
      } catch (error) {
        navigate('/login', { replace: true });
      }
    };

    checkAuthAndRole();
  }, [navigate, location.pathname]);

  return isReady ? children : null;
};

export default AuthWrapper;