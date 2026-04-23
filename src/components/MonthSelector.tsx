"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { format, addMonths, subMonths, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export default function MonthSelector({ currentMonth, currentYear }: { currentMonth: number; currentYear: number }) {
  const router = useRouter();
  const date = new Date(currentYear, currentMonth - 1);

  const handlePrev = () => {
    const prevDate = subMonths(date, 1);
    const m = prevDate.getMonth() + 1;
    const y = prevDate.getFullYear();
    router.push(`/history?month=${m}&year=${y}`);
  };

  const handleNext = () => {
    const nextDate = addMonths(date, 1);
    const m = nextDate.getMonth() + 1;
    const y = nextDate.getFullYear();
    router.push(`/history?month=${m}&year=${y}`);
  };

  const handleToday = () => {
    const today = new Date();
    const m = today.getMonth() + 1;
    const y = today.getFullYear();
    router.push(`/history?month=${m}&year=${y}`);
  };

  return (
    <div className="flex items-center justify-between bg-[#18181b] p-4 rounded-2xl border border-[#27272a] shadow-lg">
      <div className="flex items-center gap-4">
        <button 
          onClick={handlePrev}
          className="p-2 hover:bg-[#27272a] rounded-full transition-colors text-gray-400 hover:text-white"
          title="Mês Anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col items-center min-w-[150px]">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Período</span>
          <span className="text-xl font-bold text-white capitalize">
            {format(date, "MMMM yyyy", { locale: ptBR })}
          </span>
        </div>

        <button 
          onClick={handleNext}
          className="p-2 hover:bg-[#27272a] rounded-full transition-colors text-gray-400 hover:text-white"
          title="Próximo Mês"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <button 
        onClick={handleToday}
        className="flex items-center gap-2 px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white text-sm font-medium rounded-xl transition-all active:scale-95"
      >
        <Calendar className="w-4 h-4" />
        Mês Atual
      </button>
    </div>
  );
}
