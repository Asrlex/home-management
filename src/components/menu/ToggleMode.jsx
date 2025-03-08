import { useContext, useState } from "react";
import { ThemeContext } from "../../store/theme-context";
import { MdOutlineWbSunny } from "react-icons/md";
import { FaMoon } from "react-icons/fa";

const ToggleMode = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [animate, setAnimate] = useState(false);

  const handleClick = () => {
    setAnimate(true);
    setTimeout(() => {
      toggleTheme();
      setAnimate(false);
    }, 300);
  };

  return (
    <button onClick={handleClick}>
      {theme === "light" ? (
        <FaMoon className={`toggleModeDark ${animate ? "animate" : ""}`} />
      ) : (
        <MdOutlineWbSunny className={`toggleModeLight ${animate ? "animate" : ""}`} />
      )}
    </button>
  );
};

export default ToggleMode;