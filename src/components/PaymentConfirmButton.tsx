"use client";

import { useTransition, useState } from "react";
import { markAsReceived } from "@/app/actions/workSession";
import { Check } from "lucide-react";

export default function PaymentConfirmButton({ sessionId }: { sessionId: string }) {
  const [isPending, startTransition] = useTransition();
  const [marked, setMarked] = useState(false);

  const handleClick = () => {
    startTransition(async () => {
      await markAsReceived(sessionId);
      setMarked(true);
    });
  };

  if (marked) {
    return (
      <span className="text-emerald-400 font-bold text-sm flex items-center gap-1 animate-pulse">
        <Check className="w-4 h-4" /> Recebido
      </span>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-all ${
        isPending
          ? "bg-gray-700 text-gray-400"
          : "bg-[var(--primary)] text-black hover:scale-105 hover:shadow-[0_0_15px_var(--primary-glow)]"
      }`}
    >
      {isPending ? "Salvando..." : "Recebeu?"}
    </button>
  );
}
