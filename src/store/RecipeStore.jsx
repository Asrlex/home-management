import { create } from "zustand";
import { axiosRequest } from "../services/AxiosRequest";
import api_config from "../config/apiconfig";

const useRecetasStore = create((set) => ({
  recetas: [],
  isLoading: false,
  fetchRecetas: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosRequest("GET", api_config.recetas.all);
      set({ recetas: response, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
  crearReceta: async (receta) => {
    try {
      const response = await axiosRequest("POST", api_config.recetas.base, {}, receta);
      set((state) => ({ recetas: [...state.recetas, response] }));
    } catch (error) {
      console.error(error);
    }
  },
  eliminarReceta: async (recetaID) => {
    try {
      await axiosRequest("DELETE", `${api_config.recetas.base}/${recetaID}`);
      set((state) => ({
        recetas: state.recetas.filter((receta) => receta.recipeID !== recetaID),
      }));
    } catch (error) {
      console.error(error);
    }
  },
  addOrRemoveTag: (recetaID, etiquetaID, etiquetas) => {
    set((state) => ({
      recetas: state.recetas.map((receta) => {
        if (receta.recipeID === recetaID) {
          const etiqueta = etiquetas.find((etiqueta) => etiqueta.tagID === etiquetaID);
          if (receta.tags.some((tag) => tag.tagID === etiquetaID)) {
            return {
              ...receta,
              tags: receta.tags.filter((tag) => tag.tagID !== etiquetaID),
            };
          }
          return {
            ...receta,
            tags: [...receta.tags, etiqueta],
          };
        }
        return receta;
      }),
    }));
  },
}));

export default useRecetasStore;
