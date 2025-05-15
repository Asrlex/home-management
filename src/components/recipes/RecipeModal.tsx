import { useState, useRef, useEffect } from 'react';
import Select from 'react-select';
import useProductStore from '../../store/ProductStore';
import { AiFillDelete, AiOutlineEdit } from 'react-icons/ai';
import { customStyles } from '../../styles/SelectStyles';
import useRecetasStore from '../../store/RecipeStore';
import toast from 'react-hot-toast';
import React from 'react';
import { CreateRecipeDto } from '@/entities/dtos/recipe.dto';
import { RecipeDetailI } from '@/entities/types/home-management.entity';

interface NuevaRecetaModalProps {
  closeModal: () => void;
  receta?: RecipeDetailI;
}

const NuevaRecetaModal: React.FC<NuevaRecetaModalProps> = ({
  closeModal,
  receta,
}) => {
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const crearReceta = useRecetasStore((state) => state.crearReceta);
  const editarReceta = useRecetasStore((state) => state.editarReceta);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [stepOrder, setStepOrder] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingIngredientIndex, setEditingIngredientIndex] = useState(null);
  const [editingStepIndex, setEditingStepIndex] = useState(null);
  const recipeNameRef = useRef<HTMLInputElement>(null);
  const recipeDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const ingredientAmountRef = useRef<HTMLInputElement>(null);
  const ingredientUnitRef = useRef<HTMLInputElement>(null);
  const stepNameRef = useRef<HTMLInputElement>(null);
  const stepDescriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (receta) {
      fetchProducts();
      recipeNameRef.current.value = receta.recipeName;
      recipeDescriptionRef.current.value = receta.recipeDescription;
      setIngredients(receta.ingredients);
      setSteps(receta.steps);
      setStepOrder(receta.steps.length + 1);
    }
  }, [fetchProducts, receta]);

  const productOptions = products
    .sort((a, b) => a.productName.localeCompare(b.productName))
    .map((product) => ({
      value: product.productID,
      label: product.productName,
    }));

  const addIngredient = () => {
    const newIngredient = {
      recipeID: receta ? receta.recipeID : null,
      product: {
        productID: selectedProduct.value,
        productName: selectedProduct.label,
      },
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
    ingredientAmountRef.current.value = '';
    ingredientUnitRef.current.value = '';
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
      recipeID: receta ? receta.recipeID : null,
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

    stepNameRef.current.value = '';
    stepDescriptionRef.current.value = '';
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
    recipeNameRef.current.value = '';
    recipeDescriptionRef.current.value = '';
    ingredientAmountRef.current.value = '';
    ingredientUnitRef.current.value = '';
    stepNameRef.current.value = '';
    stepDescriptionRef.current.value = '';
    setIngredients([]);
    setSteps([]);
    setStepOrder(1);
    setSelectedProduct(null);
    setEditingIngredientIndex(null);
    setEditingStepIndex(null);
    closeModal();
  };

  const handleCreateReceta = () => {
    if (!recipeNameRef.current.value || !recipeDescriptionRef.current.value) {
      toast.error('Por favor, completa todos los campos obligatorios.');
      return;
    }
    if (ingredients.length === 0) {
      toast.error('Por favor, añade al menos un ingrediente.');
      return;
    }
    if (steps.length === 0) {
      toast.error('Por favor, añade al menos un paso.');
      return;
    }
    const newReceta: CreateRecipeDto = {
      recipeName: recipeNameRef.current.value,
      recipeDescription: recipeDescriptionRef.current.value,
      ingredients: ingredients,
      steps: steps,
    };

    if (receta) {
      const updatedReceta = {
        ...newReceta,
        recipeID: receta.recipeID,
      };
      editarReceta(receta.recipeID, updatedReceta);
    } else {
      crearReceta(newReceta);
    }
    limpiarCampos();
    toast.success('Receta creada con éxito');
  };

  return (
    <>
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
        <div className="modalParallelInputs">
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
        </div>
        <div className="modalSeparator">
          <button onClick={addIngredient} className="modalBoton">
            {editingIngredientIndex !== null
              ? 'Guardar Ingrediente'
              : 'Añadir Ingrediente'}
          </button>
        </div>
        {ingredients.length > 0 && (
          <>
            <div className="modalSubSubtitulo">Lista de ingredientes</div>
            <div className="modalLista scrollableTextarea">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="modalListaItem">
                  <span>
                    <strong>{ingredient.product.productName}</strong>:{' '}
                    {ingredient.recipeIngredientAmount}{' '}
                    {ingredient.recipeIngredientUnit}
                  </span>
                  <span className="modalListaItemButtons">
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
            {editingStepIndex !== null ? 'Guardar Paso' : 'Añadir Paso'}
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
                  <span className="modalListaItemButtons">
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button className="modalBoton" onClick={handleCreateReceta}>
            {receta ? 'Actualizar Receta' : 'Crear Receta'}
          </button>
          <button className="modalBoton" onClick={limpiarCampos}>
            Cancelar
          </button>
        </div>
      </div>
    </>
  );
};

export default NuevaRecetaModal;
