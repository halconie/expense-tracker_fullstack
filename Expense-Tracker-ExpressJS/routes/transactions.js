import express from "express";
const router = express.Router();
import {
  addExpense,
  getExpense,
  deleteExpense,
} from "../controllers/expense.js";
import { addIncome, getIncomes, deleteIncome } from "../controllers/income.js";

import auth from "../config/middleware.js";

// Apply auth middleware first to protect all routes
router.use(auth);

// Now all these routes require authentication
router.get("/get-incomes", getIncomes);
router.delete("/delete-income/:id", deleteIncome);
router.get("/get-expenses", getExpense);
router.delete("/delete-expense/:id", deleteExpense);
router.post("/add-income", addIncome);
router.post("/add-expense", addExpense);

export default router;
