import { create } from "zustand";
import { axiosRequest } from "../services/AxiosRequest";
import api_config from "../config/apiconfig";

const useExpenseStore = create((set) => ({
  expenses: [],

  fetchExpenses: async () => {
    try {
      const response = await axiosRequest("GET", api_config.gastos.all);
      set({ expenses: response });
    } catch (error) {
      console.error("Error fetching expenses:", error);
      throw error;
    }
  },

  addExpense: async (expense) => {
    try {
      const response = await axiosRequest(
        "POST",
        api_config.gastos.base,
        {},
        expense
      );
      set((state) => ({ expenses: [...state.expenses, response] }));
    } catch (error) {
      console.error("Error adding expense:", error);
      throw error;
    }
  },

  deleteExpense: async (expenseID) => {
    try {
      await axiosRequest("DELETE", `${api_config.gastos.base}/${expenseID}`);
      set((state) => ({
        expenses: state.expenses.filter(
          (expense) => expense.expenseID !== expenseID
        ),
      }));
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  },
}));

export default useExpenseStore;
