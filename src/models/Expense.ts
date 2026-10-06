import mongoose, { Schema, Model, Document } from "mongoose";

export interface IExpense extends Document {
  id: string;
  amount: number;
  date: string;
  note: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    id: { type: String, required: true, unique: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: String, required: true, index: true },
    note: { type: String, default: "" },
    category: {
      type: String,
      required: true,
      enum: [
        "Food",
        "Grocery",
        "Fuel",
        "Shopping",
        "Travel",
        "Bills",
        "Entertainment",
        "Health",
        "Other",
      ],
      default: "Other",
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete (ret as Record<string, unknown>)._id;
        delete (ret as Record<string, unknown>).__v;
        return ret;
      },
    },
  },
);

const Expense: Model<IExpense> =
  mongoose.models.Expense || mongoose.model<IExpense>("Expense", ExpenseSchema);

export default Expense;
