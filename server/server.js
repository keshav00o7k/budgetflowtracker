import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "../.env.local" });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/budgetflow";

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schemas & Models
const ExpenseSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    note: { type: String, default: "" },
    category: { type: String, required: true },
  },
  { timestamps: true },
);

const BudgetSchema = new mongoose.Schema(
  {
    month: { type: String, required: true, unique: true },
    budget: { type: Number, required: true },
  },
  { timestamps: true },
);

const Expense = mongoose.model("Expense", ExpenseSchema);
const Budget = mongoose.model("Budget", BudgetSchema);

// Express Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Express Server is running" });
});

// Get all expenses
app.get("/api/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create expense
app.post("/api/expenses", async (req, res) => {
  try {
    const { id, amount, date, note, category } = req.body;
    const newExpense = await Expense.create({
      id: id || Math.random().toString(36).slice(2),
      amount: Number(amount),
      date,
      note: note || "",
      category,
    });
    res.status(201).json({ success: true, data: newExpense });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete expense
app.delete("/api/expenses/:id", async (req, res) => {
  try {
    await Expense.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all budgets
app.get("/api/budgets", async (req, res) => {
  try {
    const budgets = await Budget.find().sort({ month: -1 });
    res.json({ success: true, data: budgets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Set budget
app.post("/api/budgets", async (req, res) => {
  try {
    const { month, budget } = req.body;
    const updated = await Budget.findOneAndUpdate(
      { month },
      { month, budget: Number(budget) },
      { upsert: true, new: true },
    );
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Express API server is running on http://localhost:${PORT}`);
});
