"use client";

import { useActionState } from "react";
import { addWorkSession } from "@/app/actions/workSession";
import { Company } from "@prisma/client";
import DateTimePicker from "./DateTimePicker";
import CompanySelector from "./CompanySelector";
import { useState } from "react";

export default function DashboardForm({ companies }: { companies: Company[] }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      // The custom picker handles its own hidden input named "date"
      return (await addWorkSession(formData)) as { success: boolean, error?: string };
    },
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
          {state.error}
        </div>
      )}
      
      <div>
        <label className="text-xs font-medium text-gray-400 mb-1 block">Empresa / Cliente</label>
        <CompanySelector 
          name="companyId" 
          companies={companies} 
          value={selectedCompanyId} 
          onChange={setSelectedCompanyId} 
        />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-400">Horas (Ex: 4.5 para 4h30)</label>
        <input name="hours" type="number" step="0.5" min="0" required className="w-full mt-1 px-3 py-2 text-sm rounded-lg input-field" placeholder="Ex: 8" />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-400 mb-1 block">Data e Hora</label>
        <DateTimePicker 
          name="date" 
          value={selectedDate} 
          onChange={setSelectedDate} 
        />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-400">Descrição (Opcional)</label>
        <input name="description" type="text" className="w-full mt-1 px-3 py-2 text-sm rounded-lg input-field" placeholder="Ex: Manutenção Servidor" />
      </div>

      <button type="submit" disabled={isPending} className="w-full py-3 mt-4 rounded-xl btn-primary text-sm shadow-[0_0_15px_var(--primary-glow)] disabled:opacity-50">
        {isPending ? "Gravando..." : "Lançar Trabalho"}
      </button>
    </form>
  );
}
