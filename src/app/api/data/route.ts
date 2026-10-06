import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Expense from "@/models/Expense";
import Budget from "@/models/Budget";
import Settings from "@/models/Settings";
import { rebuildHistory } from "@/lib/budget/utils";
import type { AppData } from "@/lib/budget/types";

export async function GET() {
  try {
    await connectToDatabase();

    const [budgets, expenses, settingsDoc] = await Promise.all([
      Budget.find().sort({ month: -1 }).lean(),
      Expense.find().sort({ date: -1 }).lean(),
      Settings.findOne().lean(),
    ]);

    const formattedBudgets = budgets.map((b) => ({
      month: b.month,
      budget: b.budget,
    }));

    const formattedExpenses = expenses.map((e) => ({
      id: e.id,
      amount: e.amount,
      date: e.date,
      note: e.note || "",
      category: e.category as any,
    }));

    const currency = settingsDoc?.currency || "₹";

    const appData: AppData = {
      budgets: formattedBudgets,
      expenses: formattedExpenses,
      history: [],
      settings: { currency },
    };

    appData.history = rebuildHistory(appData);

    return NextResponse.json({
      success: true,
      data: appData,
      source: "mongodb",
    });
  } catch (error: any) {
    console.warn("MongoDB connection failed, falling back to client storage:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch data from MongoDB",
        source: "fallback",
      },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { action, data } = body;

    if (action === "reset") {
      await Promise.all([Expense.deleteMany({}), Budget.deleteMany({})]);
      return NextResponse.json({ success: true, message: "All data reset successfully" });
    }

    if (action === "import" && data) {
      const { budgets = [], expenses = [], settings } = data;

      await Promise.all([Expense.deleteMany({}), Budget.deleteMany({})]);

      if (budgets.length > 0) {
        await Budget.insertMany(
          budgets.map((b: any) => ({ month: b.month, budget: b.budget })),
        );
      }

      if (expenses.length > 0) {
        await Expense.insertMany(
          expenses.map((e: any) => ({
            id: e.id || Math.random().toString(36).slice(2),
            amount: e.amount,
            date: e.date,
            note: e.note || "",
            category: e.category,
          })),
        );
      }

      if (settings?.currency) {
        await Settings.findOneAndUpdate(
          {},
          { currency: settings.currency },
          { upsert: true, new: true },
        );
      }

      return NextResponse.json({ success: true, message: "Data imported successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to perform data action" },
      { status: 500 },
    );
  }
}
