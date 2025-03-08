import aldi from '../../assets/aldi.svg';
import carrefour from '../../assets/carrefour.svg';
import lidl from '../../assets/lidl.svg';
import mercadona from '../../assets/mercadona.jpg';
import { TiendaContext } from '../../store/tienda-context';
import { IoStorefront } from "react-icons/io5";
import { useContext } from 'react';

export default function SelectorTienda() {
  const { tiendas, tiendaSelect, setTiendaSelect } = useContext(TiendaContext);

  return (
    <div className='seccionTienda'>
      <select
        name="tienda"
        className='selectorTienda'
        value={tiendaSelect.storeID}
        onChange={(e) => {
          setTiendaSelect(tiendas.find(tienda => tienda.storeID === parseInt(e.target.value)));
        }}
      >
        {tiendas.map((tienda) => (
          <option
            key={tienda.storeID}
            value={tienda.storeID}
          >
            {tienda.storeName}
          </option>
        ))}
      </select>
      {tiendaSelect.storeName === 'N/A' ? <IoStorefront className="iconoTienda" /> : <img className="iconoTienda"
        src={tiendaSelect.storeName === 'Aldi' ? aldi :
          tiendaSelect.storeName === 'Carrefour' ? carrefour :
            tiendaSelect.storeName === 'Lidl' ? lidl :
              mercadona}
        alt={tiendaSelect.storeName}
      />}
    </div>
  )
}