import useUserStore from '../../store/UserContext';
import { useNavigate } from 'react-router-dom';

const AuthButton = () => {
  const { token, user, logout } = useUserStore();
  const navigate = useNavigate();

  const handleClick = () => {
    if (token) {
      logout();
    } else {
      navigate("/login");
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {token && (
        <div 
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#007bff',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}
        >
          {user.userEmail.slice(0, 2)}
        </div>
      )}
      <button 
        className="modalBoton"
        onClick={handleClick}
      >
        {token ? 'Logout' : 'Login'}
      </button>
    </div>
  );
};

export default AuthButton;