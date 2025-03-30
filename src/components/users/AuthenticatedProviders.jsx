import useUserStore from '../../store/UserContext';

const AuthenticatedProviders = ({ children }) => {
  const { user } = useUserStore();

  if (!user) {
    return children;
  }

  return (
              {children}
  );
};

export default AuthenticatedProviders;
