"use client";

import { Trash2 } from "lucide-react";
import { deleteCompany } from "@/app/actions/company";

export function DeleteCompanyButton({ companyId }: { companyId: string }) {
  return (
    <form 
      action={deleteCompany}
      onSubmit={(e) => {
        if (!window.confirm("Atenção: Apagar esta empresa irá remover também todos os dias de trabalho e ganhos associados a ela! Tem a certeza que pretende continuar?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="companyId" value={companyId} />
      <button 
        type="submit" 
        className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400/10 transition-colors" 
        title="Apagar empresa (Atenção: apaga dados associados)"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </form>
  );
}
