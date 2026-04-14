"use client";

import { useState } from "react";
import { Edit2, X } from "lucide-react";
import { updateMonthlyGoal } from "@/app/actions/user";

export function EditMonthlyGoalModal({ currentGoal }: { currentGoal: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleUpdate(formData: FormData) {
    setLoading(true);
    await updateMonthlyGoal(formData);
    setLoading(false);
    setIsOpen(false);
  }

  return (
    <>
      <button 
        type="button" 
        onClick={() => setIsOpen(true)}
        className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors ml-2" 
        title="Editar meta mensal"
      >
        <Edit2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card p-6 rounded-2xl relative w-full max-w-sm">
            <button 
              onClick={() => !loading && setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Editar Meta Mensal</h2>
            
            <form action={handleUpdate} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-400">Objetivo Mensal (€)</label>
                <input 
                  name="monthlyGoal" 
                  type="number" 
                  step="1" 
                  defaultValue={currentGoal} 
                  required 
                  className="w-full mt-1 px-3 py-2 text-sm rounded-lg input-field" 
                  autoFocus
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => !loading && setIsOpen(false)} className="flex-1 py-2.5 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-white transition-colors text-sm" disabled={loading}>Cancelar</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg btn-primary text-sm" disabled={loading}>
                  {loading ? "A Guardar..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
