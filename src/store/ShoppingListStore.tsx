import { create } from "zustand";
import { axiosRequest } from "../common/services/AxiosRequest";
import { HttpEnum } from "@/entities/enums/http.enum";
import { ApiEndpoints, ListaCompraEndpoints, ProductosEndpoints } from "@/config/apiconfig";
import { ShoppingListProductI, TagI } from "@/entities/types/home-management.entity";
import { FetchProductsException, ReorderProductsException } from "@/common/exceptions/product.exception";
import { ProductExceptionMessages } from "@/common/exceptions/entities/enums/product-exception.enum";

interface ShoppingListStore {
  shoppingListItems: ShoppingListProductI[];
  fetchShoppingListItems: () => Promise<void>;
  addShoppingListItem: (item: ShoppingListProductI) => void;
  removeShoppingListItem: (id: number) => void;
  modifyShoppingListItemAmount: (id: number, amount: number) => void;
  addOrRemoveListTag: (tagID: number, itemID: number, tag?: TagI) => void;
  reorderShoppingListItems: (newOrder: number[]) => Promise<void>;
}

const useShoppingListStore = create((set): ShoppingListStore => ({
  shoppingListItems: [],

  fetchShoppingListItems: async () => {
    try {
      const response: ShoppingListProductI[] = await axiosRequest(
        HttpEnum.GET,
        ApiEndpoints.hm_url + ListaCompraEndpoints.all
      );
      const orderResponse: number[] = await axiosRequest(
        HttpEnum.GET,
        `${ApiEndpoints.hm_url + ProductosEndpoints.order}shoppingList`
      );
      let orderedItems: ShoppingListProductI[] = [];
      let unorderedItems: ShoppingListProductI[] = [];
      let finalItems: ShoppingListProductI[] = [];
      if (orderResponse && orderResponse.length > 0) {
        orderedItems = orderResponse
          .map((id: number) =>
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
      throw new FetchProductsException(
        ProductExceptionMessages.FetchProductsException + error
      );
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

  addOrRemoveListTag: (tagID, itemID, tag?) =>
    set((state) => ({
      shoppingListItems: state.shoppingListItems.map((item) =>
        item.product.productID === itemID
          ? {
            ...item,
            product: {
              ...item.product,
              tags: item.product.tags.some(
                (tag) => tag.tagID === tagID
              )
                ? item.product.tags.filter((tag) => tag.tagID !== tagID)
                : [...item.product.tags, tag],
            },
          }
          : item
      ),
    })),

  reorderShoppingListItems: async (newOrder) => {
    try {
      await axiosRequest(
        HttpEnum.POST,
        `${ApiEndpoints.hm_url + ProductosEndpoints.order}shoppingList`,
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
      throw new ReorderProductsException(
        ProductExceptionMessages.ReorderProductsException + error
      );
    }
  },
}));

export default useShoppingListStore;
