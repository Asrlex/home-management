import useUserStore from "../../store/UserContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

const AuthButton = () => {
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [isCompact, setIsCompact] = useState(window.innerWidth < 768);

  const handleAuthAction = () => {
    if (token) {
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isCompact ? (
    <button
      className="authButtonCompact"
      onClick={handleAuthAction}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover ? (
        token ? (
          <FaSignOutAlt />
        ) : (
          <FaSignInAlt />
        )
      ) : (
        <div className="authPill">{token && user.userEmail.slice(0, 2)}</div>
      )}
    </button>
  ) : (
    <div className="authButtonContainer">
      <div className="authPill">{token && user.userEmail.slice(0, 2)}</div>
      <button className="authButton" onClick={handleAuthAction}>
        {token ? <FaSignOutAlt /> : <FaSignInAlt />}
      </button>
    </div>
  );
};

export default AuthButton;
