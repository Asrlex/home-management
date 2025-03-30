import { create } from 'zustand';
import { axiosRequest } from '../services/AxiosRequest';
import api_config from '../config/apiconfig';

const useEtiquetaStore = create((set) => ({
  etiquetas: [],
  etiquetasSeleccionadas: [],

  fetchEtiquetas: async () => {
    try {
      const response = await axiosRequest('GET', api_config.etiquetas.all);
      set({ etiquetas: response });
    } catch (error) {
      console.error('Error fetching etiquetas:', error);
    }
  },

  addEtiqueta: (etiqueta) =>
    set((state) => ({ etiquetas: [...state.etiquetas, etiqueta] })),

  deleteEtiqueta: (tagID) =>
    set((state) => ({
      etiquetas: state.etiquetas.filter((etiqueta) => etiqueta.tagID !== tagID),
    })),

  setEtiquetasSeleccionadas: (etiquetas) => set({ etiquetasSeleccionadas: etiquetas }),

  addToSeleccionadas: (etiqueta) =>
    set((state) => ({
      etiquetasSeleccionadas: [...state.etiquetasSeleccionadas, etiqueta],
    })),

  removeFromSeleccionadas: (tagID) =>
    set((state) => ({
      etiquetasSeleccionadas: state.etiquetasSeleccionadas.filter(
        (etiqueta) => etiqueta.tagID !== tagID
      ),
    })),
}));

export default useEtiquetaStore;