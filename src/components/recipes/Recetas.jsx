import { useState, useEffect } from "react";
import api_config from "../../config/apiconfig";
import { axiosRequest } from "../../services/AxiosRequest";
import ListaEtiquetas from "../ListaEtiquetas";
import useEtiquetaStore from "../../store/TagContext";
import Receta from "./Receta";
import { useRef } from "react";
import Modal from "../generic/Modal";
import FAB from "../generic/FloatingButton";
import { FaPlus } from "react-icons/fa";
import NuevaRecetaModal from "./NuevaRecetaModal";
import Loader from "../generic/Loader";
import useProductStore from "../../store/ProductContext";
import toast from "react-hot-toast";

export default function Recetas() {
  const [recetas, setRecetas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const etiquetas = useEtiquetaStore((state) => state.etiquetas);
  const etiquetasSeleccionadas = useEtiquetaStore(
    (state) => state.etiquetasSeleccionadas
  );
  const recetaDialogRef = useRef();

  useEffect(() => {
    axiosRequest("GET", api_config.recetas.names)
      .then((response) => {
        setRecetas(response);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  const handleEliminar = (recetaID) => {
    axiosRequest("DELETE", `${api_config.recetas.base}/${recetaID}`)
      .then(() => {
        setRecetas((prevRecetas) => {
          return prevRecetas.filter((receta) => receta.recipeID !== recetaID);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEtiquetas = (recetaID, etiquetaID) => {
    setRecetas((prevRecetas) => {
      const etiqueta = etiquetas.find(
        (etiqueta) => etiqueta.tagID === etiquetaID
      );
      return prevRecetas.map((receta) => {
        if (receta.recipeID === recetaID) {
          if (
            receta.tags.some((recEtiqueta) => recEtiqueta.tagID === etiquetaID)
          ) {
            return {
              ...receta,
              tags: receta.tags.filter(
                (recEtiqueta) => recEtiqueta.tagID !== etiquetaID
              ),
            };
          }
          return {
            ...receta,
            tags: [...receta.tags, etiqueta],
          };
        }
        return receta;
      });
    });
  };

  const crearReceta = (receta) => {
    axiosRequest("POST", api_config.recetas.base, {}, receta)
      .then(() => {
        setRecetas((prevRecetas) => [...prevRecetas, receta]);
        recetaDialogRef.current.close();
        toast.success("Receta creada con éxito");
      })
      .catch((error) => {
        console.error(error);
        recetaDialogRef.current.close();
        toast.error("Error al crear la receta");
      });
  };

  const popupReceta = (
    <Modal ref={recetaDialogRef}>
      <NuevaRecetaModal
        crearReceta={crearReceta}
        closeModal={() => recetaDialogRef.current.close()}
      />
    </Modal>
  );

  return (
    <>
      {popupReceta}
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
                handleEliminar={handleEliminar}
                addOrRemoveTag={handleEtiquetas}
              />
            ))}
        </div>
      )}
      <div className="seccionBotones">
        <FAB
          icon={<FaPlus />}
          action={() => {
            fetchProducts();
            recetaDialogRef.current.open();
          }}
          classes="floatingButton"
        />
      </div>
    </>
  );
}
