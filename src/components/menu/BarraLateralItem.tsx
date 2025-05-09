import { Link } from 'react-router-dom';
import { useState } from 'react';
import React from 'react';

interface BarraLateralItemProps {
  texto: string;
  icono: React.ReactNode;
  tipo?: 'item' | 'dropdown';
  section: string;
  selectSection: (section: string) => void;
  children?: React.ReactNode;
}

export default function BarraLateralItem({
  texto,
  icono,
  tipo = 'item',
  section,
  selectSection,
  children,
}: BarraLateralItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const path = `/${texto.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div
      className={`itemBarraLateralWrapper ${
        tipo === 'dropdown' ? 'dropdown' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {tipo === 'dropdown' ? (
        <div className='itemBarraLateral'>
          {icono}
          <div className='itemBarraLateralTextHidden'>{texto}</div>
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
          </li>
        </Link>
      )}
      {tipo === 'dropdown' && isHovered && (
        <ul className='dropdownMenu'>{children}</ul>
      )}
    </div>
  );
}
