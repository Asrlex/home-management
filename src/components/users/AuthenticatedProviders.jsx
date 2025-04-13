import useUserStore from '../../store/UserStore';

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
