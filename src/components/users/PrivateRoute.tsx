import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useUserStore from '../../store/UserStore';
import Loader from '../generic/Loader';
import React from 'react';
import { StoreEnum } from '@/store/entities/enums/store.enum';
import { ApiPaths } from '@/entities/enums/api.enums';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const validateToken = useUserStore((state) => state.validateToken);
  const loginStatus = useUserStore((state) => state.loginStatus);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  return loginStatus === StoreEnum.STATUS_AUTHENTICATED ?
    (
      <>{children}</>
    ) : loginStatus === StoreEnum.STATUS_LOADING ? (
      <Loader />
    ) : (
      <Navigate to={ApiPaths.Login} replace />
    );
}
