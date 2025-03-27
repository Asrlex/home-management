import aldi from '../../assets/aldi.svg';
import carrefour from '../../assets/carrefour.svg';
import lidl from '../../assets/lidl.svg';
import mercadona from '../../assets/mercadona.jpg';
import { StoreContext } from '../../store/StoreContext';
import { IoStorefront } from "react-icons/io5";
import { useContext } from 'react';

export default function SelectorTienda() {
  const { stores, storeSelect, setStoreSelect } = useContext(StoreContext);

  return (
    <div className='seccionTienda'>
      <select
        name="tienda"
        className='selectorTienda'
        value={storeSelect.storeID}
        onChange={(e) => {
          setTiendaSelect(stores.find(store => store.storeID === parseInt(e.target.value)));
        }}
      >
        {stores.map((store) => (
          <option
            key={store.storeID}
            value={store.storeID}
          >
            {store.storeName}
          </option>
        ))}
      </select>
      {storeSelect.storeName === 'N/A' ? <IoStorefront className="iconoTienda" /> : <img className="iconoTienda"
        src={storeSelect.storeName === 'Aldi' ? aldi :
          storeSelect.storeName === 'Carrefour' ? carrefour :
          storeSelect.storeName === 'Lidl' ? lidl :
              mercadona}
        alt={storeSelect.storeName}
      />}
    </div>
  )
}