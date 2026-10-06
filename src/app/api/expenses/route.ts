import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Expense from "@/models/Expense";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const month = searchParams.get("month");

    const query: Record<string, unknown> = {};
    if (category && category !== "all") query.category = category;
    if (month && month !== "all") {
      query.date = { $regex: `^${month}` };
    }

    const expenses = await Expense.find(query).sort({ date: -1 }).lean();

    return NextResponse.json({
      success: true,
      count: expenses.length,
      data: expenses.map((e) => ({
        id: e.id,
        amount: e.amount,
        date: e.date,
        note: e.note || "",
        category: e.category,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch expenses" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { id, amount, date, note, category } = body;

    if (!amount || amount <= 0 || !date || !category) {
      return NextResponse.json(
        { success: false, error: "Amount, date, and category are required" },
        { status: 400 },
      );
    }

    const expenseId = id || Math.random().toString(36).slice(2) + Date.now().toString(36);

    const newExpense = await Expense.create({
      id: expenseId,
      amount: Number(amount),
      date,
      note: note || "",
      category,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: newExpense.id,
          amount: newExpense.amount,
          date: newExpense.date,
          note: newExpense.note,
          category: newExpense.category,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create expense" },
      { status: 500 },
    );
  }
}
