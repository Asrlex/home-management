import { createContext, useReducer, useEffect } from "react";
import api_config from '../config/apiconfig';
import { axiosRequest } from "../utils/axiosUtils";

const TiendaContext = createContext({
  tiendas: [],
  tiendaSelect: {},
  setTiendas: () => { },
  setTiendaSelect: () => { },
  addTienda: () => { },
});

function TiendaReducer(state, action) {
  switch (action.type) {
    case 'SET_TIENDAS':
      return {
        ...state,
        tiendas: action.payload,
      };
    case 'SET_TIENDA_SELECT':
      return {
        ...state,
        tiendaSelect: action.payload,
      };
    case 'ADD_TIENDA':
      return {
        ...state,
        tiendas: [...state.tiendas, action.payload],
      };
    default:
      return state;
  }
}

function TiendaContextProvider({ children }) {
  const initialState = {
    tiendas: [],
    tiendaSelect: {},
  };

  const [tiendasEstado, dispatch] = useReducer(TiendaReducer, initialState);

  useEffect(() => {
    axiosRequest('GET', api_config.tiendas.all)
      .then((response) => {
        handleSetTiendas(response);
        handleSetTiendaSelect(response[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSetTiendas = (tiendas) => {
    dispatch({
      type: 'SET_TIENDAS',
      payload: tiendas,
    });
  };

  const handleSetTiendaSelect = (tienda) => {
    dispatch({
      type: 'SET_TIENDA_SELECT',
      payload: tienda,
    });
  };

  const handleAddTienda = (tienda) => {
    dispatch({
      type: 'ADD_TIENDA',
      payload: tienda,
    });
  }

  const ctx = {
    tiendas: tiendasEstado.tiendas,
    tiendaSelect: tiendasEstado.tiendaSelect,
    setTiendas: handleSetTiendas,
    setTiendaSelect: handleSetTiendaSelect,
    addTienda: handleAddTienda,
  };

  return (
    <TiendaContext.Provider value={ctx}>
      {children}
    </TiendaContext.Provider>
  );
}

export { TiendaContext, TiendaContextProvider };