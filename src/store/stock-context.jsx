import { createContext, useReducer, useEffect } from "react";
import api_config from '../config/apiconfig';
import { axiosRequest } from "../utils/axiosUtils";

const StockContext = createContext({
  stockItems: [],
  setStockItems: () => {},
  addStockItem: () => {},
  removeStockItem: () => {},
  modifyStockItemAmount: () => {},
  reorderStockItems: () => {},
  addOrRemoveTag: () => {},
});

function stockReducer(state, action) {
  switch (action.type) {
    case 'SET_STOCK_ITEMS':
      return {
        ...state,
        stockItems: action.payload,
      };
    case 'ADD_STOCK_ITEM':
      return {
        ...state,
        stockItems: [...state.stockItems, action.payload],
      };
    case 'REMOVE_STOCK_ITEM':
      return {
        ...state,
        stockItems: state.stockItems.filter(item => item.stockProductID !== action.payload),
      };
    case 'MODIFY_ITEM_AMOUNT':
      return {
        ...state,
        stockItems: state.stockItems.map(item => {
          if (item.stockProductID === action.payload.id) {
            return {
              ...item,
              stockProductAmount: action.payload.amount,
            };
          }
          return item;
        }),
      };
    case 'REORDER_STOCK_ITEMS':
      return {
        ...state,
        stockItems: action.payload,
      };
    case 'ADD_OR_REMOVE_TAG':
      return {
        ...state,
        stockItems: state.stockItems.map(item => {
          if (item.stockProductID === action.payload.id) {
            return {
              ...item,
              tags: item.tags.some(tag => tag.tagID === action.payload.tagID)
                ? item.tags.filter(tag => tag.tagID !== action.payload.tagID)
                : [...item.tags, { tagID: action.payload.tagID }],
            };
          }
          return item;
        }),
      };
    default:
      return state;
  }
}

function StockContextProvider({ children }) {
  const initialState = {
    stockItems: [],
  };

  const [state, dispatch] = useReducer(stockReducer, initialState);

  useEffect(() => {
    axiosRequest('GET', api_config.despensa.all)
      .then(response => {
        axiosRequest('GET', api_config.productos.order + 'stock')
          .then(orderResponse => {
            const orderedItems = orderItems(response, orderResponse);
            setStockItems(orderedItems);
          })
          .catch(error => {
            console.error(error);
            setStockItems(response);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const setStockItems = (items) => {
    dispatch({ type: 'SET_STOCK_ITEMS', payload: items });
  };

  const addStockItem = (item) => {
    dispatch({ type: 'ADD_STOCK_ITEM', payload: item });
  };

  const removeStockItem = (id) => {
    dispatch({ type: 'REMOVE_STOCK_ITEM', payload: id });
  };

  const modifyStockItemAmount = (id, amount) => {
    dispatch({ type: 'MODIFY_ITEM_AMOUNT', payload: { id, amount } });
  };

  const addOrRemoveTag = (id, tagID) => {
    dispatch({ type: 'ADD_OR_REMOVE_TAG', payload: { id, tagID } });
  };

  const reorderStockItems = (orderedItems) => {
    dispatch({ type: 'REORDER_STOCK_ITEMS', payload: orderedItems });
    const orderPayload = orderedItems.map(item => item.stockProductID);
    axiosRequest('POST', api_config.productos.order + 'stock', {}, orderPayload)
      .catch(error => {
        console.error(error);
      });
  };

  const orderItems = (items, orderResponse) => {
    const order = orderResponse;
    if (order && order.length > 0) {
      return items.sort((a, b) => order.indexOf(a.stockProductID) - order.indexOf(b.stockProductID));
    }
    return items;
  };

  const contextValue = {
    stockItems: state.stockItems,
    setStockItems,
    addStockItem,
    removeStockItem,
    modifyStockItemAmount,
    addOrRemoveTag,
    reorderStockItems,
  };

  return (
    <StockContext.Provider value={contextValue}>
      {children}
    </StockContext.Provider>
  );
}

export { StockContext, StockContextProvider };