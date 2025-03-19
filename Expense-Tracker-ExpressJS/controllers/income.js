import IncomeSchema from "../models/IncomeModel.js";

export const addIncome = async (req, res) => {
  try {
    const { title, amount, category, description, date, type = "income" } = req.body;
    const user_id = req.userid;
    console.log(user_id);

    //validations
    if (!title || !category || !description || !date) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (amount <= 0 || typeof amount !== "number") {
      return res.status(400).json({ message: "Amount must be a positive number!" });
    }

    // Create and save income
    const income = IncomeSchema({
      title,
      amount,
      type,
      category,
      description,
      date,
      user_id,
    });

    await income.save();
    res.status(201).json({ message: "Income Added", data: income });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Author's code
/* export const getIncomes = async (req, res) => {
  try {
    const incomes = await IncomeSchema.find().sort({ createdAt: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}; */

// Claude 3.7 Sonnet Code
export const getIncomes = async (req, res) => {
  try {
    // Get the user ID from the authentication middleware
    const user_id = req.userid;

    // Find incomes belonging to the current user, sorted by newest first
    const incomes = await IncomeSchema.find({ user_id: user_id }).sort({ createdAt: -1 });

    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Author's code
/* export const deleteIncome = async (req, res) => {
  const { id } = req.params;
  IncomeSchema.findByIdAndDelete(id)
    .then((income) => {
      res.status(200).json({ message: "Income Deleted" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Server Error" });
    });
}; */

// Claude 3.7 Sonnet Code
export const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.userid;

    // Find and delete income only if it belongs to the authenticated user
    const income = await IncomeSchema.findOneAndDelete({
      _id: id,
      user_id: user_id
    });

    if (!income) {
      return res.status(404).json({
        message: "Income not found or you don't have permission to delete it"
      });
    }

    return res.status(200).json({ message: "Expense Deleted", data: income });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};