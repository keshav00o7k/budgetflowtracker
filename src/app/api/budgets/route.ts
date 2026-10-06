import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Budget from "@/models/Budget";

export async function GET() {
  try {
    await connectToDatabase();
    const budgets = await Budget.find().sort({ month: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: budgets.map((b) => ({
        month: b.month,
        budget: b.budget,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch budgets" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { month, budget } = body;

    if (!month || budget === undefined || budget < 0) {
      return NextResponse.json(
        { success: false, error: "Month and a valid non-negative budget amount are required" },
        { status: 400 },
      );
    }

    const updated = await Budget.findOneAndUpdate(
      { month },
      { month, budget: Number(budget) },
      { upsert: true, new: true },
    );

    return NextResponse.json({
      success: true,
      data: {
        month: updated.month,
        budget: updated.budget,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save budget" },
      { status: 500 },
    );
  }
}
