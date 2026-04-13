"use client";

import { useState } from "react";
import { Company } from "@prisma/client";
import { Edit2, Percent, X } from "lucide-react";
import { updateCompany } from "@/app/actions/company";

export function EditCompanyModal({ company }: { company: Company }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        type="button" 
        onClick={(e) => { e.preventDefault(); setIsOpen(true); }}
        className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-400/10 transition-colors mr-1" 
        title="Editar empresa"
      >
        <Edit2 className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card p-6 rounded-2xl relative w-full max-w-md max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold mb-2">Editar Empresa</h2>
            
            <p className="text-amber-500 text-xs mb-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <strong>Aviso:</strong> As alterações feitas aqui serão aplicadas apenas aos próximos dias de trabalho registados. O seu histórico não será alterado.
            </p>

            <form action={(formData) => {
              updateCompany(formData);
              setIsOpen(false);
            }} className="space-y-4">
              <input type="hidden" name="companyId" value={company.id} />
              
              <div>
                <label className="text-xs font-medium text-gray-400">Nome da Empresa / Local</label>
                <input name="name" type="text" defaultValue={company.name} required className="w-full mt-1 px-3 py-2 text-sm rounded-lg input-field" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400">Valor por Hora (€)</label>
                <input name="hourlyRate" type="number" step="0.01" defaultValue={company.hourlyRate} required className="w-full mt-1 px-3 py-2 text-sm rounded-lg input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-400">Desconto Fixo (€)</label>
                  <input name="fixedDeduction" type="number" step="0.01" defaultValue={company.fixedDeduction} className="w-full mt-1 px-3 py-2 text-sm rounded-lg input-field" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400">Desp. %. (Fonte)</label>
                  <div className="relative">
                    <input name="percentageDeduction" type="number" step="0.1" defaultValue={company.percentageDeduction} className="w-full mt-1 pl-3 pr-8 py-2 text-sm rounded-lg input-field" />
                    <Percent className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 mt-0.5" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400">Dia de Pagamento (Mês)</label>
                <input name="paymentDay" type="number" min={1} max={31} defaultValue={company.paymentDay || ""} className="w-full mt-1 px-3 py-2 text-sm rounded-lg input-field" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-2.5 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-white transition-colors text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg btn-primary text-sm">Guardar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
