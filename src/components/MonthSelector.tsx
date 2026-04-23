"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, addMonths, subMonths, setMonth, setYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MonthSelectorProps {
  currentMonth: number;
  currentYear: number;
  activeMonths: string[];
}

export default function MonthSelector({ currentMonth, currentYear, activeMonths }: MonthSelectorProps) {
  const router = useRouter();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(currentYear);
  const pickerRef = useRef<HTMLDivElement>(null);
  
  const date = new Date(currentYear, currentMonth - 1);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrev = () => {
    const prevDate = subMonths(date, 1);
    router.push(`/history?month=${prevDate.getMonth() + 1}&year=${prevDate.getFullYear()}`);
  };

  const handleNext = () => {
    const nextDate = addMonths(date, 1);
    router.push(`/history?month=${nextDate.getMonth() + 1}&year=${nextDate.getFullYear()}`);
  };

  const handleToday = () => {
    const today = new Date();
    router.push(`/history?month=${today.getMonth() + 1}&year=${today.getFullYear()}`);
  };

  const selectMonth = (monthIndex: number) => {
    router.push(`/history?month=${monthIndex + 1}&year=${pickerYear}`);
    setIsPickerOpen(false);
  };

  const months = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", 
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];

  return (
    <div className="relative">
      <div className="flex items-center justify-between bg-[#18181b] p-4 rounded-2xl border border-[#27272a] shadow-lg">
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev}
            className="p-2 hover:bg-[#27272a] rounded-full transition-colors text-gray-400 hover:text-white"
            title="Mês Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => setIsPickerOpen(!isPickerOpen)}
            className="flex flex-col items-center min-w-[150px] hover:bg-[#27272a] p-2 rounded-xl transition-all cursor-pointer group"
          >
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 flex items-center gap-1">
              Período <Search className="w-2 h-2 group-hover:text-[var(--primary)]" />
            </span>
            <span className="text-xl font-bold text-white capitalize group-hover:text-[var(--primary)] transition-colors">
              {format(date, "MMMM yyyy", { locale: ptBR })}
            </span>
          </button>

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

      {/* Month Picker Modal/Overlay */}
      <AnimatePresence>
        {isPickerOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            ref={pickerRef}
            className="absolute top-full left-0 mt-4 z-[60] w-full sm:w-[400px] bg-[#09090b] border border-[#27272a] rounded-2xl shadow-2xl p-6 glass-card"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setPickerYear(pickerYear - 1)}
                  className="p-1 hover:bg-[#27272a] rounded-lg text-gray-400"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xl font-bold text-white">{pickerYear}</span>
                <button 
                  onClick={() => setPickerYear(pickerYear + 1)}
                  className="p-1 hover:bg-[#27272a] rounded-lg text-gray-400"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={() => setIsPickerOpen(false)}
                className="p-2 hover:bg-[#27272a] rounded-full text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {months.map((m, index) => {
                const isActive = activeMonths.includes(`${pickerYear}-${index + 1}`);
                const isSelected = pickerYear === currentYear && index + 1 === currentMonth;

                return (
                  <button
                    key={m}
                    onClick={() => selectMonth(index)}
                    className={`
                      relative py-3 rounded-xl font-medium transition-all
                      ${isSelected 
                        ? "bg-[var(--primary)] text-black font-bold" 
                        : "bg-[#18181b] text-gray-400 hover:bg-[#27272a] hover:text-white"}
                    `}
                  >
                    {m}
                    {isActive && !isSelected && (
                      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--primary)] rounded-full shadow-[0_0_5px_var(--primary-glow)]"></div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-[#27272a] flex items-center justify-between text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></div>
                <span>Meses com movimento</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
