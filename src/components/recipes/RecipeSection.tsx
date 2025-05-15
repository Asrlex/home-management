import useRecetasStore from '../../store/RecipeStore';
import useEtiquetaStore from '../../store/TagStore';
import Receta from './Recipe';
import { useRef, useEffect } from 'react';
import Modal from '../generic/Modal';
import FAB from '../generic/FloatingButton';
import { FaPlus } from 'react-icons/fa';
import NuevaRecetaModal from './RecipeModal';
import Loader from '../generic/Loader';
import ListaEtiquetas from '../tags/TagSection';
import React from 'react';

export default function Recetas() {
  const recetas = useRecetasStore((state) => state.recetas);
  const isLoading = useRecetasStore((state) => state.isLoading);
  const fetchRecetas = useRecetasStore((state) => state.fetchRecetas);
  const eliminarReceta = useRecetasStore((state) => state.eliminarReceta);
  const addOrRemoveTag = useRecetasStore((state) => state.addOrRemoveTag);
  const etiquetas = useEtiquetaStore((state) => state.etiquetas);
  const etiquetasSeleccionadas = useEtiquetaStore(
    (state) => state.etiquetasSeleccionadas
  );
  const recetaDialogRef = useRef(null);

  useEffect(() => {
    fetchRecetas();
  }, [fetchRecetas]);

  return (
    <>
      <Modal ref={recetaDialogRef}>
        <NuevaRecetaModal
          closeModal={() => recetaDialogRef.current.close()}
          receta={null}
        />
      </Modal>
      <ListaEtiquetas tipo="Recipe" />
      {isLoading ? (
        <Loader />
      ) : (
        <div className="recetas">
          {recetas
            .filter((receta) => {
              if (etiquetasSeleccionadas.length === 0) return true;
              return etiquetasSeleccionadas.some((etiqueta) =>
                receta.tags.some(
                  (recEtiqueta) => recEtiqueta.tagID === etiqueta.tagID
                )
              );
            })
            .map((receta) => (
              <Receta
                key={receta.recipeID}
                receta={receta}
                handleEliminar={eliminarReceta}
                addOrRemoveTag={(recetaID, etiquetaID) =>
                  addOrRemoveTag(recetaID, etiquetaID, etiquetas)
                }
              />
            ))}
        </div>
      )}
      <div className="seccionBotones">
        <FAB
          icon={<FaPlus />}
          action={() => recetaDialogRef.current.open()}
          classes="floatingButton"
        />
      </div>
    </>
  );
}
