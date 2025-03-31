import { useState, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import useProductStore from "../../store/ProductContext";
import useEtiquetaStore from "../../store/EtiquetaContext";
import ListaEtiquetas from "../ListaEtiquetas";
import FAB from "../generic/FloatingButton";
import Modal from "../generic/Modal";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import { axiosRequest } from "../../services/AxiosRequest";

const ListaProductos = () => {
  const products = useProductStore(state => state.products);
  const addProduct = useProductStore(state => state.addProduct);
  const etiquetasSeleccionadas = useEtiquetaStore(state => state.etiquetasSeleccionadas);
  const fetchProducts = useProductStore(state => state.fetchProducts);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const productoDialogRef = useRef();
  const nameRef = useRef();
  const unitRef = useRef();

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleAddProduct = async () => {
    const name = nameRef.current.value;
    const unit = unitRef.current.value;
    if (!name || !unit) {
      toast.error("Por favor, complete todos los campos");
      return;
    }
    const newProduct = {
      productName: name,
      productUnit: unit,
    };
    const response = await axiosRequest("POST", "/products", newProduct);
    if (response.status === 201) {
      addProduct(response.data);
      toast.success("Producto agregado correctamente");
      productoDialogRef.current.close();
    } else {
      toast.error("Error al agregar el producto");
    }
  }

  const popup = (
    <Modal ref={productoDialogRef}>
      <h2 className="modalTitulo">
        Crear producto
      </h2>
      <form>
        <div className="mb-3">
          <input
            className="modalInput"
            id="titulo"
            ref={nameRef}
            placeholder="Nombre"
          />
        </div>
        <div className="mb-3">
          <input
            className="modalInput"
            id="unidad"
            ref={unitRef}
            placeholder="Unidad"
          />
        </div>
        <div className="flex justify-center">
          <button type="submit" className="modalBoton" onClick={handleAddProduct}>
            Crear
          </button>
        </div>
      </form>
    </Modal>
  );

  return (
    <>
      {popup}
      <ListaEtiquetas tipo="Product" />
      <div className="productsTable">
        <TableContainer
          component={Paper}
          sx={{
            width: "100%",
            maxHeight: "85%",
            height: "85%",
            backgroundColor: "var(--item-bg-color)",
            color: "var(--text-color)",
          }}
        >
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: "var(--barra-bg-color)",
                    color: "var(--barra-text-color)",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("productID")}
                >
                  ID {sortConfig.key === "productID" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "var(--barra-bg-color)",
                    color: "var(--barra-text-color)",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("productName")}
                >
                  Nombre {sortConfig.key === "productName" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "var(--barra-bg-color)",
                    color: "var(--barra-text-color)",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("productUnit")}
                >
                  Unidad {sortConfig.key === "productUnit" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "var(--barra-bg-color)",
                    color: "var(--barra-text-color)",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("productDateLastBought")}
                >
                  Comprado {sortConfig.key === "productDateLastBought" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "var(--barra-bg-color)",
                    color: "var(--barra-text-color)",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("productDateLastConsumed")}
                >
                  Consumido {sortConfig.key === "productDateLastConsumed" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedProducts
                .filter((producto) => {
                  if (etiquetasSeleccionadas.length === 0) return true;
                  return etiquetasSeleccionadas.some((etiqueta) =>
                    producto.tags.some(
                      (prodEtiqueta) => prodEtiqueta.tagID === etiqueta.tagID
                    )
                  );
                })
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product, index) => (
                  <TableRow
                    hover
                    key={product.productID}
                    sx={{
                      backgroundColor: "var(--item-bg-color)",
                      "&:hover": {
                        backgroundColor: "var(--item-hover-bg-color)",
                      },
                    }}
                  >
                    <TableCell sx={{ color: "var(--product-text-color)" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ color: "var(--product-text-color)" }}>
                      {product.productName}
                    </TableCell>
                    <TableCell sx={{ color: "var(--product-text-color)" }}>
                      {product.productUnit}
                    </TableCell>
                    <TableCell sx={{ color: "var(--product-text-color)" }}>
                      {product.productDateLastBought.slice(0, 10)}
                    </TableCell>
                    <TableCell sx={{ color: "var(--product-text-color)" }}>
                      {product.productDateLastConsumed}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            backgroundColor: "var(--barra-bg-color)",
            color: "var(--pagination-text-color)",
          }}
        />
      </div>
      <div className="seccionBotones">
        <FAB
          icon={<FaPlus />}
          action={() => productoDialogRef.current.open()}
          classes="floatingButton"
        />
      </div>
    </>
  );
};

export default ListaProductos;