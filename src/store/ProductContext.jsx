import { create } from "zustand";
import { axiosRequest } from "../services/AxiosRequest";
import api_config from "../config/apiconfig";

const useProductStore = create((set) => ({
  products: [],

  fetchProducts: async () => {
    await axiosRequest("GET", api_config.productos.all)
      .then((products) => {
        set({ products });
      })
      .catch((error) => {
        throw Error('Error fetching products:', error);
      });
  },

  addProduct: async (newProduct) => {
    await axiosRequest("POST", api_config.productos.base, {}, newProduct)
      .then((product) => {
        set((state) => ({ products: [...state.products, product] }));
      })
      .catch((error) => {
        throw new Error('Error adding product:', error);
      });
  },

  deleteProduct: async (productID) => {
    await axiosRequest(
      "DELETE",
      `${api_config.productos.base}/${productID}`
    ).then(() => {
        set((state) => ({
          products: state.products.filter(
            (product) => product.productID !== productID
          ),
        }));
      })
    .catch((error) => {
      throw new Error('Error deleting product:', error);
    });
    set((state) => ({
      products: state.products.filter(
        (product) => product.productID !== productID
      ),
    }));
  },
}));

export default useProductStore;
