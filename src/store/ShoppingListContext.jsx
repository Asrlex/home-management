import { create } from 'zustand';
import { axiosRequest } from '../services/AxiosRequest';
import api_config from '../config/apiconfig';

const useShoppingListStore = create((set) => ({
  shoppingListItems: [],

  fetchShoppingListItems: async () => {
    try {
      const response = await axiosRequest('GET', api_config.lista_compra.all);
      set({ shoppingListItems: response });
    } catch (error) {
      console.error('Error fetching shopping list items:', error);
    }
  },

  addShoppingListItem: (item) =>
    set((state) => ({ shoppingListItems: [...state.shoppingListItems, item] })),

  removeShoppingListItem: (id) =>
    set((state) => ({
      shoppingListItems: state.shoppingListItems.filter(
        (item) => item.shoppingListProductID !== id
      ),
    })),

  modifyShoppingListItemAmount: (id, amount) =>
    set((state) => ({
      shoppingListItems: state.shoppingListItems.map((item) =>
        item.shoppingListProductID === id
          ? { ...item, shoppingListProductAmount: amount }
          : item
      ),
    })),
  
  addOrRemoveListTag: (itemID, tagID) =>
    set((state) => ({
      shoppingListItems: state.shoppingListItems.map((item) =>
        item.shoppingListProductID === itemID
          ? {
              ...item,
              tags: item.tags.includes(tagID)
                ? item.tags.filter((tag) => tag !== tagID)
                : [...item.tags, tagID],
            }
          : item
      ),
    })),

  reorderShoppingListItems: (newOrder) =>
    set((state) => ({
      shoppingListItems: newOrder.map((id) =>
        state.shoppingListItems.find((item) => item.shoppingListProductID === id)
      ),
    })),
}));

export default useShoppingListStore;