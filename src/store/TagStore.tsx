import { create } from 'zustand';
import { axiosRequest } from '../hooks/useAxiosRequest';
import { TagI } from '@/entities/types/home-management.entity';
import {
  FetchTagsException,
  AddTagException,
  SetSelectedTagsException,
  AddTagToSelectedException,
  RemoveTagFromSelectedException,
  AddItemTagException,
} from '@/common/exceptions/tag.exceptions';
import { TagExceptionMessages } from '@/common/exceptions/entities/enums/tag-exception.enum';
import { HttpEnum } from '@/entities/enums/http.enum';
import { CreateItemTagDto, CreateTagDto } from '@/entities/dtos/tag.dto';
import { ApiEndpoints, EtiquetasEndpoints } from '@/config/apiconfig';

interface EtiquetaStore {
  etiquetas: TagI[];
  etiquetasSeleccionadas: TagI[];
  fetchEtiquetas: () => Promise<void>;
  addEtiqueta: (dto: CreateTagDto) => void;
  deleteEtiqueta: (tagID: number) => void;
  setEtiquetasSeleccionadas: (etiquetas: TagI[]) => void;
  addToSeleccionadas: (etiqueta: TagI) => void;
  removeFromSeleccionadas: (tagID: number) => void;
  addItemTag: (dto: CreateItemTagDto) => Promise<void>;
  deleteItemTag: (dto: CreateItemTagDto) => Promise<void>;
}

const useEtiquetaStore = create(
  (set): EtiquetaStore => ({
    etiquetas: [],
    etiquetasSeleccionadas: [],

    fetchEtiquetas: async () =>
      await axiosRequest(
        HttpEnum.GET,
        ApiEndpoints.hm_url + EtiquetasEndpoints.all
      )
        .then((response) => {
          set({ etiquetas: response.data as TagI[] });
        })
        .catch((error) => {
          throw new FetchTagsException(
            TagExceptionMessages.FetchTagsException + error
          );
        }),

    addEtiqueta: async (dto: CreateTagDto) =>
      await axiosRequest(
        HttpEnum.POST,
        ApiEndpoints.hm_url + EtiquetasEndpoints.base,
        {},
        dto
      )
        .then((response) => {
          set((state) => ({
            etiquetas: [...state.etiquetas, response.data as TagI],
          }));
        })
        .catch((error) => {
          throw new AddTagException(
            TagExceptionMessages.AddTagException + error
          );
        }),

    deleteEtiqueta: (tagID: number) =>
      axiosRequest(
        HttpEnum.DELETE,
        `${ApiEndpoints.hm_url + EtiquetasEndpoints.base}/${tagID}`
      )
        .then(() => {
          set((state) => ({
            etiquetas: state.etiquetas.filter(
              (etiqueta) => etiqueta.tagID !== tagID
            ),
          }));
        })
        .catch((error) => {
          throw new AddTagException(
            TagExceptionMessages.DeleteTagException + error
          );
        }),

    setEtiquetasSeleccionadas: (etiquetas: TagI[]) => {
      try {
        set({ etiquetasSeleccionadas: etiquetas });
      } catch (error) {
        throw new SetSelectedTagsException(
          TagExceptionMessages.SetSelectedTagsException + error
        );
      }
    },

    addToSeleccionadas: (etiqueta: TagI) => {
      try {
        set((state) => ({
          etiquetasSeleccionadas: [...state.etiquetasSeleccionadas, etiqueta],
        }));
      } catch (error) {
        throw new AddTagToSelectedException(
          TagExceptionMessages.SetSelectedTagsException + error
        );
      }
    },

    removeFromSeleccionadas: (tagID: number) => {
      try {
        set((state) => ({
          etiquetasSeleccionadas: state.etiquetasSeleccionadas.filter(
            (etiqueta) => etiqueta.tagID !== tagID
          ),
        }));
      } catch (error) {
        throw new RemoveTagFromSelectedException(
          TagExceptionMessages.SetSelectedTagsException + error
        );
      }
    },

    addItemTag: async (dto: CreateItemTagDto) => {
      await axiosRequest(
        HttpEnum.POST,
        ApiEndpoints.hm_url + EtiquetasEndpoints.item,
        {},
        dto
      ).catch((error) => {
        throw new AddItemTagException(
          TagExceptionMessages.AddItemTagException + error
        );
      });
    },

    deleteItemTag: async (dto: CreateItemTagDto) => {
      await axiosRequest(
        HttpEnum.DELETE,
        ApiEndpoints.hm_url + EtiquetasEndpoints.item,
        {},
        dto
      ).catch((error) => {
        throw new AddTagException(
          TagExceptionMessages.AddItemTagException + error
        );
      });
    },
  })
);

export default useEtiquetaStore;
