"use client";

import { useState, useRef, useEffect } from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  isSameMonth,
  setHours,
  setMinutes
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar, Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  name?: string;
}

export default function DateTimePicker({ value, onChange, name }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1));
  const handleNextMonth = () => setViewDate(addMonths(viewDate, 1));

  const selectDay = (day: Date) => {
    const newDate = new Date(day);
    newDate.setHours(value.getHours());
    newDate.setMinutes(value.getMinutes());
    onChange(newDate);
    // Keep it open to adjust time if needed, or close it?
    // Let's close it only if the user clicks outside or on the X
  };

  const setTime = (hours: number, minutes: number) => {
    const newDate = setMinutes(setHours(value, hours), minutes);
    onChange(newDate);
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(viewDate), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(viewDate), { weekStartsOn: 1 })
  });

  const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  return (
    <div className="relative" ref={containerRef}>
      <input type="hidden" name={name} value={value.toISOString()} />
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-[#18181b] border border-[#27272a] rounded-xl hover:bg-[#27272a] transition-all group"
      >
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-gray-500 group-hover:text-[var(--primary)]" />
          <span className="text-sm text-white">
            {format(value, "dd 'de' MMMM, HH:mm", { locale: ptBR })}
          </span>
        </div>
        <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-90" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-[100] mt-2 right-0 left-0 sm:left-auto sm:w-[320px] bg-[#18181b] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-[#27272a] rounded-lg text-gray-400">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-white capitalize">
                  {format(viewDate, "MMMM yyyy", { locale: ptBR })}
                </span>
                <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-[#27272a] rounded-lg text-gray-400">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="p-1 hover:bg-[#27272a] rounded-full text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              <div className="grid grid-cols-7 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="text-[10px] uppercase font-bold text-gray-500 text-center">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map((day, i) => {
                  const isSelected = isSameDay(day, value);
                  const isCurrentMonth = isSameMonth(day, viewDate);
                  
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => selectDay(day)}
                      className={`
                        h-9 w-9 rounded-lg text-xs flex items-center justify-center transition-all
                        ${isSelected 
                          ? "bg-[var(--primary)] text-black font-bold" 
                          : isCurrentMonth 
                            ? "text-gray-300 hover:bg-[#27272a]" 
                            : "text-gray-600 hover:bg-[#27272a]"}
                      `}
                    >
                      {format(day, "d")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Picker */}
            <div className="p-4 bg-[#1e1e21] border-t border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-400 uppercase font-bold tracking-wider">
                <Clock className="w-3.5 h-3.5" /> Horário
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  min="0" 
                  max="23" 
                  value={value.getHours()} 
                  onChange={(e) => setTime(parseInt(e.target.value) || 0, value.getMinutes())}
                  className="w-12 h-8 bg-[#09090b] border border-[#27272a] rounded-lg text-center text-sm text-white focus:outline-none focus:border-[var(--primary)]"
                />
                <span className="text-gray-500">:</span>
                <input 
                  type="number" 
                  min="0" 
                  max="59" 
                  value={value.getMinutes()} 
                  onChange={(e) => setTime(value.getHours(), parseInt(e.target.value) || 0)}
                  className="w-12 h-8 bg-[#09090b] border border-[#27272a] rounded-lg text-center text-sm text-white focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
