import mongoose from "mongoose";

const { Schema } = mongoose;

const IncomeSchema = new Schema(
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
      default: "income",
      // enum: ["income", "expense"],
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

export default mongoose.model("Income", IncomeSchema);
