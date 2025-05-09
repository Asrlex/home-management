import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useUserStore from '../../store/UserStore';
import Loader from '../generic/Loader';

/**
 * * PrivateRoute component to protect routes that require authentication
 * * @param {Object} children - Props passed to the component
 * * @returns {JSX.Element} - Renders the children if authenticated, otherwise redirects to login
 * * @throws {Error} - Throws an error if token validation fails
 */
export default function PrivateRoute({ children }) {
  const validateToken = useUserStore((state) => state.validateToken);
  const loginStatus = useUserStore((state) => state.loginStatus);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  return loginStatus === 'authenticated' ?
    (
      <>{children}</>
    ) : loginStatus === 'loading' ? (
      <Loader />
    ) : (
      <Navigate to='/login' replace />
    );
}
