import { useState, useEffect } from "react";
import api_config from "../../config/apiconfig";
import { axiosRequest } from "../../services/AxiosRequest";
import ListaEtiquetas from "../ListaEtiquetas";
import { useContext } from "react";
import { EtiquetaContext } from "../../store/EtiquetaContext";
import Receta from "./Receta";
import { useRef } from "react";
import Modal from "../generic/Modal";
import FAB from "../generic/FloatingButton";
import { FaPlus } from "react-icons/fa";
import NuevaRecetaModal from "./NuevaRecetaModal";
import Loader from "../generic/Loader";

export default function Recetas() {
  const [recetas, setRecetas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { etiquetas, etiquetasSeleccionadas } = useContext(EtiquetaContext);
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
    axiosRequest("DELETE", api_config.recetas.item, { recipeID: recetaID })
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
    axiosRequest("POST", api_config.recetas.base, receta)
      .then(() => {
        setRecetas((prevRecetas) => [...prevRecetas, receta]);
      })
      .catch((error) => {
        console.error(error);
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
          action={() => recetaDialogRef.current.open()}
          classes="floatingButton"
        />
      </div>
    </>
  );
}
