import { useRef, useEffect, useState, useCallback, memo } from "react";
import { FaPlus, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import Modal from "../generic/Modal";
import toast from "react-hot-toast";
import Loader from "../generic/Loader";
import FAB from "../generic/FloatingButton";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from "@mui/material";
import { TableStyles } from "../../styles/Table.Styles";
import GastosForm from "./GastosForm";
import useExpenseStore from "../../store/ExpenseStore";

function Gastos() {
  const expenses = useExpenseStore((state) => state.expenses);
  const fetchExpenses = useExpenseStore((state) => state.fetchExpenses);
  const addExpense = useExpenseStore((state) => state.addExpense);
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "expenseDate",
    direction: "asc",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const up = <FaArrowUp className="tableHeaderIcon" />;
  const down = <FaArrowDown className="tableHeaderIcon" />;
  const [expenseCategory, setExpenseCategory] = useState(0);
  const expenseAmountRef = useRef();
  const expenseDateRef = useRef();
  const expenseDescriptionRef = useRef();
  const memoizedFetchExpenses = useCallback(fetchExpenses, []);

  useEffect(() => {
    memoizedFetchExpenses()
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error fetching data");
        setIsLoading(true);
      });
  }, [memoizedFetchExpenses]);

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

  const sortedItems = [...expenses].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const crearGasto = (e) => {
    e.preventDefault();
    const expense = {
      expenseAmount: expenseAmountRef.current.value,
      expenseDate: expenseDateRef.current.value,
      expenseDescription: expenseDescriptionRef.current.value,
      categoryID: expenseCategory.value,
    };
    if (!expense.expenseAmount || !expense.expenseDate || !expense.expenseDescription) {
      toast.error("Por favor, completa todos los campos");
      return;
    }
    addExpense(expense)
      .then(() => {
        toast.success("Gasto creado correctamente");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error creando gasto");
      });
  };

  const eliminarGasto = (expenseID) => {
    deleteExpense(expenseID)
      .then(() => {
        toast.success("Gasto eliminado correctamente");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error eliminando gasto");
      });
  };

  const expenseCategoryOptions = [
    { value: 7, label: "Bizum" },
    { value: 6, label: "Regalos" },
    { value: 4, label: "Ocio" },
    { value: 3, label: "Comida" },
    { value: 2, label: "Salario" },
    { value: 1, label: "Mascotas" },
  ];

  const handleShowForm = () => {
    const form = document.querySelector(".gastosForm");
    form.classList.toggle("gastosFormHidden");
    const table = document.querySelector(".gastosTableDiv");
    table.classList.toggle("gastosTablePlusForm");
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="gastos">
          <GastosForm
            crearGasto={crearGasto}
            expenseCategoryOptions={expenseCategoryOptions}
            expenseCategory={expenseCategory}
            setExpenseCategory={setExpenseCategory}
            expenseAmountRef={expenseAmountRef}
            expenseDateRef={expenseDateRef}
            expenseDescriptionRef={expenseDescriptionRef}
          />
          <div className="gastosTableDiv">
            <TableContainer component={Paper} sx={TableStyles.table}>
              <Table stickyHeader aria-label="sticky table" size="small" className="gastosTable">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={TableStyles.tableHeaderCell}
                      onClick={() => handleSort("categoryName")}
                    >
                      <span className="tableHeaderText">
                        <span>Categoría </span>
                        {sortConfig.key === "categoryName"
                          ? sortConfig.direction === "asc"
                            ? up
                            : down
                          : ""}
                      </span>
                    </TableCell>
                    <TableCell
                      sx={TableStyles.tableHeaderCell}
                      onClick={() => handleSort("expenseAmount")}
                    >
                      <span className="tableHeaderText">
                        <span>Cantidad </span>
                        {sortConfig.key === "expenseAmount"
                          ? sortConfig.direction === "asc"
                            ? up
                            : down
                          : ""}
                      </span>
                    </TableCell>
                    <TableCell
                      sx={TableStyles.tableHeaderCell}
                      onClick={() => handleSort("expenseDate")}
                    >
                      <span className="tableHeaderText">
                        <span>Fecha </span>
                        {sortConfig.key === "expenseDate"
                          ? sortConfig.direction === "asc"
                            ? up
                            : down
                          : ""}
                      </span>
                    </TableCell>
                    <TableCell
                      sx={TableStyles.tableHeaderCell}
                      onClick={() => handleSort("expenseDescription")}
                    >
                      <span className="tableHeaderText">
                        <span>Descripción </span>
                        {sortConfig.key === "expenseDescription"
                          ? sortConfig.direction === "asc"
                            ? up
                            : down
                          : ""}
                      </span>
                    </TableCell>
                    <TableCell sx={TableStyles.tableHeaderCell}>
                      <span className="tableHeaderText">
                        <AiFillDelete />
                      </span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedItems
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((expense) => (
                      <TableRow
                        hover
                        key={expense.expenseID}
                        sx={TableStyles.tableRow}
                      >
                        <TableCell sx={TableStyles.tableCell}>
                          {expense.categoryName}
                        </TableCell>
                        <TableCell sx={TableStyles.tableCell}>
                          {expense.expenseAmount}
                        </TableCell>
                        <TableCell sx={TableStyles.tableCell}>
                          {expense.expenseDate.slice(0, 10)}
                        </TableCell>
                        <TableCell sx={TableStyles.tableCell}>
                          {expense.expenseDescription}
                        </TableCell>
                        <TableCell sx={TableStyles.tableCell} onClick={() => eliminarGasto(expense.expenseID)}>
                          <AiFillDelete />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={expenses.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={TableStyles.tablePagination}
              slotProps={TableStyles.tablePaginationSlots}
            />
          </div>
        </div>
      )}
      <div className="seccionBotones">
        <FAB
          icon={<FaPlus />}
          action={handleShowForm}
          tooltip="Añadir gasto"
          classes="floatingButton"
        />
      </div>
    </>
  );
}

export default memo(Gastos);
