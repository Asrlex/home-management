import aldi from '../../assets/aldi.svg';
import carrefour from '../../assets/carrefour.svg';
import lidl from '../../assets/lidl.svg';
import mercadona from '../../assets/mercadona.jpg';
import useStoreStore from '../../store/ShopStore';
import { IoStorefront } from "react-icons/io5";

export default function SelectorTienda() {
  const shops = useStoreStore(state => state.shops);
  const selectedShop = useStoreStore(state => state.selectedShop);

  return (
    <div className='seccionTienda'>
      <select
        name="tienda"
        className='selectorTienda'
        value={selectedShop.storeID}
        onChange={(e) => {
          setTiendaSelect(shops.find(shop => shop.storeID === parseInt(e.target.value)));
        }}
      >
        {shops.map((shop) => (
          <option
            key={shop.storeID}
            value={shop.storeID}
          >
            {shop.storeName}
          </option>
        ))}
      </select>
      {selectedShop.storeName === 'N/A' ? <IoStorefront className="iconoTienda" /> : <img className="iconoTienda"
        src={selectedShop.storeName === 'Aldi' ? aldi :
          selectedShop.storeName === 'Carrefour' ? carrefour :
          selectedShop.storeName === 'Lidl' ? lidl :
              mercadona}
        alt={selectedShop.storeName}
      />}
    </div>
  )
}