import { useRef, useEffect, useState, useCallback, memo } from 'react';
import { FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Loader from '../generic/Loader';
import FAB from '../generic/FloatingButton';
import MonthSelector from '../generic/MonthSelector';
import GastosForm from './ExpenseForm';
import useExpenseStore from '../../store/ExpenseStore';
import React from 'react';
import { CreateExpenseDto } from '@/entities/dtos/expense.dto';
import ExpensesList from './ExpenseList';

function Gastos() {
  const expenses = useExpenseStore((state) => state.expenses);
  const fetchExpensesByMonth = useExpenseStore(
    (state) => state.fetchExpensesByMonth
  );
  const addExpense = useExpenseStore((state) => state.addExpense);
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [expenseCategory, setExpenseCategory] = useState({
    value: 0,
    label: '',
  });
  const expenseAmountRef = useRef<HTMLInputElement>(null);
  const expenseDateRef = useRef<HTMLInputElement>(null);
  const expenseDescriptionRef = useRef<HTMLInputElement>(null);
  const memoizedFetchExpenses = useCallback(fetchExpensesByMonth, [
    fetchExpensesByMonth,
  ]);

  useEffect(() => {
    memoizedFetchExpenses(selectedMonth)
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Error fetching data');
        setIsLoading(true);
      });
  }, [memoizedFetchExpenses, selectedMonth]);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const crearGasto = (e: React.FormEvent) => {
    e.preventDefault();
    const expense: CreateExpenseDto = {
      expenseAmount: parseInt(expenseAmountRef.current.value),
      expenseDate: expenseDateRef.current.value,
      expenseDescription: expenseDescriptionRef.current.value,
      categoryID: expenseCategory.value,
    };
    if (
      !expense.expenseAmount ||
      !expense.expenseDate ||
      !expense.expenseDescription
    ) {
      toast.error('Por favor, completa todos los campos');
      return;
    }
    addExpense(expense)
      .then(() => {
        toast.success('Gasto creado correctamente');
      })
      .catch((error) => {
        console.error(error);
        toast.error('Error creando gasto');
      });
  };

  const eliminarGasto = (expenseID: number) => {
    deleteExpense(expenseID)
      .then(() => {
        toast.success('Gasto eliminado correctamente');
      })
      .catch((error) => {
        console.error(error);
        toast.error('Error eliminando gasto');
      });
  };

  const expenseCategoryOptions = [
    { value: 7, label: 'Bizum' },
    { value: 6, label: 'Regalos' },
    { value: 4, label: 'Ocio' },
    { value: 3, label: 'Comida' },
    { value: 2, label: 'Salario' },
    { value: 1, label: 'Mascotas' },
  ];

  const handleShowForm = () => {
    const form = document.querySelector('.gastosForm');
    form.classList.toggle('gastosFormHidden');
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="gastos">
          <MonthSelector onMonthChange={handleMonthChange} />
          <GastosForm
            crearGasto={crearGasto}
            expenseCategoryOptions={expenseCategoryOptions}
            expenseCategory={expenseCategory}
            setExpenseCategory={setExpenseCategory}
            expenseAmountRef={expenseAmountRef}
            expenseDateRef={expenseDateRef}
            expenseDescriptionRef={expenseDescriptionRef}
          />
          <ExpensesList expenses={expenses} eliminarGasto={eliminarGasto} />
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
