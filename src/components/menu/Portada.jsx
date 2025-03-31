import useSettingsStore from "../../store/SettingsContext";
import summerIcon from "../../assets/summer.png";
import winterIcon from "../../assets/winter.png";
import springIcon from "../../assets/spring.png";
import autumnIcon from "../../assets/autumn.png";

const icons = {
  summer: summerIcon,
  winter: winterIcon,
  spring: springIcon,
  autumn: autumnIcon,
};

const Portada = () => {
  const settings = useSettingsStore((state) => state.settings);
  const selectedIcon = icons[settings?.icon] || summerIcon;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img
        src={selectedIcon}
        alt="Logo"
        className="w-64 h-64 mb-4 animate-bounce image-pixelated"
      />
      <h1 className="text-3xl font-bold text-[var(--title-text-color)] mb-2">Bienvenido a Casa</h1>
      <p className="text-gray-600">Tu asistente de hogar</p>
    </div>
  );
};

export default Portada;