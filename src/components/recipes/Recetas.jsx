import useRecetasStore from "../../store/RecipeStore";
import useEtiquetaStore from "../../store/TagContext";
import Receta from "./Receta";
import { useRef, useEffect } from "react";
import Modal from "../generic/Modal";
import FAB from "../generic/FloatingButton";
import { FaPlus } from "react-icons/fa";
import NuevaRecetaModal from "./NuevaRecetaModal";
import Loader from "../generic/Loader";
import ListaEtiquetas from "../ListaEtiquetas";

export default function Recetas() {
  const { recetas, isLoading, fetchRecetas, eliminarReceta, addOrRemoveTag } =
    useRecetasStore();
  const etiquetas = useEtiquetaStore((state) => state.etiquetas);
  const etiquetasSeleccionadas = useEtiquetaStore(
    (state) => state.etiquetasSeleccionadas
  );
  const recetaDialogRef = useRef();

  useEffect(() => {
    fetchRecetas();
  }, [fetchRecetas]);

  return (
    <>
      <Modal ref={recetaDialogRef}>
        <NuevaRecetaModal closeModal={() => recetaDialogRef.current.close()} />
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
