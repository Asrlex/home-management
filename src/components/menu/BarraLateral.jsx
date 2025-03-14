import BarraLateralItem from './BarraLateralItem';
import { FaHome, FaCheckSquare, FaShoppingCart, FaUtensils, FaDollarSign, FaCog } from 'react-icons/fa';
import { PiCookingPotFill } from "react-icons/pi";
import ToggleMode from './ToggleMode';
import { MdAddHome } from "react-icons/md";

const BarraLateral = ({ onSelectSection, section }) => {
  return (
    <div className="barraLateral">
      <div className="tituloBarraLateral">
        <FaHome className="logoBarraLateral" />
        <div className="hidden md:block ">
          Gestión
        </div>
      </div>
      <ul>
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
          texto="Control de gastos"
          icono={<FaDollarSign className="iconoBarraLateral" />}
          selectSection={onSelectSection}
          section={section}
        />
        <hr className='w-[90%] m-auto my-3' />
        <BarraLateralItem
          texto="Ajustes"
          icono={<FaCog className="iconoBarraLateral" />}
          selectSection={onSelectSection}
          section={section}
        />
      </ul>
      <div className="toggleMode">
        <ToggleMode/>
      </div>
    </div>
  )
}

export default BarraLateral;