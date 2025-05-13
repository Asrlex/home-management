import { ExpenseI } from '@/entities/types/home-management.entity';
import React from 'react';
import { AiFillDelete } from 'react-icons/ai';

interface ExpensesListProps {
  expenses: ExpenseI[];
  sortedItems: ExpenseI[];
  eliminarGasto: (expenseID: number) => void;
}

const ExpensesList: React.FC<ExpensesListProps> = ({
  sortedItems,
  eliminarGasto,
}) => {
  // Group expenses by date
  const groupedExpenses = sortedItems.reduce((acc: Record<string, any[]>, expense) => {
    const date = expense.expenseDate.slice(0, 10); // Extract the date (YYYY-MM-DD)
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(expense);
    return acc;
  }, {});

  return (
    <div className='expenseTableDiv'>
      {Object.entries(groupedExpenses).map(([date, expenses]) => (
        <div key={date} className='expenseGroup'>

          <div className='expenseDateHeader'>
            {new Date(date).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'long'
            })}
          </div>

          {expenses.map((expense) => (
            <div key={expense.expenseID} className='expenseListItem'>
              <div className='expenseListItemInfo'>
                <div className='expenseListItemDate'>
                  {expense.categoryName}
                </div>
                <div className={`expenseListItemTime`}>
                  {expense.expenseAmount}€
                </div>
                <div className='expenseListItemTime'>
                  {expense.expenseDescription}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ExpensesList;