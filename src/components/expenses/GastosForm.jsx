import Select from "react-select";
import { customStyles } from "../../styles/SelectStyles";

export default function GastosForm({
  crearGasto,
  expenseCategoryOptions,
  expenseCategory,
  setExpenseCategory,
  expenseAmountRef,
  expenseDateRef,
  expenseDescriptionRef,
}) {
  return (
    <div className="gastosForm gastosFormHidden">
      <h2 className="gastosFormTitle">Añadir gasto</h2>
      <form className="gastosFormForm" onSubmit={crearGasto}>
        <div className="gastosFormInputs">
          <input
            type="text"
            name="cantidad"
            ref={expenseAmountRef}
            className="gastosFormInputSmall"
            placeholder="Cantidad"
          />
          <input
            type="text"
            name="descripcion"
            ref={expenseDescriptionRef}
            className="gastosFormInputSmall"
            placeholder="Descripción"
          />
          <input
            type="date"
            name="fecha"
            ref={expenseDateRef}
            className="gastosFormInputSmall"
            placeholder="Fecha"
          />
          <Select
            options={expenseCategoryOptions}
            value={expenseCategory}
            onChange={(selectedOption) => setExpenseCategory(selectedOption)}
            styles={customStyles}
            className="gastosFormSelect"
          />{" "}
        </div>
        <button className="gastosFormBoton">Añadir gasto</button>
      </form>
    </div>
  );
}
