import { createContext, useReducer, useEffect } from "react";
import api_config from '../config/apiconfig';
import { axiosRequest } from "../services/AxiosRequest";

const ProductContext = createContext({
  products: [],
  setProducts: () => { },
  addProduct: () => { },
  deleteProduct: () => { },
});

function ProductReducer(state, action) {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload,
      };
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload],
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.productID !== action.payload),
      }
    default:
      return state;
  }
}

function ProductContextProvider({ children }) {
  const initialState = {
    products: [],
  };

  const [productState, dispatch] = useReducer(ProductReducer, initialState);

  const handleSetProducts = (products) => {
    dispatch({
      type: 'SET_PRODUCTS',
      payload: products,
    });
  };

  const handleAddProduct = (product) => {
    dispatch({
      type: 'ADD_PRODUCT',
      payload: product,
    });
  }

  const handleDeleteProduct = (productID) => {
    dispatch({
      type: 'DELETE_PRODUCT',
      payload: productID,
    });
  }

  useEffect(() => {
    axiosRequest('GET', api_config.productos.all)
      .then(res => {
        handleSetProducts(res);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const ctx = {
    products: productState.products,
    setProducts: handleSetProducts,
    addProduct: handleAddProduct,
    deleteProduct: handleDeleteProduct,
  };

  return (
    <ProductContext.Provider value={ctx}>
      {children}
    </ProductContext.Provider>
  );
}

export { ProductContext, ProductContextProvider };