import SidebarItem from './SidebarItem';
import AuthButton from '../users/AuthButton';
import {
  FaHome,
  FaCheckSquare,
  FaShoppingCart,
  FaUtensils,
  FaDollarSign,
  FaCog,
  FaCarSide,
} from 'react-icons/fa';
import { PiCookingPotFill } from 'react-icons/pi';
import { MdAddHome, MdWorkHistory } from 'react-icons/md';
import { FaBoxes } from 'react-icons/fa';
import ToggleMode from './TogglerSection';
import React, { useEffect } from 'react';
import useNotificationStore from '@/store/NotificationStore';

const Sidebar = ({ onSelectSection, section }) => {
  const setNotification = useNotificationStore(
    (state) => state.setNotification
  );

  useEffect(() => {
    setNotification('Productos', 2);
    setNotification('Lista compra', 5);
    setNotification('Despensa', 0);
    setNotification('Recetas', 1);
    setNotification('Tareas pendientes', 3);
    setNotification('Tareas casa', 0);
    setNotification('Fichajes', 0);
    setNotification('Coche', 1);
    setNotification('Gastos', 4);
    setNotification('Ajustes', 0);

    // setNotification('Productos', 0);
    // setNotification('Lista compra', 0);
    // setNotification('Despensa', 0);
    // setNotification('Recetas', 0);
    // setNotification('Tareas pendientes', 0);
    // setNotification('Tareas casa', 0);
    // setNotification('Fichajes', 0);
    // setNotification('Coche', 0);
    // setNotification('Gastos', 0);
    // setNotification('Ajustes', 0);
  }, [setNotification]);
  
  return (
    <div className='barraLateral'>
      <div className='tituloBarraLateral' onClick={() => onSelectSection('')}>
        <FaHome className='logoBarraLateral' />
        <div className='itemBarraLateralTextHidden'>Gestión</div>
      </div>
      <ul className='barraLateralLista'>
        <SidebarItem
          texto='Comida'
          icono={<FaUtensils className='iconoBarraLateral' />}
          tipo='dropdown'
          section={section}
          selectSection={onSelectSection}
        >
          <SidebarItem
            texto='Productos'
            icono={<FaBoxes className='iconoBarraLateral' />}
            selectSection={onSelectSection}
            section={section}
          />
          <SidebarItem
            texto='Lista compra'
            icono={<FaShoppingCart className='iconoBarraLateral' />}
            selectSection={onSelectSection}
            section={section}
          />
          <SidebarItem
            texto='Despensa'
            icono={<FaUtensils className='iconoBarraLateral' />}
            selectSection={onSelectSection}
            section={section}
          />
          <SidebarItem
            texto='Recetas'
            icono={<PiCookingPotFill className='iconoBarraLateral' />}
            selectSection={onSelectSection}
            section={section}
          />
        </SidebarItem>
        <SidebarItem
          texto='Tareas'
          icono={<FaCheckSquare className='iconoBarraLateral' />}
          tipo='dropdown'
          section={section}
          selectSection={onSelectSection}
        >
          <SidebarItem
            texto='Tareas pendientes'
            icono={<FaCheckSquare className='iconoBarraLateral' />}
            selectSection={onSelectSection}
            section={section}
          />
          <SidebarItem
            texto='Tareas casa'
            icono={<MdAddHome className='iconoBarraLateral' />}
            selectSection={onSelectSection}
            section={section}
          />
        </SidebarItem>
        <hr className='barraLateralSeparador' />
        <SidebarItem
          texto='Fichajes'
          icono={<MdWorkHistory className='iconoBarraLateral' />}
          selectSection={onSelectSection}
          section={section}
        />
        <SidebarItem
          texto='Coche'
          icono={<FaCarSide className='iconoBarraLateral' />}
          selectSection={onSelectSection}
          section={section}
        />
        <SidebarItem
          texto='Gastos'
          icono={<FaDollarSign className='iconoBarraLateral' />}
          selectSection={onSelectSection}
          section={section}
        />
        <SidebarItem
          texto='Ajustes'
          icono={<FaCog className='iconoBarraLateral' />}
          selectSection={onSelectSection}
          section={section}
        />
      </ul>
      <div className='toggleMode'>
        <ToggleMode />
        <AuthButton />
      </div>
    </div>
  );
};

export default Sidebar;
