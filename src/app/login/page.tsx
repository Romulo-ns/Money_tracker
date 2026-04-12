"use client";

import { useActionState, useEffect } from "react";
import { loginUser } from "@/app/actions/auth";
import Link from "next/link";
import { ArrowRight, Wallet } from "lucide-react";
import SocialLogin from "@/components/SocialLogin";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await loginUser(formData);
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
            <Wallet className="text-[var(--primary)] w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Bem-vindo de volta!</h1>
          <p className="text-gray-400 text-sm">Controle as suas horas extras e saiba exatamente o que receber.</p>
        </div>

        {state?.error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4 relative z-10">
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
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full mt-6 py-3 rounded-xl btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isPending ? "Entrando..." : "Entrar na Conta"}
            {!isPending && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <SocialLogin />

        <p className="text-center text-sm text-gray-400 mt-8 relative z-10">
          Ainda não tem conta?{" "}
          <Link href="/register" className="text-[var(--primary)] hover:underline font-medium">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
