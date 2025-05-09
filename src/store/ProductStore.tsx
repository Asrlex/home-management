import { create } from 'zustand';
import { axiosRequest } from '../hooks/useAxios';
import { ProductI } from '@/entities/types/home-management.entity';
import { HttpEnum } from '@/entities/enums/http.enum';
import { CreateProductDto } from '@/entities/dtos/product.dto';
import { AddProductException, DeleteProductException, FetchProductsException } from '@/common/exceptions/product.exception';
import { ProductExceptionMessages } from '@/common/exceptions/entities/enums/product-exception.enum';
import { ApiEndpoints, ProductosEndpoints } from '@/config/apiconfig';

interface ProductStore {
  products: ProductI[];
  fetchProducts: () => Promise<void>;
  addProduct: (newProduct: CreateProductDto) => Promise<void>;
  deleteProduct: (productID: number) => Promise<void>;
}

const useProductStore = create((set): ProductStore => ({
  products: [],

  fetchProducts: async () => {
    await axiosRequest(
      HttpEnum.GET,
      ApiEndpoints.hm_url + ProductosEndpoints.all
    )
      .then((products: ProductI[]) => {
        set({ products });
      })
      .catch((error) => {
        throw new FetchProductsException(
          ProductExceptionMessages.FetchProductsException + error
        );
      });
  },

  addProduct: async (newProduct) => {
    await axiosRequest(
      HttpEnum.POST,
      ApiEndpoints.hm_url + ProductosEndpoints.base,
      {},
      newProduct
    )
      .then((product: ProductI) => {
        set((state) => ({ products: [...state.products, product] }));
      })
      .catch((error) => {
        throw new AddProductException(
          ProductExceptionMessages.AddProductException + error
        );
      });
  },

  deleteProduct: async (productID) => {
    await axiosRequest(
      HttpEnum.DELETE,
      `${ApiEndpoints.hm_url + ProductosEndpoints.base}/${productID}`
    )
      .then(() => {
        set((state) => ({
          products: state.products.filter(
            (product) => product.productID !== productID
          ),
        }));
      })
      .catch((error) => {
        throw new DeleteProductException(
          ProductExceptionMessages.DeleteProductException + error
        );
      });
  },
}));

export default useProductStore;
