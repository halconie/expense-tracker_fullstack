import React, { useContext, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3001/api/transactions/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);

  //calculate incomes
  /* const addIncome = async (income) => {
    const response = await axios
      .post(`${BASE_URL}add-income`, income, {
        headers: {
          authorization: token,
        },
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
    getIncomes();
  };
 */

  // Income operations
  const addIncome = async (income) => {
    try {
      // Fix: Parse amount as number
      const incomeWithNumberAmount = {
        ...income,
        amount: parseFloat(income.amount)
      };

      const response = await axios.post(`${BASE_URL}add-income`, incomeWithNumberAmount, {
        headers: {
          authorization: token,
        },
      });
      console.log("Income added:", response.data);
      getIncomes();
    } catch (err) {
      console.error("Error adding income:", err);
      setError(err.response?.data?.message || "Failed to add income");
    }
  };

  const getIncomes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}get-incomes`, {
        headers: {
          authorization: token,
        }
      });
      setIncomes(response.data);
      // console.log(response.data);
    } catch (err) {
      console.error("Error getting incomes:", err);
      setError(err.response?.data?.message || "Failed to get incomes");
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axios.delete(`${BASE_URL}delete-income/${id}`, {
        headers: {
          authorization: token,
        }
      });
      getIncomes();
    } catch (err) {
      console.error("Error deleting income:", err);
      setError(err.response?.data?.message || "Failed to delete incomes");
    }
  };

  const totalIncomes = () => {
    let totalIncome = 0;
    incomes.forEach((income) => {
      totalIncome = totalIncome + parseFloat(income.amount);
    });

    return totalIncome;
  };

  //calculate expenses
  /* const addExpense = async (expense) => {
    const response = await axios
      .post(`${BASE_URL}add-expense`, expense, {
        headers: {
          authorization: token,
        },
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
    getExpenses();
  }; */

  // Expense operations
  const addExpense = async (expense) => {
    try {
      // Fix: Parse amount as number
      const expenseWithNumberAmount = {
        ...expense,
        amount: parseFloat(expense.amount)
      };

      const response = await axios.post(`${BASE_URL}add-expense`, expenseWithNumberAmount, {
        headers: {
          authorization: token, // Fix: Add authorization header
        },
      });
      console.log("Expense added:", response.data);
      getExpenses();
    } catch (err) {
      console.error("Error adding expense:", err);
      setError(err.response?.data?.message || "Failed to add expense");
    }
  };

  const getExpenses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}get-expenses`, {
        headers: {
          authorization: token, // Fix: Add missing authorization header
        }
      });
      setExpenses(response.data);
    } catch (err) {
      console.error("Error getting expenses:", err);
      setError(err.response?.data?.message || "Failed to get expenses");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${BASE_URL}delete-expense/${id}`, {
        headers: {
          authorization: token, // Fix: Add missing authorization header
        }
      });
      getExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError(err.response?.data?.message || "Failed to delete expense");
    }
  };

  const totalExpenses = () => {
    let totalExpense = 0;
    expenses.forEach((expense) => {
      totalExpense = totalExpense + parseFloat(expense.amount);
    });

    return totalExpense;
  };

  const totalBalance = () => {
    return totalIncomes() - totalExpenses();
  };

  const transactionHistory = () => {
    const history = [...incomes, ...expenses];
    history.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return history.slice(0, 3);
  };

  return (
    <GlobalContext.Provider
      value={{
        addIncome,
        getIncomes,
        incomes,
        deleteIncome,
        expenses,
        totalIncomes,
        addExpense,
        getExpenses,
        deleteExpense,
        totalExpenses,
        totalBalance,
        transactionHistory,
        error,
        setError,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
