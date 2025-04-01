import { create } from "zustand";
import { axiosRequest } from "../services/AxiosRequest";
import api_config from "../config/apiconfig";

const useStockStore = create((set) => ({
  stockItems: [],

  fetchStockItems: async () => {
    try {
      const response = await axiosRequest("GET", api_config.despensa.all);
      const orderResponse = await axiosRequest(
        "GET",
        `${api_config.productos.order}stock`
      );
      let orderedItems = [];
      let unorderedItems = [];
      let finalItems = [];
      if (orderResponse && orderResponse.length > 0) {
        orderedItems = orderResponse
          .map((id) => response.find((item) => item.stockProductID === id))
          .filter((item) => item !== undefined);
        unorderedItems = response.filter(
          (item) => !orderResponse.includes(item.stockProductID)
        );
        finalItems = [...orderedItems, ...unorderedItems];
      } else {
        finalItems = response;
      }

      set({ stockItems: finalItems });
    } catch (error) {
      console.error("Error fetching stock items:", error);
    }
  },

  addStockItem: (item) =>
    set((state) => ({ stockItems: [...state.stockItems, item] })),

  removeStockItem: (id) =>
    set((state) => ({
      stockItems: state.stockItems.filter((item) => item.stockProductID !== id),
    })),

  modifyStockItemAmount: (id, amount) =>
    set((state) => ({
      stockItems: state.stockItems.map((item) =>
        item.stockProductID === id
          ? { ...item, stockProductAmount: amount }
          : item
      ),
    })),

    addOrRemoveListTag: (tagID, itemID) =>
      set((state) => ({
        stockItems: state.stockItems.map((item) =>
          item.product.productID === itemID
            ? {
                ...item,
                product: {
                  ...item.product,
                  tags: item.product.tags.some((tag) => tag.tagID === tagID)
                    ? item.product.tags.filter((tag) => tag.tagID !== tagID)
                    : [...item.product.tags, { tagID }],
                },
              }
            : item
        ),
      })),

  reorderStockItems: async (newOrder) => {
    try {
      await axiosRequest(
        "POST",
        `${api_config.productos.order}stock`,
        {},
        newOrder
      );

      set((state) => {
        const reorderedItems = newOrder.map((id) => {
          const item = state.stockItems.find(
            (item) => item.stockProductID === id
          );
          return item;
        });
        return { stockItems: reorderedItems };
      });
    } catch (error) {
      console.error("Error reordering stock items:", error);
    }
  },
}));

export default useStockStore;
