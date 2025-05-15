import { ExpenseI } from '@/entities/types/home-management.entity';
import { ContextMenu } from 'primereact/contextmenu';
import React, { useRef } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';

interface ExpensesListProps {
  expenses: ExpenseI[];
  eliminarGasto: (expenseID: number) => void;
}

const ExpensesList: React.FC<ExpensesListProps> = ({
  expenses,
  eliminarGasto,
}) => {
  const contextMenuRef = useRef(null);
  const groupedExpenses = expenses.reduce(
    (acc: Record<string, ExpenseI[]>, expense) => {
      const date = expense.expenseDate.slice(0, 10);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(expense);
      return acc;
    },
    {}
  );

  return (
    <div className="expenseTableDiv">
      {Object.entries(groupedExpenses).map(([date, expenses]) => (
        <div key={date} className="expenseGroup">
          <div className="expenseDateHeader">
            {new Date(date).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'long',
            })}
          </div>

          {expenses.map((expense) => (
            <div
              key={expense.expenseID}
              className="expenseListItem"
              onContextMenu={(e) => contextMenuRef.current?.show(e)}
            >
              <ContextMenu
                className="customContextMenu"
                model={[
                  {
                    label: 'Delete',
                    icon: <RiDeleteBinLine className="customContextMenuIcon" />,
                    command: () => eliminarGasto(expense.expenseID),
                  },
                ]}
                ref={contextMenuRef}
              />
              <div className="expenseListItemInfo">
                <div className="expenseListItemDate">
                  {expense.categoryName}
                </div>
                <div className={`expenseListItemTime`}>
                  {expense.expenseAmount}€
                </div>
                <div className="expenseListItemTime">
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
