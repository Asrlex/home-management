import useUserStore from '../../store/UserStore';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import React from 'react';
import { StoreEnum } from '@/store/entities/enums/store.enum';
import { ApiPaths } from '@/entities/enums/api.enums';

const AuthButton = () => {
  const loginStatus = useUserStore((state) => state.loginStatus);
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [isCompact, setIsCompact] = useState(window.innerWidth < 768);

  const handleAuthAction = () => {
    if (loginStatus === StoreEnum.STATUS_AUTHENTICATED) {
      logout();
      navigate(ApiPaths.Base);
    } else {
      navigate(ApiPaths.Login);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <button
      className="authButtonCompact"
      onClick={handleAuthAction}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover ? (
        loginStatus === 'authenticated' ? (
          <FaSignOutAlt />
        ) : (
          <FaSignInAlt />
        )
      ) : (
        <div className="authPill">
          {loginStatus === 'authenticated' && user.userEmail.slice(0, 2)}
        </div>
      )}
    </button>
  );
};

export default AuthButton;
