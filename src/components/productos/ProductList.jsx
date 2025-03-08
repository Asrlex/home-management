import React, { useState, useRef, useContext, Fragment } from "react";
import toast from "react-hot-toast";
import Select from "react-select";
import {
  FaPlus,
  FaArrowAltCircleUp,
  FaArrowAltCircleDown,
} from "react-icons/fa";
import { InView } from "react-intersection-observer";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Modal from "../generic/Modal";
import ListaEtiquetas from "../ListaEtiquetas";
import FAB from "../generic/FloatingButton";
import { ProductContext } from "../../store/product-context";
import { EtiquetaContext } from "../../store/etiqueta-context";
import { ShoppingListContext } from "../../store/shopping-list-context";
import { StockContext } from "../../store/stock-context";
import ListaCompraItem from "./ListaCompraItem";
import DespensaItem from "./DespensaItem";
import SelectorTienda from "../generic/SelectorTienda";
import api_config from "../../config/apiconfig";
import { axiosRequest } from "../../utils/axiosUtils";

export default function ShoppingList({ type }) {
  const [prodInView, setProdInView] = useState({
    last: false,
    first: false,
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { etiquetasSeleccionadas } = useContext(EtiquetaContext);
  const { products } = useContext(ProductContext);
  const {
    shoppingListItems,
    addShoppingListItem,
    removeShoppingListItem,
    modifyShoppingListItemAmount,
    reorderShoppingListItems,
  } = useContext(ShoppingListContext);
  const {
    stockItems,
    addStockItem,
    removeStockItem,
    modifyStockItemAmount,
    addOrRemoveTag,
    reorderStockItems,
  } = useContext(StockContext);
  const productoDialog = useRef();
  const amountRef = useRef(0);
  const lastRef = useRef();
  const firstRef = useRef();

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = (
        type === 'lista-compra' ? shoppingListItems : stockItems
      ).findIndex(
        (item) =>
          item[
            type === 'lista-compra'
              ? "shoppingListProductID"
              : "stockProductID"
          ] === active.id
      );
      const newIndex = (
        type === 'lista-compra' ? shoppingListItems : stockItems
      ).findIndex(
        (item) =>
          item[
            type === 'lista-compra'
              ? "shoppingListProductID"
              : "stockProductID"
          ] === over.id
      );
      const newItems = arrayMove(
        type === 'lista-compra' ? shoppingListItems : stockItems,
        oldIndex,
        newIndex
      );
      type === 'lista-compra'
        ? reorderShoppingListItems(newItems)
        : reorderStockItems(newItems);
    }
  };
  const handleAdd = (id, amount) => {
    const apiUrl =
      type === 'lista-compra'
        ? api_config.lista_compra.base
        : api_config.despensa.base;
    const addItem =
      type === 'lista-compra' ? addShoppingListItem : addStockItem;
    toast.promise(
      axiosRequest("POST", apiUrl, {}, {
        [type === 'lista-compra'
          ? "shoppingListAmount"
          : "stockProductAmount"]: amount,
        storeID: 2,
        [type === 'lista-compra' ? "shoppingListProductID" : "stockProductID"]:
          id,
      })
        .then((response) => {
          addItem(response);
        })
        .catch((error) => {
          console.error(error);
        }),
      {
        loading: "Añadiendo producto...",
        success: "Producto añadido",
        error: (err) => `Error al añadir producto: ${err}`,
      }
    );
  };
  const handleEliminar = (id) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de eliminar este producto?"
    );
    if (confirmacion) {
      const apiUrl =
        type === 'lista-compra'
          ? `${api_config.lista_compra.base}/${id}`
          : `${api_config.despensa.base}/${id}`;
      const removeItem =
        type === 'lista-compra' ? removeShoppingListItem : removeStockItem;
      toast.promise(
        axiosRequest("DELETE", apiUrl)
          .then(() => {
            removeItem(id);
          })
          .catch((error) => {
            console.error(error);
          }),
        {
          loading: "Eliminando producto...",
          success: "Producto eliminado",
          error: (err) => `Error al eliminar producto: ${err}`,
        }
      );
    }
  };
  const handleAmount = (id, amount) => {
    console.log("handleAmount", id, amount);
    const apiUrl =
      type === 'lista-compra'
        ? `${api_config.lista_compra.modifyAmount}${id}`
        : `${api_config.despensa.modifyAmount}${id}`;
    const modifyItemAmount =
      type === 'lista-compra'
        ? modifyShoppingListItemAmount
        : modifyStockItemAmount;
    toast.promise(
      axiosRequest("PUT", apiUrl, { amount })
        .then(() => {
          modifyItemAmount(id, amount);
        })
        .catch((error) => {
          console.error(error);
        }),
      {
        loading: "Actualizando cantidad...",
        success: "Cantidad actualizada",
        error: (err) => `Error al actualizar cantidad: ${err}`,
      }
    );
  };
  const handleMover = (id) => {
    const apiUrl =
      type === 'lista-compra'
        ? `${api_config.lista_compra.buy}${id}`
        : `${api_config.despensa.toList}${id}`;
    const removeItem =
      type === 'lista-compra' ? removeShoppingListItem : removeStockItem;
    const addItem =
      type === 'lista-compra' ? addStockItem : addShoppingListItem;
    toast.promise(
      axiosRequest("PUT", apiUrl)
        .then((response) => {
          removeItem(id);
          addItem(response);
        })
        .catch((error) => {
          console.error(error);
        }),
      {
        loading: "Comprando producto...",
        success: "Producto comprado",
        error: (err) => `Error al comprar producto: ${err}`,
      }
    );
  };

  const modalSubmit = (e) => {
    e.preventDefault();
    const handleAmount = parseInt(amountRef.current.value);
    handleAdd(selectedProduct.value, handleAmount);
    productoDialog.current.close();
    amountRef.current.value = 0;
  };
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
    }),
    input: (provided) => ({ ...provided, color: "var(--text-color)" }),
    placeholder: (provided) => ({ ...provided, color: "var(--modal-button-text-color)" }),
    singleValue: (provided) => ({ ...provided, color: "var(--modal-button-text-color)" }),
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
  const popupProducto = (
    <Modal ref={productoDialog}>
      <h2 className="modalTitulo">Añadir producto</h2>
      <form>
        <Select
          options={productOptions}
          onChange={setSelectedProduct}
          placeholder="Seleccionar producto"
          className="modalSelect"
          styles={customStyles}
          isSearchable
        />
        <input
          type="number"
          placeholder="Cantidad"
          className="modalInput"
          ref={amountRef}
        />
        <div className="flex justify-center">
          <button type="submit" className="modalBoton" onClick={modalSubmit}>
            Crear
          </button>
        </div>
      </form>
    </Modal>
  );

  const items = type === 'lista-compra' ? shoppingListItems : stockItems;
  const ItemComponent =
    type === 'lista-compra' ? ListaCompraItem : DespensaItem;

  return (
    <>
      {popupProducto}
      <ListaEtiquetas tipo="Product" />
      <div className={type === 'lista-compra' ? "listaCompra" : "despensa"}>
        {Array.isArray(items) && items.length === 0 && (
          <p className="text-center">
            No hay productos en la{" "}
            {type === 'lista-compra' ? "lista de compra" : "despensa"}
          </p>
        )}
        <span
          onClick={() => {
            firstRef.current.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <FaArrowAltCircleUp
            className={`iconoScrollTop ${prodInView.first ? "hidden" : ""}`}
          />
        </span>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={
              Array.isArray(items)
                ? items.map(
                    (item) =>
                      item[
                        type === 'lista-compra'
                          ? "shoppingListProductID"
                          : "stockProductID"
                      ]
                  )
                : []
            }
            strategy={verticalListSortingStrategy}
          >
            {Array.isArray(items) &&
              items
                .filter((producto) => {
                  if (etiquetasSeleccionadas.length === 0) return true;
                  return etiquetasSeleccionadas.some((etiqueta) =>
                    producto.product.tags.some(
                      (prodEtiqueta) => prodEtiqueta.tagID === etiqueta.tagID
                    )
                  );
                })
                .map((producto, index) => (
                  <Fragment
                    key={
                      producto[
                        type === 'lista-compra'
                          ? "shoppingListProductID"
                          : "stockProductID"
                      ]
                    }
                  >
                    {index === 0 ? (
                      <InView
                        as="div"
                        onChange={(inView) => {
                          setProdInView((state) => ({
                            last: state.last,
                            first: inView,
                          }));
                        }}
                        threshold={0.5}
                      >
                        <ItemComponent
                          producto={producto}
                          handleEliminar={handleEliminar}
                          handleAmount={handleAmount}
                          handleMover={handleMover}
                          addOrRemoveTag={addOrRemoveTag}
                          ref={firstRef}
                        />
                      </InView>
                    ) : index === items.length - 1 ? (
                      <InView
                        as="div"
                        onChange={(inView) => {
                          setProdInView((state) => ({
                            last: inView,
                            first: state.first,
                          }));
                        }}
                        threshold={0.5}
                      >
                        <ItemComponent
                          producto={producto}
                          handleEliminar={handleEliminar}
                          handleAmount={handleAmount}
                          handleMover={handleMover}
                          addOrRemoveTag={addOrRemoveTag}
                          ref={lastRef}
                        />
                      </InView>
                    ) : (
                      <ItemComponent
                        producto={producto}
                        handleEliminar={handleEliminar}
                        handleAmount={handleAmount}
                        handleMover={handleMover}
                        addOrRemoveTag={addOrRemoveTag}
                      />
                    )}
                  </Fragment>
                ))}
          </SortableContext>
        </DndContext>
        <span
          onClick={() => {
            lastRef.current.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <FaArrowAltCircleDown
            className={`iconoScrollBottom ${prodInView.last ? "hidden" : ""}`}
          />
        </span>
      </div>
      <div className="seccionBotones">
        <SelectorTienda />
        <FAB icon={<FaPlus />} action={() => productoDialog.current.open()} />
      </div>
    </>
  );
}
