import { create } from 'zustand';
import { axiosRequest } from '../hooks/useAxios';
import { StoreI } from '@/entities/types/home-management.entity';
import { FetchShopsException, SetSelectedShopException } from '@/common/exceptions/shop.exception';
import { ShopExceptionMessages } from '@/common/exceptions/entities/enums/shop-exception.enum';
import { HttpEnum } from '@/entities/enums/http.enum';
import { ApiEndpoints, TiendasEndpoints } from '@/config/apiconfig';
import { CreateStoreDto } from '@/entities/dtos/store.dto';

interface ShopStore {
  shops: StoreI[];
  selectedShop: StoreI | null;
  fetchShops: () => Promise<void>;
  setShopSelect: (store: StoreI) => void;
  addShop: (store: CreateStoreDto) => void;
}

const useShopStore = create((set): ShopStore => ({
  shops: [],
  selectedShop: null,

  fetchShops: async () =>
    await axiosRequest(
      HttpEnum.GET,
      ApiEndpoints.hm_url + TiendasEndpoints.all
    )
      .then((response: StoreI[]) => set({ shops: response, selectedShop: response[0] }))
      .catch((error) => {
        throw new FetchShopsException(ShopExceptionMessages.FetchShopsException + error);
      }),

  setShopSelect: (shop) => {
    try {
      set({ selectedShop: shop });
    } catch (error) {
      throw new SetSelectedShopException(ShopExceptionMessages.SetSelectedShopException + error);
    }
  },

  addShop: async (shop: CreateStoreDto) =>
    await axiosRequest(
      HttpEnum.POST,
      ApiEndpoints.hm_url + TiendasEndpoints.base,
      {},
      shop
    )
      .then((state: ShopStore) => ({
        shops: [...state.shops, shop],
      }))
      .catch((error) => {
        throw new SetSelectedShopException(ShopExceptionMessages.SetSelectedShopException + error);
      }),
}));

export default useShopStore;