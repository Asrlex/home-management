import useUserStore from '../../store/UserStore';

const AuthenticatedProviders = ({ children }) => {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return children;
  }

  return (
    { children }
  );
};

export default AuthenticatedProviders;
