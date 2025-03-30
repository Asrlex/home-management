import { create } from 'zustand';
import { axiosRequest } from '../services/AxiosRequest';
import api_config from '../config/apiconfig';

const useStockStore = create((set) => ({
  stockItems: [],

  fetchStockItems: async () => {
    try {
      const response = await axiosRequest('GET', api_config.despensa.all);
      set({ stockItems: response });
    } catch (error) {
      console.error('Error fetching stock items:', error);
    }
  },

  addStockItem: (item) => set((state) => ({ stockItems: [...state.stockItems, item] })),

  removeStockItem: (id) =>
    set((state) => ({
      stockItems: state.stockItems.filter((item) => item.stockProductID !== id),
    })),

  modifyStockItemAmount: (id, amount) =>
    set((state) => ({
      stockItems: state.stockItems.map((item) =>
        item.stockProductID === id ? { ...item, stockProductAmount: amount } : item
      ),
    })),
  
  addOrRemoveListTag: (itemID, tagID) =>
    set((state) => ({
      stockItems: state.stockItems.map((item) =>
        item.stockProductID === itemID
          ? {
              ...item,
              tags: item.tags.includes(tagID)
                ? item.tags.filter((tag) => tag !== tagID)
                : [...item.tags, tagID],
            }
          : item
      ),
    })),

  reorderStockItems: (newOrder) =>
    set((state) => ({
      stockItems: newOrder.map((id) =>
        state.stockItems.find((item) => item.stockProductID === id)
      ),
    })),
}));

export default useStockStore;