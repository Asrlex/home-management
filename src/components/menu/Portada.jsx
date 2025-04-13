import useSettingsStore from "../../store/SettingsStore";
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
    <div className="portada">
      <img
        src={selectedIcon}
        alt="Logo"
        className="portadaLogo"
      />
      <h1 className="portadaTitulo">Bienvenido a Casa</h1>
      <p className="portadaSubtitulo">Tu asistente de hogar</p>
    </div>
  );
};

export default Portada;