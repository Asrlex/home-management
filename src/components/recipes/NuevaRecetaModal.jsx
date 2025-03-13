import React, { useState, useRef, useContext, useEffect } from "react";
import Select from "react-select";
import { ProductContext } from "../../store/product-context";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import { customStyles } from "../generic/ModalStyle";

export default function NuevaRecetaModal({ crearReceta, closeModal, receta }) {
  const { products } = useContext(ProductContext);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [stepOrder, setStepOrder] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingIngredientIndex, setEditingIngredientIndex] = useState(null);
  const [editingStepIndex, setEditingStepIndex] = useState(null);

  const recipeNameRef = useRef();
  const recipeDescriptionRef = useRef();
  const ingredientAmountRef = useRef();
  const ingredientUnitRef = useRef();
  const stepNameRef = useRef();
  const stepDescriptionRef = useRef();

  useEffect(() => {
    if (receta) {
      recipeNameRef.current.value = receta.recipeName;
      recipeDescriptionRef.current.value = receta.recipeDescription;
      setIngredients(receta.ingredients);
      setSteps(receta.steps);
      setStepOrder(receta.steps.length + 1);
    }
  }, [receta]);

  const productOptions = products.map((product) => ({
    value: product.productID,
    label: product.productName,
  }));

  const addIngredient = () => {
    const newIngredient = {
      recipeID: null,
      productID: selectedProduct,
      recipeIngredientAmount: ingredientAmountRef.current.value,
      recipeIngredientUnit: ingredientUnitRef.current.value,
    };

    if (editingIngredientIndex !== null) {
      const updatedIngredients = [...ingredients];
      updatedIngredients[editingIngredientIndex] = newIngredient;
      setIngredients(updatedIngredients);
      setEditingIngredientIndex(null);
    } else {
      setIngredients([...ingredients, newIngredient]);
    }

    setSelectedProduct(null);
    ingredientAmountRef.current.value = "";
    ingredientUnitRef.current.value = "";
  };

  const editIngredient = (index) => {
    const ingredient = ingredients[index];
    setSelectedProduct(ingredient.productID);
    ingredientAmountRef.current.value = ingredient.recipeIngredientAmount;
    ingredientUnitRef.current.value = ingredient.recipeIngredientUnit;
    setEditingIngredientIndex(index);
  };

  const deleteIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  const addStep = () => {
    const newStep = {
      recipeID: null,
      recipeStepName: stepNameRef.current.value,
      recipeStepDescription: stepDescriptionRef.current.value,
      recipeStepOrder: stepOrder,
    };
  
    if (editingStepIndex !== null) {
      const updatedSteps = [...steps];
      newStep.recipeStepOrder = updatedSteps[editingStepIndex].recipeStepOrder;
      updatedSteps[editingStepIndex] = newStep;
      setSteps(updatedSteps);
      setEditingStepIndex(null);
    } else {
      setSteps([...steps, newStep]);
      setStepOrder(stepOrder + 1);
    }
  
    stepNameRef.current.value = "";
    stepDescriptionRef.current.value = "";
  };
  
  const deleteStep = (index) => {
    const updatedSteps = steps.filter((_, i) => i !== index);
    const reorderedSteps = updatedSteps.map((step, i) => ({
      ...step,
      recipeStepOrder: i + 1,
    }));
    setSteps(reorderedSteps);
    setStepOrder(reorderedSteps.length + 1);
  };
  
  const editStep = (index) => {
    const step = steps[index];

    stepNameRef.current.value = step.recipeStepName;
    stepDescriptionRef.current.value = step.recipeStepDescription;
    setEditingStepIndex(index);
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
    setSelectedProduct(null);
    setEditingIngredientIndex(null);
    setEditingStepIndex(null);
    closeModal();
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
            {editingIngredientIndex !== null
              ? "Guardar Ingrediente"
              : "Añadir Ingrediente"}
          </button>
        </div>
        {ingredients.length > 0 && (
          <>
            <div className="modalSubSubtitulo">Lista de ingredientes</div>
            <div className="modalLista scrollableTextarea">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="modalListaItem">
                  <span>
                    <strong>{receta ? ingredient.product.productName : ingredient.productID.label}</strong>:{" "}
                    {ingredient.recipeIngredientAmount}{" "}
                    {ingredient.recipeIngredientUnit}
                  </span>
                  <span>
                    <button onClick={() => editIngredient(index)}>
                      <AiOutlineEdit />
                    </button>
                    <button onClick={() => deleteIngredient(index)}>
                      <AiFillDelete />
                    </button>
                  </span>
                </div>
              ))}
            </div>
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
            {editingStepIndex !== null ? "Guardar Paso" : "Añadir Paso"}
          </button>
        </div>
        {steps.length > 0 && (
          <>
            <div className="modalSubSubtitulo">Lista de pasos</div>
            <div className="modalLista scrollableTextarea">
              {steps.map((step, index) => (
                <div key={index} className="modalListaItem">
                  <span>
                    <strong>
                      {step.recipeStepOrder}. {step.recipeStepName}
                    </strong>
                    : {step.recipeStepDescription}
                  </span>
                  <span>
                    <button onClick={() => editStep(index)}>
                      <AiOutlineEdit />
                    </button>
                    <button onClick={() => deleteStep(index)}>
                      <AiFillDelete />
                    </button>
                  </span>
                </div>
              ))}
            </div>
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
