import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useUserStore from '../../store/UserContext';
import Loader from "../generic/Loader";

/**
 * * PrivateRoute component to protect routes that require authentication
 * * @param {Object} children - Props passed to the component
 * * @returns {JSX.Element} - Renders the children if authenticated, otherwise redirects to login
 * * @throws {Error} - Throws an error if token validation fails
 */
export default function PrivateRoute({ children }) {
  const { token, validateToken } = useUserStore();
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        const isValidToken = await validateToken();
        setIsValid(isValidToken);
      } else {
        setIsValid(false);
      }
    };

    checkToken();
  }, [token, validateToken]);

  if (isValid === null) {
    return <Loader />;
  }

  return isValid ? children : <Navigate to="/login" />;
}
