import BarraLateralItem from "./BarraLateralItem";
import AuthButton from "../users/AuthButton";
import {
  FaHome,
  FaCheckSquare,
  FaShoppingCart,
  FaUtensils,
  FaDollarSign,
  FaCog,
} from "react-icons/fa";
import { PiCookingPotFill } from "react-icons/pi";
import { MdAddHome } from "react-icons/md";
import { FaBoxes } from "react-icons/fa";
import ToggleMode from "./ToggleMode";

const BarraLateral = ({ onSelectSection, section }) => {
  return (
    <div className="barraLateral">
      <div className="tituloBarraLateral" onClick={() => onSelectSection("")}>
        <FaHome className="logoBarraLateral" />
        <div className="itemBarraLateralTextHidden">Gestión</div>
      </div>
      <ul>
        <BarraLateralItem
          texto="Productos"
          icono={<FaBoxes className="iconoBarraLateral" />}
          selectSection={onSelectSection}
          section={section}
        />
        <BarraLateralItem
          texto="Lista compra"
          icono={<FaShoppingCart className="iconoBarraLateral" />}
          selectSection={onSelectSection}
          section={section}
        />
        <BarraLateralItem
          texto="Despensa"
          icono={<FaUtensils className="iconoBarraLateral" />}
          selectSection={onSelectSection}
          section={section}
        />
        <BarraLateralItem
          texto="Tareas pendientes"
          icono={<FaCheckSquare className="iconoBarraLateral" />}
          selectSection={onSelectSection}
          section={section}
        />
        <BarraLateralItem
          texto="Tareas casa"
          icono={<MdAddHome className="iconoBarraLateral" />}
          selectSection={onSelectSection}
          section={section}
        />
        <BarraLateralItem
          texto="Recetas"
          icono={<PiCookingPotFill className="iconoBarraLateral" />}
          selectSection={onSelectSection}
          section={section}
        />
        <BarraLateralItem
          texto="Gastos"
          icono={<FaDollarSign className="iconoBarraLateral" />}
          selectSection={onSelectSection}
          section={section}
        />
        <hr className="barraLateralSeparador" />
        <BarraLateralItem
          texto="Ajustes"
          icono={<FaCog className="iconoBarraLateral" />}
          selectSection={onSelectSection}
          section={section}
        />
      </ul>
      <div className="toggleMode">
        <ToggleMode />
        <AuthButton />
      </div>
    </div>
  );
};

export default BarraLateral;
