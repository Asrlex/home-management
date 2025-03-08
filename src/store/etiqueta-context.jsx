import { createContext, useReducer, useEffect } from "react";
import api_config from '../config/apiconfig';
import { axiosRequest } from "../utils/axiosUtils";

const EtiquetaContext = createContext({
  etiquetas: [],
  etiquetasSeleccionadas: [],
  setEtiquetas: () => { },
  setEtiquetasSeleccionadas: () => { },
  addToSeleccionadas: () => { },
  removeFromSeleccionadas: () => { },
  addEtiqueta: () => { },
  deleteEtiqueta: () => { },
});

function EtiquetaReducer(state, action) {
  switch (action.type) {
    case 'SET_ETIQUETAS':
      return {
        ...state,
        etiquetas: action.payload,
      };
    case 'SET_ETIQUETAS_SELECCIONADAS':
      return {
        ...state,
        etiquetasSeleccionadas: action.payload,
      };
    case 'ADD_TO_SELECCIONADAS':
      return {
        ...state,
        etiquetasSeleccionadas: [...state.etiquetasSeleccionadas, action.payload],
      };
    case 'REMOVE_FROM_SELECCIONADAS':
      return {
        ...state,
        etiquetasSeleccionadas: state.etiquetasSeleccionadas.filter(etiqueta => etiqueta.tagID !== action.payload),
      };
    case 'ADD_ETIQUETA':
      return {
        ...state,
        etiquetas: [...state.etiquetas, action.payload],
      };
    case 'DELETE_ETIQUETA':
      return {
        ...state,
        etiquetas: state.etiquetas.filter(etiqueta => etiqueta.tagID !== action.payload),
      }
    default:
      return state;
  }
}

function EtiquetaContextProvider({ children }) {
  const initialState = {
    etiquetas: [],
    etiquetasSeleccionadas: [],
  };

  const [etiquetasEstado, dispatch] = useReducer(EtiquetaReducer, initialState);

  const handleSetEtiquetas = (etiquetas) => {
    dispatch({
      type: 'SET_ETIQUETAS',
      payload: etiquetas,
    });
  };

  const handleSetEtiquetasSeleccionadas = (etiquetas) => {
    dispatch({
      type: 'SET_ETIQUETAS_SELECCIONADAS',
      payload: etiquetas,
    });
  };

  const handleAddToSeleccionadas = (etiqueta) => {
    dispatch({
      type: 'ADD_TO_SELECCIONADAS',
      payload: etiqueta,
    });
  };

  const handleRemoveFromSeleccionadas = (tagID) => {
    dispatch({
      type: 'REMOVE_FROM_SELECCIONADAS',
      payload: tagID,
    });
  };

  const handleAddEtiqueta = (etiqueta) => {
    dispatch({
      type: 'ADD_ETIQUETA',
      payload: etiqueta,
    });
  }

  const handleDeleteEtiqueta = (tagID) => {
    dispatch({
      type: 'DELETE_ETIQUETA',
      payload: tagID,
    });
  }

  useEffect(() => {
    axiosRequest('GET', api_config.etiquetas.all)
      .then(res => {
        handleSetEtiquetas(res);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const ctx = {
    etiquetas: etiquetasEstado.etiquetas,
    etiquetasSeleccionadas: etiquetasEstado.etiquetasSeleccionadas,
    setEtiquetas: handleSetEtiquetas,
    setEtiquetasSeleccionadas: handleSetEtiquetasSeleccionadas,
    addToSeleccionadas: handleAddToSeleccionadas,
    removeFromSeleccionadas: handleRemoveFromSeleccionadas,
    addEtiqueta: handleAddEtiqueta,
    deleteEtiqueta: handleDeleteEtiqueta,
  };

  return (
    <EtiquetaContext.Provider value={ctx}>
      {children}
    </EtiquetaContext.Provider>
  );
}

export { EtiquetaContext, EtiquetaContextProvider };