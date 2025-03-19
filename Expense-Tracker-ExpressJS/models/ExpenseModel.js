import mongoose from "mongoose";

const { Schema } = mongoose;

const ExpenseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 20,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      default: "expense",
      enum: ["expense", "income"],
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxLength: 200,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", ExpenseSchema);
