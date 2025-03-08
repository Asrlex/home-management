import { Link } from 'react-router-dom';

export default function BarraLateralItem({ texto, icono, tipo="item", section, selectSection, children }) {
  const path = `/${texto.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <Link to={path} onClick={() => selectSection(texto)} className={section === texto ? "itemBarraLateral itemBarraLateralActive" : "itemBarraLateral"}>
    <li className="flex items-center">
        {icono}
        <div className="hidden md:flex ">
          {texto}
        </div>
      {tipo === "dropdown" && (
        {children}
      )}
    </li>
    </Link>
  );
}