import { createContext, useReducer, useEffect } from "react";
import api_config from '../config/apiconfig';
import { axiosRequest } from "../services/AxiosRequest";

const StoreContext = createContext({
  stores: [],
  storeSelect: {},
  setStores: () => { },
  setStoreSelect: () => { },
  addStore: () => { },
});

function StoreReducer(state, action) {
  switch (action.type) {
    case 'SET_STORES':
      return {
        ...state,
        stores: action.payload,
      };
    case 'SET_STORE_SELECT':
      return {
        ...state,
        storeSelect: action.payload,
      };
    case 'ADD_STORE':
      return {
        ...state,
        stores: [...state.stores, action.payload],
      };
    default:
      return state;
  }
}

function StoreContextProvider({ children }) {
  const initialState = {
    stores: [],
    storeSelect: {},
  };

  const [storesEstado, dispatch] = useReducer(StoreReducer, initialState);

  useEffect(() => {
    axiosRequest('GET', api_config.tiendas.all)
      .then((response) => {
        handleSetStores(response);
        handleSetStoreSelect(response[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSetStores = (stores) => {
    dispatch({
      type: 'SET_STORES',
      payload: stores,
    });
  };

  const handleSetStoreSelect = (store) => {
    dispatch({
      type: 'SET_STORE_SELECT',
      payload: store,
    });
  };

  const handleAddStore = (store) => {
    dispatch({
      type: 'ADD_STORE',
      payload: store,
    });
  }

  const ctx = {
    stores: storesEstado.stores,
    storeSelect: storesEstado.storeSelect,
    setStores: handleSetStores,
    setStoreSelect: handleSetStoreSelect,
    addStore: handleAddStore,
  };

  return (
    <StoreContext.Provider value={ctx}>
      {children}
    </StoreContext.Provider>
  );
}

export { StoreContext, StoreContextProvider };