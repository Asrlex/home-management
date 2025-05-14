import { Link } from 'react-router-dom';
import { useState } from 'react';
import React from 'react';
import { IoMdArrowDropright } from 'react-icons/io';
import useNotificationStore from '@/store/NotificationStore';

interface SidebarItemProps {
  texto: string;
  icono: React.ReactNode;
  tipo?: 'item' | 'dropdown';
  section: string;
  selectSection: (section: string) => void;
  children?: React.ReactNode;
}

export default function SidebarItem({
  texto,
  icono,
  tipo = 'item',
  section,
  selectSection,
  children,
}: SidebarItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const path = `/${texto.toLowerCase().replace(/\s+/g, '-')}`;

  const notificationCount = useNotificationStore(
    (state) => state.notifications[texto] || 0
  );

  return (
    <div
      className={`itemBarraLateralWrapper ${tipo === 'dropdown' ? 'dropdown' : ''
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {tipo === 'dropdown' ? (
        <div className='itemBarraLateral'>
          {icono}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '3px' }}>
            <span className='itemBarraLateralTextHidden'>{texto}</span>
            <span><IoMdArrowDropright /></span>
          </div>
        </div>
      ) : (
        <Link
          to={path}
          onClick={() => selectSection(texto)}
          className={
            section === texto
              ? 'itemBarraLateral itemBarraLateralActive'
              : 'itemBarraLateral'
          }
        >
          <li className='itemBarraLateralText'>
            {icono}
            <div className='itemBarraLateralTextHidden'>{texto}</div>
            {notificationCount > 0 && (
              <span className='notificationBubble'>{notificationCount}</span>
            )}
          </li>
        </Link>
      )}
      {tipo === 'dropdown' && isHovered && (
        <ul className='dropdownMenu'>{children}</ul>
      )}
    </div>
  );
}
