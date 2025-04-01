import { create } from "zustand";
import { axiosRequest } from "../services/AxiosRequest";
import api_config from "../config/apiconfig";

const useShoppingListStore = create((set) => ({
  shoppingListItems: [],

  fetchShoppingListItems: async () => {
    try {
      const response = await axiosRequest("GET", api_config.lista_compra.all);
      const orderResponse = await axiosRequest(
        "GET",
        `${api_config.productos.order}shoppingList`
      );
      let orderedItems = [];
      let unorderedItems = [];
      let finalItems = [];
      if (orderResponse && orderResponse.length > 0) {
        orderedItems = orderResponse
          .map((id) =>
            response.find((item) => item.shoppingListProductID === id)
          )
          .filter((item) => item !== undefined);
        unorderedItems = response.filter(
          (item) => !orderResponse.includes(item.shoppingListProductID)
        );
        finalItems = [...orderedItems, ...unorderedItems];
      } else {
        finalItems = response;
      }

      set({ shoppingListItems: finalItems });
    } catch (error) {
      console.error("Error fetching shopping list items:", error);
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

    addOrRemoveListTag: (tagID, itemID) =>
      set((state) => ({
        shoppingListItems: state.shoppingListItems.map((item) =>
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

  reorderShoppingListItems: async (newOrder) => {
    try {
      await axiosRequest(
        "POST",
        `${api_config.productos.order}shoppingList`,
        {},
        newOrder
      );

      set((state) => {
        const reorderedItems = newOrder.map((id) => {
          const item = state.shoppingListItems.find(
            (item) => item.shoppingListProductID === id
          );
          return item;
        });
        return { shoppingListItems: reorderedItems };
      });
    } catch (error) {
      console.error("Error reordering shopping list items:", error);
    }
  },
}));

export default useShoppingListStore;
