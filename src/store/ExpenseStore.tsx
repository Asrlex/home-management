import { create } from 'zustand';
import { axiosRequest } from '../common/services/AxiosRequest';
import { HttpEnum } from '@/entities/enums/http.enum';
import { ExpenseI } from '@/entities/types/home-management.entity';
import { CreateExpenseDto } from '@/entities/dtos/expense.dto';
import { AddExpenseException, DeleteExpenseException, FetchExpensesException } from '@/common/exceptions/expense-exception';
import { ExpenseExceptionMessages } from '@/common/exceptions/entities/enums/expense-exception.enum';
import { ApiEndpoints, GastosEndpoints } from '@/config/apiconfig';

interface ExpenseStore {
  expenses: ExpenseI[];
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: CreateExpenseDto) => Promise<void>;
  deleteExpense: (expenseID: number) => Promise<void>;
}

const useExpenseStore = create((set): ExpenseStore => ({
  expenses: [],

  fetchExpenses: async () =>
    await axiosRequest(
      HttpEnum.GET,
      ApiEndpoints.hm_url + GastosEndpoints.all
    )
      .then((response: ExpenseI[]) => {
        set({ expenses: response });
      })
      .catch((error) => {
        throw new FetchExpensesException(
          ExpenseExceptionMessages.FetchExpensesException + error
        );
      }),

  addExpense: async (expense: CreateExpenseDto) =>
    await axiosRequest(
      HttpEnum.POST,
      ApiEndpoints.hm_url + GastosEndpoints.base,
      {},
      expense
    )
      .then((response: ExpenseI) => {
        set((state) => ({ expenses: [...state.expenses, response] }));
      })
      .catch((error) => {
        throw new AddExpenseException(
          ExpenseExceptionMessages.AddExpenseException + error
        );
      }),

  deleteExpense: async (expenseID: number) =>
    await axiosRequest(
      HttpEnum.DELETE,
      `${ApiEndpoints.hm_url + GastosEndpoints.base}/${expenseID}`
    )
      .then(() =>
        set((state) => ({
          expenses: state.expenses.filter(
            (expense) => expense.expenseID !== expenseID
          ),
        })),
      )
      .catch((error) => {
        throw new DeleteExpenseException(
          ExpenseExceptionMessages.DeleteExpenseException + error
        );
      }),
}));

export default useExpenseStore;
