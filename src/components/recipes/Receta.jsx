import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Chip from "@mui/material/Chip";
import { useRef, useContext } from "react";
import { ContextMenu } from "primereact/contextmenu";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaTag } from "react-icons/fa";
import { EtiquetaContext } from "../../store/etiqueta-context";
import { axiosRequest } from "../../utils/axiosUtils";
import api_config from "../../config/apiconfig";
import React from "react";

function Receta({ receta, handleEliminar, addOrRemoveTag }) {
  const contextMenuRef = useRef(null);
  const { etiquetas } = useContext(EtiquetaContext);

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

  return (
    <>
      <ContextMenu
        className="customContextMenu"
        model={contextModel}
        ref={contextMenuRef}
      />
      <Accordion
        key={receta.recipeID}
        sx={{ backgroundColor: "var(--item-bg-color)", padding: "0.75rem" }}
        className="receta"
        onContextMenu={(e) => {
          e.preventDefault();
          contextMenuRef.current.show(e);
        }}
      >
        <AccordionSummary
          className="tituloReceta"
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
          <Typography
            component="span"
            classes={{ root: "flex items-center" }}
            sx={{
              backgroundColor: "var(--item-bg-color)",
              padding: "0.5rem 0",
            }}
          >
            <span className="recetaName">{receta.recipeName}</span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: "0.5rem" }}>
          <div className={`recetaDesc`}>{receta.recipeDescription}</div>
          <div className="recetaTags">
            {receta.tags.map((tag) => (
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
            <ul className="contenidoSeccionReceta">
              {receta.ingredients.map((ingrediente) => (
                <li key={ingrediente.recipeIngredientID}>
                  <span>
                    <strong>{ingrediente.product.productName}</strong>:{" "}
                    {ingrediente.recipeIngredientAmount}{" "}
                    {ingrediente.recipeIngredientUnit}
                    {ingrediente.recipeIngredientIsOptional && " (opcional)"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="recetaSteps">
            <span className="tituloSeccionReceta">Pasos</span>
            <ol className="contenidoSeccionReceta">
              {receta.steps
                .sort((a, b) => a.recipeStepOrder - b.recipeStepOrder)
                .map((paso) => (
                  <li key={paso.recipeStepID}>
                    <strong>
                      {paso.recipeStepOrder}. {paso.recipeStepName}
                    </strong>
                    : {paso.recipeStepDescription}
                  </li>
                ))}
            </ol>
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default React.memo(Receta);
