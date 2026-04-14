"use client";

import { Trash2 } from "lucide-react";
import { deleteWorkSession } from "@/app/actions/workSession";

export function DeleteWorkSessionButton({ sessionId }: { sessionId: string }) {
  return (
    <form 
      action={deleteWorkSession}
      onSubmit={(e) => {
        if (!window.confirm("Tem certeza que deseja apagar este lançamento?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="sessionId" value={sessionId} />
      <button 
        type="submit" 
        className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-colors" 
        title="Apagar lançamento"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  );
}
