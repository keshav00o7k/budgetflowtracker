"use client";

import { useEffect, useState } from "react";
import BudgetApp from "@/components/budget/BudgetApp";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-[#050505]">
            <span className="text-sm font-bold tracking-tight text-white">BF</span>
          </div>
          <span className="text-sm text-neutral-400">Loading Budget Flow...</span>
        </div>
      </div>
    );
  }

  return <BudgetApp />;
}
