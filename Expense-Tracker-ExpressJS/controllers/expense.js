import ExpenseSchema from "../models/ExpenseModel.js";

export const addExpense = async (req, res) => {
  try {
    const { title, amount, category, description, date, type = "expense" } = req.body;
    const user_id = req.userid;
    console.log(user_id);

    //validations
    if (!title || !category || !description || !date) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (amount <= 0 || typeof amount !== "number") {
      return res.status(400).json({ message: "Amount must be a positive number!" });
    }

    // Create and save expense
    const expense = ExpenseSchema({
      title,
      amount,
      type,
      category,
      description,
      date,
      user_id,
    });

    await expense.save();
    res.status(201).json({ message: "Expense Added", data: expense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Author's code
/* export const getExpense = async (req, res) => { 
  try {
    const expense = await ExpenseSchema.find("id").sort({ createdAt: -1 });
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; */

// Claude 3.7 Sonnet Code
export const getExpense = async (req, res) => {
  try {
    // Get the user ID from the authentication middleware
    const user_id = req.userid;

    // Find expenses belonging to the current user, sorted by newest first
    const expenses = await ExpenseSchema.find({ user_id: user_id }).sort({ createdAt: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Author's code
/* export const deleteExpense = async (req, res) => {
  const { id } = req.params;
  ExpenseSchema.findByIdAndDelete(id)
    .then((expense) => {
      res.status(200).json({ message: "Expense Deleted", data: expense });
    })
    .catch((err) => {
      res.status(500).json({ message: "Server Error" });
    });
}; */

// Claude 3.7 Sonnet Code
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.userid;

    // Find and delete expense only if it belongs to the authenticated user
    const expense = await ExpenseSchema.findOneAndDelete({
      _id: id,
      user_id: user_id
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found or you don't have permission to delete it"
      });
    }

    return res.status(200).json({ message: "Expense Deleted", data: expense });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};