"use client";

import { useActionState, useEffect } from "react";
import { registerUser } from "@/app/actions/auth";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await registerUser(formData);
      if (result.success) {
        // Redirecionar para o login em caso de sucesso
        router.push("/login?registered=true");
      }
      return result;
    },
    null
  );

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 rounded-2xl glass-card relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-[var(--primary)] blur-[60px]"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="mx-auto w-12 h-12 bg-[#18181b] rounded-xl border border-[#27272a] shadow-xl flex items-center justify-center mb-4">
            <Sparkles className="text-[var(--primary)] w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Comece a Acompanhar</h1>
          <p className="text-gray-400 text-sm">Crie sua conta para começar a gerir as suas horas e recebimentos.</p>
        </div>

        {state?.error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4 relative z-10">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 ml-1">Seu Nome</label>
            <input 
              name="name"
              type="text" 
              required
              className="w-full px-4 py-3 rounded-xl input-field"
              placeholder="Ex: João Silva"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 ml-1">E-mail</label>
            <input 
              name="email"
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl input-field"
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 ml-1">Senha</label>
            <input 
              name="password"
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl input-field"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full mt-6 py-3 rounded-xl btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isPending ? "Criando Conta..." : "Criar Conta Gratuita"}
            {!isPending && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8 relative z-10">
          Já tem conta?{" "}
          <Link href="/login" className="text-[var(--primary)] hover:underline font-medium">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
