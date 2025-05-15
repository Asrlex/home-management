import { create } from 'zustand';
import { axiosRequest } from '../hooks/axiosRequest';
import { StockProductI, TagI } from '@/entities/types/home-management.entity';
import { HttpEnum } from '@/entities/enums/http.enum';
import {
  ApiEndpoints,
  DespensaEndpoints,
  ProductosEndpoints,
} from '@/config/apiconfig';
import { ProductExceptionMessages } from '@/common/exceptions/entities/enums/product-exception.enum';
import {
  FetchProductsException,
  ReorderProductsException,
} from '@/common/exceptions/product.exception';

interface StockStore {
  stockItems: StockProductI[];
  fetchStockItems: () => Promise<void>;
  addStockItem: (item: StockProductI) => void;
  removeStockItem: (id: number) => void;
  modifyStockItemAmount: (id: number, amount: number) => void;
  addOrRemoveListTag: (tagID: number, itemID: number, tag?: TagI) => void;
  reorderStockItems: (newOrder: number[]) => Promise<void>;
}

const useStockStore = create(
  (set): StockStore => ({
    stockItems: [],

    fetchStockItems: async () => {
      try {
        const { data: response } = (await axiosRequest(
          HttpEnum.GET,
          ApiEndpoints.hm_url + DespensaEndpoints.all
        )) as {
          data: StockProductI[];
        };
        const { data: orderResponse } = (await axiosRequest(
          HttpEnum.GET,
          `${ApiEndpoints.hm_url + ProductosEndpoints.order}stock`
        )) as {
          data: number[];
        };
        let orderedItems: StockProductI[] = [];
        let unorderedItems: StockProductI[] = [];
        let finalItems: StockProductI[] = [];
        if (orderResponse && orderResponse.length > 0) {
          orderedItems = orderResponse
            .map((id: number) =>
              response.find((item: StockProductI) => item.stockProductID === id)
            )
            .filter((item: StockProductI) => item !== undefined);
          unorderedItems = response.filter(
            (item: StockProductI) =>
              !orderResponse.includes(item.stockProductID)
          );
          finalItems = [...orderedItems, ...unorderedItems];
        } else {
          finalItems = response;
        }

        set({ stockItems: finalItems });
      } catch (error) {
        throw new FetchProductsException(
          ProductExceptionMessages.FetchProductsException + error
        );
      }
    },

    addStockItem: (item) =>
      set((state) => ({ stockItems: [...state.stockItems, item] })),

    removeStockItem: (id) =>
      set((state) => ({
        stockItems: state.stockItems.filter(
          (item) => item.stockProductID !== id
        ),
      })),

    modifyStockItemAmount: (id, amount) =>
      set((state) => ({
        stockItems: state.stockItems.map((item) =>
          item.stockProductID === id
            ? { ...item, stockProductAmount: amount }
            : item
        ),
      })),

    addOrRemoveListTag: (tagID, itemID, tag?) =>
      set((state) => ({
        stockItems: state.stockItems.map((item) =>
          item.product.productID === itemID
            ? {
                ...item,
                product: {
                  ...item.product,
                  tags: item.product.tags.some((tag) => tag.tagID === tagID)
                    ? item.product.tags.filter((tag) => tag.tagID !== tagID)
                    : [...item.product.tags, tag],
                },
              }
            : item
        ),
      })),

    reorderStockItems: async (newOrder) => {
      try {
        await axiosRequest(
          HttpEnum.POST,
          `${ApiEndpoints.hm_url + ProductosEndpoints.order}stock`,
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
        throw new ReorderProductsException(
          ProductExceptionMessages.ReorderProductsException + error
        );
      }
    },
  })
);

export default useStockStore;
