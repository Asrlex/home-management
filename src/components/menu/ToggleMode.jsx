import { useState } from "react";
import useThemeStore from "../../store/ThemeContext";
import { MdOutlineWbSunny } from "react-icons/md";
import { FaMoon } from "react-icons/fa";

const ToggleMode = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const [animate, setAnimate] = useState(false);

  const handleClick = () => {
    setAnimate(true);
    setTimeout(() => {
      toggleTheme();
      setAnimate(false);
    }, 300);
  };

  return (
    <button onClick={handleClick} className="botonContador">
      {theme === "dark" ? (
        <FaMoon className={`toggleModeDark ${animate ? "animate" : ""}`} />
      ) : (
        <MdOutlineWbSunny className={`toggleModeLight ${animate ? "animate" : ""}`} />
      )}
    </button>
  );
};

export default ToggleMode;