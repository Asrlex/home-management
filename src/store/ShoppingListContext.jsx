import { createContext, useReducer, useEffect } from "react";
import api_config from '../config/apiconfig';
import { axiosRequest } from "../services/AxiosRequest";

const ShoppingListContext = createContext({
  shoppingListItems: [],
  setShoppingListItems: () => { },
  addShoppingListItem: () => { },
  removeShoppingListItem: () => { },
  modifyShoppingListItemAmount: () => { },
  reorderShoppingListItems: () => { },
  addOrRemoveListTag: () => { },
});

function shoppingListReducer(state, action) {
  switch (action.type) {
    case 'SET_SHOPPING_LIST_ITEMS':
      return {
        ...state,
        shoppingListItems: action.payload,
      };
    case 'ADD_SHOPPING_LIST_ITEM':
      return {
        ...state,
        shoppingListItems: [...state.shoppingListItems, action.payload],
      };
    case 'REMOVE_SHOPPING_LIST_ITEM':
      return {
        ...state,
        shoppingListItems: state.shoppingListItems.filter(item => item.shoppingListProductID !== action.payload),
      };
    case 'MODIFY_ITEM_AMOUNT':
      return {
        ...state,
        shoppingListItems: state.shoppingListItems.map(item => {
          if (item.shoppingListProductID === action.payload.id) {
            return {
              ...item,
              shoppingListProductAmount: action.payload.amount,
            };
          }
          return item;
        }),
      };
    case 'REORDER_SHOPPING_LIST_ITEMS':
      return {
        ...state,
        shoppingListItems: action.payload,
      };
    case 'ADD_OR_REMOVE_LIST_TAG':
      return {
        ...state,
        shoppingListItems: state.shoppingListItems.map(item => {
          console.log(item.product.productID, action.payload.id);
          if (item.product.productID === action.payload.id) {
            return {
              ...item,
              tags: item.product.tags.some(tag => tag.tagID === action.payload.tagID)
                ? item.product.tags.filter(tag => tag.tagID !== action.payload.tagID)
                : [...item.product.tags, { tagID: action.payload.tagID }],
            };
          }
          return item;
        }),
      };
    default:
      return state;
  }
}

function ShoppingListContextProvider({ children }) {
  const initialState = {
    shoppingListItems: [],
  };

  const [state, dispatch] = useReducer(shoppingListReducer, initialState);

  useEffect(() => {
    axiosRequest('GET', api_config.lista_compra.all)
      .then(response => {
        axiosRequest('GET', api_config.productos.order + 'shoppingList')
          .then(orderResponse => {
            const orderedItems = orderItems(response, orderResponse);
            setShoppingListItems(orderedItems);
          })
          .catch(error => {
            console.error(error);
            setShoppingListItems(response);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const setShoppingListItems = (items) => {
    dispatch({ type: 'SET_SHOPPING_LIST_ITEMS', payload: items });
  };

  const addShoppingListItem = (item) => {
    dispatch({ type: 'ADD_SHOPPING_LIST_ITEM', payload: item });
  };

  const removeShoppingListItem = (id) => {
    dispatch({ type: 'REMOVE_SHOPPING_LIST_ITEM', payload: id });
  };

  const modifyShoppingListItemAmount = (id, amount) => {
    dispatch({ type: 'MODIFY_ITEM_AMOUNT', payload: { id, amount } });
  };

  const addOrRemoveListTag = (id, tagID) => {
    dispatch({ type: 'ADD_OR_REMOVE_LIST_TAG', payload: { id, tagID } });
  };

  const reorderShoppingListItems = (orderedItems) => {
    dispatch({ type: 'REORDER_SHOPPING_LIST_ITEMS', payload: orderedItems });
    const orderPayload = orderedItems.map(item => item.shoppingListProductID);
    axiosRequest('POST', api_config.productos.order + 'shoppingList', {}, orderPayload)
      .catch(error => {
        console.error(error);
      });
  };

  const orderItems = (items, orderResponse) => {
    const order = orderResponse;
    if (order && order.length > 0) {
      return items.sort((a, b) => order.indexOf(a.shoppingListProductID) - order.indexOf(b.shoppingListProductID));
    }
    return items;
  };

  const contextValue = {
    shoppingListItems: state.shoppingListItems,
    setShoppingListItems,
    addShoppingListItem,
    removeShoppingListItem,
    modifyShoppingListItemAmount,
    addOrRemoveListTag,
    reorderShoppingListItems,
  };

  return (
    <ShoppingListContext.Provider value={contextValue}>
      {children}
    </ShoppingListContext.Provider>
  );
}

export { ShoppingListContext, ShoppingListContextProvider };