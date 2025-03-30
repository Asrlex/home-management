import { create } from 'zustand';
import { axiosRequest } from '../services/AxiosRequest';
import api_config from '../config/apiconfig';

const useProductStore = create((set) => ({
  products: [],

  fetchProducts: async () => {
    try {
      const response = await axiosRequest('GET', api_config.productos.all);
      set({ products: response });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  },

  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),

  deleteProduct: (productID) =>
    set((state) => ({
      products: state.products.filter((product) => product.productID !== productID),
    })),
}));

export default useProductStore;