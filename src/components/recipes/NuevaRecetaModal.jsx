import React, { useState, useRef, useContext } from "react";
import Select from "react-select";
import { ProductContext } from "../../store/product-context";
import { max } from "class-validator";

export default function NuevaRecetaModal({ crearReceta }) {
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [stepOrder, setStepOrder] = useState(1);
  const { products } = useContext(ProductContext);

  const recipeNameRef = useRef();
  const recipeDescriptionRef = useRef();
  const ingredientAmountRef = useRef();
  const ingredientUnitRef = useRef();
  const stepNameRef = useRef();
  const stepDescriptionRef = useRef();

  const [selectedProduct, setSelectedProduct] = useState(null);

  const productOptions = products.map((product) => ({
    value: product.productID,
    label: product.productName,
  }));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "var(--modal-input-bg-color)",
      borderColor: "var(--border-color)",
      color: "var(--text-color)",
      boxShadow: "none",
      "&:hover": { borderColor: "var(--border-color)" },
      maxHeight: "40px",
    }),
    input: (provided) => ({ ...provided, color: "var(--text-color)" }),
    placeholder: (provided) => ({
      ...provided,
      color: "var(--context-no-content-bg-color)",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "var(--modal-button-text-color)",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 10500,
      maxHeight: "350px",
      overflowY: "auto",
      backgroundColor: "var(--modal-button-bg-color)",
      color: "var(--modal-button-text-color)",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "var(--modal-button-bg-color)"
        : state.isFocused
        ? "var(--modal-button-hover-bg-color)"
        : "var(--modal-button-bg-color)",
      color: "var(--modal-button-text-color)",
      "&:hover": {
        backgroundColor: "var(--modal-button-hover-bg-color)",
      },
    }),
  };

  const addIngredient = () => {
    const newIngredient = {
      recipeID: null,
      productID: selectedProduct,
      recipeIngredientAmount: ingredientAmountRef.current.value,
      recipeIngredientUnit: ingredientUnitRef.current.value,
    };
    setIngredients([...ingredients, newIngredient]);
    setSelectedProduct(null);
    ingredientAmountRef.current.value = "";
    ingredientUnitRef.current.value = "";
  };

  const addStep = () => {
    const newStep = {
      recipeID: null,
      recipeStepName: stepNameRef.current.value,
      recipeStepDescription: stepDescriptionRef.current.value,
      recipeStepOrder: stepOrder,
    };
    setSteps([...steps, newStep]);
    setStepOrder(stepOrder + 1);
    stepNameRef.current.value = "";
    stepDescriptionRef.current.value = "";
  };

  const limpiarCampos = () => {
    recipeNameRef.current.value = "";
    recipeDescriptionRef.current.value = "";
    ingredientAmountRef.current.value = "";
    ingredientUnitRef.current.value = "";
    stepNameRef.current.value = "";
    stepDescriptionRef.current.value = "";
    setIngredients([]);
    setSteps([]);
    setStepOrder(1);
  };

  return (
    <div>
      <h1 className="modalTitulo">Nueva Receta</h1>
      <div className="modalSeparator">
        <input
          type="text"
          ref={recipeNameRef}
          className="modalInput"
          placeholder="Nombre de la receta"
        />
      </div>
      <div className="modalSeparator">
        <textarea
          ref={recipeDescriptionRef}
          placeholder="Descripción"
          className="modalInput modalTextArea"
        />
      </div>
      <hr className="modalDivider" />
      <div className="modalSection">
        <h2 className="modalSubtitulo">Ingredientes</h2>
        <Select
          options={productOptions}
          value={selectedProduct}
          onChange={setSelectedProduct}
          placeholder="Seleccionar producto"
          styles={customStyles}
          isSearchable
          className="modalSelect"
        />
        <input
          type="number"
          placeholder="Cantidad"
          ref={ingredientAmountRef}
          className="modalInputSmall"
        />
        <input
          type="text"
          placeholder="Unidad"
          ref={ingredientUnitRef}
          className="modalInputSmall"
        />
        <div className="modalSeparator">
          <button onClick={addIngredient} className="modalBoton">
            Añadir Ingrediente
          </button>
        </div>
        {ingredients.length > 0 && (
          <>
            <p className="modalSubSubtitulo">Lista de ingredientes</p>
            <ul className="modalLista scrollableTextarea">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="modalListaItem">
                  <strong>{ingredient.productID.label}</strong>{" "}
                  {ingredient.recipeIngredientAmount} {ingredient.recipeIngredientUnit}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <hr className="modalDivider" />
      <div className="modalSection">
        <h2 className="modalSubtitulo">Pasos</h2>
        <div className="modalSeparator">
          <input
            type="text"
            placeholder="Nombre del paso"
            ref={stepNameRef}
            className="modalInput"
          />
        </div>
        <div className="modalSeparator">
          <textarea
            placeholder="Descripción del paso"
            ref={stepDescriptionRef}
            className="modalInput modalTextArea scrollableTextarea"
          />
        </div>
        <div className="modalSeparator">
          <button onClick={addStep} className="modalBoton">
            Añadir Paso
          </button>
        </div>
        {steps.length > 0 && (
          <>
            <p className="modalSubSubtitulo">Lista de pasos</p>
            <ol className="modalLista scrollableTextarea">
              {steps.map((step, index) => (
                <li key={index} className="modalListaItem">
                  <strong>
                    {step.recipeStepOrder}. {step.recipeStepName}
                  </strong>
                  : {step.recipeStepDescription}
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
      <hr className="modalDivider" />
      <div className="modalSeparator">
        <div className="flex justify-center gap-4">
          <button
            className="modalBoton"
            onClick={() =>
              crearReceta({
                recipeName: recipeNameRef.current.value,
                recipeDescription: recipeDescriptionRef.current.value,
                ingredients: ingredients,
                steps: steps,
              })
            }
          >
            Crear Receta
          </button>
          <button className="modalBoton" onClick={limpiarCampos}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
