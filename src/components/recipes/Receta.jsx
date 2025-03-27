import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Chip from "@mui/material/Chip";
import { useRef, useContext, useState, useEffect } from "react";
import { ContextMenu } from "primereact/contextmenu";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaTag } from "react-icons/fa";
import { EtiquetaContext } from "../../store/EtiquetaContext";
import { axiosRequest } from "../../services/AxiosRequest";
import api_config from "../../config/apiconfig";
import React from "react";
import Modal from "../generic/Modal";
import NuevaRecetaModal from "./NuevaRecetaModal";
import Loader from "../generic/Loader";

function Receta({ receta, handleEliminar, addOrRemoveTag }) {
  const contextMenuRef = useRef(null);
  const { etiquetas } = useContext(EtiquetaContext);
  const [selectedReceta, setSelectedReceta] = useState(null);
  const recetaDialogRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [fullReceta, setFullReceta] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const addOrRemoveEtiqueta = (etiqueta_id, id) => {
    const body = {
      tagID: etiqueta_id,
      itemID: id,
    };

    if (receta.tags?.some((recEtiqueta) => recEtiqueta.tagID === etiqueta_id)) {
      axiosRequest("DELETE", api_config.etiquetas.item, {}, body)
        .then(() => {
          addOrRemoveTag(id, etiqueta_id);
        })
        .catch((error) => {
          console.error(error);
        });
      return;
    }
    axiosRequest("POST", api_config.etiquetas.item, {}, body)
      .then(() => {
        axiosRequest("GET", api_config.lista_compra.all)
          .then((response) => {
            addOrRemoveTag(id, etiqueta_id);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const contextModel = [
    {
      label: "Eliminar",
      icon: <RiDeleteBinLine className="me-2 w-3 h-3" />,
      command: () => handleEliminar(receta.recipeID),
    },
    {
      label: "Editar",
      icon: <FaTag className="me-2 w-3 h-3" />,
      command: () => handleEditar(receta),
    },
    {
      label: "Etiquetas",
      icon: <FaTag className="me-2 w-3 h-3" />,
      items: etiquetas
        .filter((etiqueta) => etiqueta.tagType === "Recipe")
        .map((etiqueta) => ({
          label: receta.tags?.some(
            (recEtiqueta) => recEtiqueta.tagID === etiqueta.tagID
          )
            ? `${etiqueta.tagName} ✅`
            : `${etiqueta.tagName}`,
          icon: <FaTag className="me-2 w-3 h-3" />,
          command: () => addOrRemoveEtiqueta(etiqueta.tagID, receta.recipeID),
        })),
    },
  ];

  const popupReceta = (
    <Modal ref={recetaDialogRef}>
      <NuevaRecetaModal
        crearReceta={null}
        closeModal={() => recetaDialogRef.current.close()}
        receta={selectedReceta}
      />
    </Modal>
  );

  const handleEditar = (receta) => {
    setSelectedReceta(receta);
    recetaDialogRef.current.open();
  };

  const handleExpand = () => {
    if (!fullReceta) {
      setIsLoading(true);
      axiosRequest("GET", `${api_config.recetas.byID}${receta.recipeID}`)
        .then((response) => {
          setFullReceta(response);
          setIsLoading(false);
          setIsExpanded(true);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="recetaDiv">
      {popupReceta}
      <ContextMenu
        className="customContextMenu"
        model={contextModel}
        ref={contextMenuRef}
      />
      <Accordion
        key={receta.recipeID}
        sx={{ backgroundColor: "var(--item-bg-color)" }}
        className="receta"
        onContextMenu={(e) => {
          e.preventDefault();
          contextMenuRef.current.show(e);
        }}
        expanded={isExpanded}
        onChange={handleExpand}
      >
        <AccordionSummary
          className="tituloReceta"
          component={"div"}
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${receta.recipeID}-content`}
          id={`${receta.recipeID}-header`}
          sx={{
            backgroundColor: "var(--item-bg-color)",
            padding: "0 0.5rem",
            margin: "0",
            minHeight: "0px",
            ".MuiAccordionSummary-content": { margin: 0 },
          }}
        >
          <span className="recetaName">{receta.recipeName}</span>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: "0.5rem" }} component={"div"}>
          {isLoading ? (
            <Loader />
          ) : fullReceta ? (
            <>
              <div className={`recetaDesc`}>{fullReceta.recipeDescription}</div>
              <div className="recetaTags">
                {fullReceta.tags.map((tag) => (
                  <Chip
                    key={tag.tagID}
                    label={tag.tagName}
                    className="tagPill"
                    sx={{
                      fontSize: "0.70rem",
                      padding: "0.1rem",
                      color: "var(--recipe-section-content-color)",
                      borderColor: "var(--recipe-section-content-color)",
                      border: "1px solid",
                    }}
                  />
                ))}
              </div>
              <div className="recetaIngredients">
                <span className="tituloSeccionReceta">Ingredientes</span>
                <div className="contenidoSeccionReceta">
                  {fullReceta.ingredients.map((ingrediente) => (
                    <div key={ingrediente.recipeIngredientID}>
                      <span>
                        <strong>{ingrediente.product.productName}</strong>:{" "}
                        {ingrediente.recipeIngredientAmount}{" "}
                        {ingrediente.recipeIngredientUnit}
                        {ingrediente.recipeIngredientIsOptional &&
                          " (opcional)"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="recetaSteps">
                <span className="tituloSeccionReceta">Pasos</span>
                <div className="contenidoSeccionReceta">
                  {fullReceta.steps
                    .sort((a, b) => a.recipeStepOrder - b.recipeStepOrder)
                    .map((paso) => (
                      <div key={paso.recipeStepID}>
                        <strong>
                          {paso.recipeStepOrder}. {paso.recipeStepName}
                        </strong>
                        : {paso.recipeStepDescription}
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <div>No se pudo cargar la receta.</div>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default React.memo(Receta);
