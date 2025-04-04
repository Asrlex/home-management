import Select from "react-select";
import { customStyles } from "../../styles/ModalStyle";


export default function GastosForm ({
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
            ref={expenseAmountRef}
            className="gastosFormInputSmall"
            placeholder="Cantidad"
          />
          <input
            type="text"
            ref={expenseDescriptionRef}
            className="gastosFormInputSmall"
            placeholder="Descripción"
          />
          <input
            type="date"
            ref={expenseDateRef}
            className="gastosFormInputSmall"
            placeholder="Fecha"
          />
          <Select
            options={expenseCategoryOptions}
            value={expenseCategory}
            onChange={(selectedOption) => setExpenseCategory(selectedOption)}
            styles={customStyles}
            className="modalSelect"
          />{" "}
        </div>
        <button className="gastosFormBoton">Añadir gasto</button>
      </form>
    </div>
  );
}
