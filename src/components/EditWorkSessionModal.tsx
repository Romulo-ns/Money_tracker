"use client";

import { useState } from "react";
import { Company, WorkSession } from "@prisma/client";
import { Edit2, X, Calendar, Clock, FileText, Building2 } from "lucide-react";
import { updateWorkSession } from "@/app/actions/workSession";
import DateTimePicker from "./DateTimePicker";
import CompanySelector from "./CompanySelector";

export function EditWorkSessionModal({ 
  workSession, 
  companies 
}: { 
  workSession: WorkSession & { company: Company }, 
  companies: Company[] 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date(workSession.date));
  const [selectedCompanyId, setSelectedCompanyId] = useState(workSession.companyId);

  async function handleUpdate(formData: FormData) {
    setLoading(true);
    try {
      await updateWorkSession(formData);
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Ocorreu um erro ao atualizar o lançamento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button 
        type="button" 
        onClick={() => setIsOpen(true)}
        className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-400/10 transition-colors" 
        title="Editar lançamento"
      >
        <Edit2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card p-6 rounded-2xl relative w-full max-w-md max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => !loading && setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Edit2 className="text-[var(--primary)] w-5 h-5" />
              Editar Lançamento
            </h2>
            
            <form action={handleUpdate} className="space-y-4">
              <input type="hidden" name="sessionId" value={workSession.id} />
              
              <div>
                <label className="text-xs font-medium text-gray-400 flex items-center gap-2 mb-1 uppercase tracking-wider">
                  <Building2 className="w-3 h-3" /> Empresa / Cliente
                </label>
                <CompanySelector 
                  name="companyId" 
                  companies={companies} 
                  value={selectedCompanyId} 
                  onChange={setSelectedCompanyId} 
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-400 flex items-center gap-2 mb-1 uppercase tracking-wider">
                  <Clock className="w-3 h-3" /> Horas (Ex: 4.5 para 4h30)
                </label>
                <input 
                  name="hours" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  defaultValue={workSession.duration} 
                  required 
                  className="w-full px-3 py-2 text-sm rounded-lg input-field" 
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-400 flex items-center gap-2 mb-1 uppercase tracking-wider">
                  <Calendar className="w-3 h-3" /> Data e Hora
                </label>
                <DateTimePicker 
                  name="date" 
                  value={selectedDate} 
                  onChange={setSelectedDate} 
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-400 flex items-center gap-2 mb-1 uppercase tracking-wider">
                  <FileText className="w-3 h-3" /> Descrição (Opcional)
                </label>
                <input 
                  name="description" 
                  type="text" 
                  defaultValue={workSession.description || ""}
                  className="w-full px-3 py-2 text-sm rounded-lg input-field" 
                  placeholder="Ex: Manutenção Servidor" 
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => !loading && setIsOpen(false)} 
                  className="flex-1 py-2.5 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-white transition-colors text-sm font-medium"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 rounded-xl btn-primary text-sm font-bold shadow-[0_0_15px_var(--primary-glow)] disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "A Guardar..." : "Guardar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
