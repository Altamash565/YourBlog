import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GlobalLoader } from './Loader';

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const authResolved = useSelector((state) => state.auth.authResolved);

  useEffect(() => {
    // Only perform route redirection once authentication status has been verified/resolved
    if (!authResolved) return;

    if (authentication && !authStatus) {
      navigate('/login');
    } else if (!authentication && authStatus) {
      navigate('/');
    }
  }, [authStatus, authResolved, navigate, authentication]);

  // If auth has not resolved yet:
  // If route requires auth and we have a cached logged-in user, render immediately without flashing a spinner!
  if (!authResolved) {
    if (authentication && authStatus) {
      return <>{children}</>;
    }
    return <GlobalLoader />;
  }

  // Prevent flashing protected content if user is unauthenticated and being redirected
  if (authentication && !authStatus) {
    return <GlobalLoader />;
  }

  // Prevent flashing guest page if user is authenticated and being redirected
  if (!authentication && authStatus) {
    return <GlobalLoader />;
  }

  return <>{children}</>;
}
