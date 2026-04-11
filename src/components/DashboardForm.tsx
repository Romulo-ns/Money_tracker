"use client";

import { useActionState, useEffect, useState } from "react";
import { addWorkSession } from "@/app/actions/workSession";

export default function DashboardForm({ companies }: { companies: any[] }) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const formDate = formData.get("date") as string;
      if (!formDate) {
        // If empty string, set it explicitly to today
        const dt = new Date();
        dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
        formData.set("date", dt.toISOString().slice(0, 16));
      }
      return await addWorkSession(formData);
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
        <label className="text-xs font-medium text-gray-400">Empresa / Cliente</label>
        <select name="companyId" required className="w-full mt-1 px-3 py-2 text-sm rounded-lg input-field appearance-none bg-[var(--background)]">
          <option value="">Selecione...</option>
          {companies.map(c => (
             <option key={c.id} value={c.id}>{c.name} (€{c.hourlyRate}/h)</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-400">Horas (Ex: 4.5 para 4h30)</label>
        <input name="hours" type="number" step="0.5" min="0" required className="w-full mt-1 px-3 py-2 text-sm rounded-lg input-field" placeholder="Ex: 8" />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-400">Data e Hora (Opçional, Padrão: Agora)</label>
        <input name="date" type="datetime-local" className="w-full mt-1 px-3 py-2 text-sm rounded-lg input-field bg-[var(--background)] [color-scheme:dark]" />
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
