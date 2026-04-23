"use client";

import { useState, useRef, useEffect } from "react";
import { Company } from "@prisma/client";
import { Building2, ChevronRight, Check, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CompanySelectorProps {
  companies: Company[];
  value: string;
  onChange: (companyId: string) => void;
  name?: string;
}

export default function CompanySelector({ companies, value, onChange, name }: CompanySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCompany = companies.find(c => c.id === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <input type="hidden" name={name} value={value} />
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-[#18181b] border border-[#27272a] rounded-xl hover:bg-[#27272a] transition-all group text-left"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <Building2 className="w-4 h-4 text-gray-500 group-hover:text-[var(--primary)] shrink-0" />
          <div className="truncate">
            {selectedCompany ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-white font-medium truncate">{selectedCompany.name}</span>
                <span className="text-[10px] text-gray-500 font-bold bg-[#09090b] px-1.5 py-0.5 rounded">€{selectedCompany.hourlyRate}/h</span>
              </div>
            ) : (
              <span className="text-sm text-gray-500">Selecione uma empresa...</span>
            )}
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform shrink-0 ${isOpen ? "rotate-90" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-[100] mt-2 right-0 left-0 bg-[#18181b] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Search */}
            <div className="p-3 border-b border-[#27272a] relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Procurar empresa..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-sm text-white focus:outline-none focus:border-[var(--primary)] transition-all"
                autoFocus
              />
            </div>

            {/* List */}
            <div className="max-h-[240px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <button
                    key={company.id}
                    type="button"
                    onClick={() => {
                      onChange(company.id);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-xl transition-all text-left
                      ${company.id === value 
                        ? "bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20" 
                        : "hover:bg-[#27272a] text-gray-400 hover:text-white"}
                    `}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{company.name}</span>
                      <span className="text-xs opacity-70">€{company.hourlyRate.toFixed(2)}/h</span>
                    </div>
                    {company.id === value && <Check className="w-4 h-4" />}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500 italic">
                  Nenhuma empresa encontrada.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
