import React, { useState, useRef, useContext, Fragment, useEffect } from "react";
import toast from "react-hot-toast";
import Select from "react-select";
import {
  FaPlus,
  FaArrowAltCircleUp,
  FaArrowAltCircleDown,
} from "react-icons/fa";
import { IoIosRefresh } from "react-icons/io";
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
import useProductStore from "../../store/ProductContext";
import useEtiquetaStore from "../../store/EtiquetaContext";
import useShoppingListStore from "../../store/ShoppingListContext";
import useStockStore from "../../store/StockContext";
import ListaCompraItem from "./ListaCompraItem";
import DespensaItem from "./DespensaItem";
import api_config from "../../config/apiconfig";
import { axiosRequest } from "../../services/AxiosRequest";
import { customStyles } from "../generic/ModalStyle";

export default function GestorProductos({ type }) {
  const [prodInView, setProdInView] = useState({
    last: false,
    first: false,
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const etiquetasSeleccionadas = useEtiquetaStore(state => state.etiquetasSeleccionadas);
  const products = useProductStore(state => state.products);
  const shoppingListItems = useShoppingListStore(state => state.shoppingListItems);
  const setShoppingListItems = useShoppingListStore(state => state.setShoppingListItems);
  const addShoppingListItem = useShoppingListStore(state => state.addShoppingListItem);
  const removeShoppingListItem = useShoppingListStore(state => state.removeShoppingListItem);
  const modifyShoppingListItemAmount = useShoppingListStore(state => state.modifyShoppingListItemAmount);
  const reorderShoppingListItems = useShoppingListStore(state => state.reorderShoppingListItems);
  const addOrRemoveListTag = useShoppingListStore(state => state.addOrRemoveListTag);
  const fetchShoppingListItems = useShoppingListStore(state => state.fetchShoppingListItems);
  const stockItems = useStockStore(state => state.stockItems);
  const setStockItems = useStockStore(state => state.setStockItems);
  const addStockItem = useStockStore(state => state.addStockItem);
  const removeStockItem = useStockStore(state => state.removeStockItem);
  const modifyStockItemAmount = useStockStore(state => state.modifyStockItemAmount);
  const reorderStockItems = useStockStore(state => state.reorderStockItems);
  const addOrRemoveStockTag = useStockStore(state => state.addOrRemoveStockTag);
  const fetchStockItems = useStockStore(state => state.fetchStockItems);
  const productoDialogRef = useRef();
  const amountRef = useRef(0);
  const lastRef = useRef();
  const firstRef = useRef();
  const addOrRemoveTag =
    type === "lista-compra" ? addOrRemoveListTag : addOrRemoveStockTag;
  
  useEffect(() => {
    if (type === "lista-compra") {
      fetchShoppingListItems();
    } else {
      fetchStockItems();
    }
  }
  , [type, fetchShoppingListItems, fetchStockItems]);

  /**
   * Custom hook to handle drag and drop events
   */
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  /**
   * Handles the end of a drag event
   * @param {object} event The drag event
   * @param {object} event.active The active element
   * @param {object} event.over The element over which the active element is
   * @param {object} event.active.id The ID of the active element
   * @param {object} event.over.id The ID of the element over which the active element is
   */
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = (
        type === "lista-compra" ? shoppingListItems : stockItems
      ).findIndex(
        (item) =>
          item[
            type === "lista-compra" ? "shoppingListProductID" : "stockProductID"
          ] === active.id
      );
      const newIndex = (
        type === "lista-compra" ? shoppingListItems : stockItems
      ).findIndex(
        (item) =>
          item[
            type === "lista-compra" ? "shoppingListProductID" : "stockProductID"
          ] === over.id
      );
      const newItems = arrayMove(
        type === "lista-compra" ? shoppingListItems : stockItems,
        oldIndex,
        newIndex
      );
      type === "lista-compra"
        ? reorderShoppingListItems(newItems)
        : reorderStockItems(newItems);
    }
  };

  /**
   * Adds a product to the list
   * @param {number} id The product ID
   * @param {number} amount The amount of the product
   */
  const handleAdd = (id, amount) => {
    const apiUrl =
      type === "lista-compra"
        ? api_config.lista_compra.base
        : api_config.despensa.base;
    const addItem =
      type === "lista-compra" ? addShoppingListItem : addStockItem;
    toast.promise(
      axiosRequest(
        "POST",
        apiUrl,
        {},
        {
          [type === "lista-compra"
            ? "shoppingListAmount"
            : "stockProductAmount"]: amount,
          storeID: 2,
          [type === "lista-compra"
            ? "shoppingListProductID"
            : "stockProductID"]: id,
        }
      )
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

  /**
   * Deletes a product from the list
   * @param {number} id The product ID
   */
  const handleEliminar = (id) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de eliminar este producto?"
    );
    if (confirmacion) {
      const apiUrl =
        type === "lista-compra"
          ? `${api_config.lista_compra.base}/${id}`
          : `${api_config.despensa.base}/${id}`;
      const removeItem =
        type === "lista-compra" ? removeShoppingListItem : removeStockItem;
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

  /**
   * Modifies the amount of a product
   * @param {number} id The product ID
   * @param {number} amount The new amount
   */
  const handleAmount = (id, amount) => {
    const apiUrl =
      type === "lista-compra"
        ? `${api_config.lista_compra.modifyAmount}${id}`
        : `${api_config.despensa.modifyAmount}${id}`;
    const modifyItemAmount =
      type === "lista-compra"
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

  /**
   * Moves a product from one list to the other
   * @param {number} id The product ID
   */
  const handleMover = (id) => {
    const apiUrl =
      type === "lista-compra"
        ? `${api_config.lista_compra.buy}${id}`
        : `${api_config.despensa.toList}${id}`;
    const removeItem =
      type === "lista-compra" ? removeShoppingListItem : removeStockItem;
    const addItem =
      type === "lista-compra" ? addStockItem : addShoppingListItem;
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

  /**
   * Fetches the data from the API and sets the state accordingly
   */
  const fetchData = async () => {
    const apiUrl =
      type === "lista-compra"
        ? api_config.lista_compra.all
        : api_config.despensa.all;
    toast.promise(
      axiosRequest("GET", apiUrl)
        .then((response) => {
          if (type === "lista-compra") {
            setShoppingListItems(response);
          } else {
            setStockItems(response);
          }
        })
        .catch((error) => {
          console.error(error);
        }),
      {
        loading: "Cargando productos...",
        success: "Productos cargados",
        error: (err) => `Error al cargar productos: ${err}`,
      }
    );
  };

  /**
   * Handles the submit event of the modal
   * @param {object} e The submit event
   */
  const modalSubmit = (e) => {
    e.preventDefault();
    const handleAmount = parseInt(amountRef.current.value);
    handleAdd(selectedProduct.value, handleAmount);
    productoDialogRef.current.close();
    amountRef.current.value = 0;
  };

  /**
   * Options for the Select component
   */
  const productOptions = products.map((product) => ({
    value: product.productID,
    label: product.productName,
  }));

  /**
   * The modal to add a product
   */
  const popupProducto = (
    <Modal ref={productoDialogRef}>
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

  const items = type === "lista-compra" ? shoppingListItems : stockItems;
  const ItemComponent =
    type === "lista-compra" ? ListaCompraItem : DespensaItem;

  return (
    <>
      {popupProducto}
      <ListaEtiquetas tipo="Product" />
      <div className={type === "lista-compra" ? "listaCompra" : "despensa"}>
        {Array.isArray(items) && items.length === 0 && (
          <div className="text-center">
            No hay productos en la{" "}
            {type === "lista-compra" ? "lista de compra" : "despensa"}
          </div>
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
                        type === "lista-compra"
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
                        type === "lista-compra"
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
        <FAB
          icon={<IoIosRefresh />}
          action={fetchData}
          classes="refreshButton"
        />
        <FAB
          icon={<FaPlus />}
          action={() => productoDialogRef.current.open()}
          classes="floatingButton"
        />
      </div>
    </>
  );
}
