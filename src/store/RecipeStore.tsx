import { create } from 'zustand';
import { axiosRequest } from '../hooks/useAxiosRequest';
import { RecipeDetailI, TagI } from '@/entities/types/home-management.entity';
import { CreateRecipeDto } from '@/entities/dtos/recipe.dto';
import { HttpEnum } from '@/entities/enums/http.enum';
import { ApiEndpoints, RecetasEndpoints } from '@/config/apiconfig';
import {
  AddRecipeException,
  DeleteRecipeException,
  FetchRecipesException,
  UpdateRecipeException,
} from '@/common/exceptions/recipes.exception';
import { RecipeExceptionMessages } from '@/common/exceptions/entities/enums/recipe-exception.enum';

interface RecipeStore {
  recetas: RecipeDetailI[];
  isLoading: boolean;
  fetchRecetas: () => Promise<void>;
  crearReceta: (receta: CreateRecipeDto) => Promise<void>;
  editarReceta: (recetaID: number, receta: CreateRecipeDto) => Promise<void>;
  eliminarReceta: (recetaID: number) => Promise<void>;
  addOrRemoveTag: (
    recetaID: number,
    etiquetaID: number,
    etiquetas: TagI[]
  ) => void;
}

const useRecetasStore = create(
  (set): RecipeStore => ({
    recetas: [],
    isLoading: false,

    fetchRecetas: async () => {
      set({ isLoading: true });
      await axiosRequest(
        HttpEnum.GET,
        ApiEndpoints.hm_url + RecetasEndpoints.all
      )
        .then((response) =>
          set({ recetas: response.data as RecipeDetailI[], isLoading: false })
        )
        .catch((error) => {
          set({ isLoading: false });
          throw new FetchRecipesException(
            RecipeExceptionMessages.FetchRecipesException + error
          );
        });
    },

    crearReceta: async (receta) =>
      await axiosRequest(
        HttpEnum.POST,
        ApiEndpoints.hm_url + RecetasEndpoints.base,
        {},
        receta
      )
        .then((response) => {
          set((state: RecipeStore) => ({
            recetas: [...state.recetas, response.data as RecipeDetailI],
          }));
        })
        .catch((error) => {
          throw new AddRecipeException(
            RecipeExceptionMessages.AddRecipeException + error
          );
        }),

    editarReceta: async (recetaID, receta) =>
      await axiosRequest(
        HttpEnum.PUT,
        `${ApiEndpoints.hm_url + RecetasEndpoints.base}/${recetaID}`,
        {},
        receta
      )
        .then((response) => {
          set((state: RecipeStore) => ({
            recetas: state.recetas.map((receta) =>
              receta.recipeID === recetaID
                ? (response.data as RecipeDetailI)
                : receta
            ),
          }));
        })
        .catch((error) => {
          throw new UpdateRecipeException(
            RecipeExceptionMessages.UpdateRecipeException + error
          );
        }),

    eliminarReceta: async (recetaID: number) => {
      await axiosRequest(
        HttpEnum.DELETE,
        `${ApiEndpoints.hm_url + RecetasEndpoints.base}/${recetaID}`
      )
        .then(() => {
          set((state) => ({
            recetas: state.recetas.filter(
              (receta) => receta.recipeID !== recetaID
            ),
          }));
        })
        .catch((error) => {
          throw new DeleteRecipeException(
            RecipeExceptionMessages.DeleteRecipeException + error
          );
        });
    },

    addOrRemoveTag: (
      recetaID: number,
      etiquetaID: number,
      etiquetas: TagI[]
    ) => {
      set((state: RecipeStore) => ({
        recetas: state.recetas.map((receta) => {
          if (receta.recipeID === recetaID) {
            const etiqueta = etiquetas.find(
              (etiqueta) => etiqueta.tagID === etiquetaID
            );
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
  })
);

export default useRecetasStore;
