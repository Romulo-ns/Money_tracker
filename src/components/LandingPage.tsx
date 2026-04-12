"use client";

import Link from "next/link";
import { Zap, Clock, Coins, ChevronRight, BarChart3, ShieldCheck, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full pt-20 pb-16 px-6 text-center relative overflow-hidden">
        {/* Animated Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--primary-glow)] rounded-full blur-[120px] -z-10 animate-pulse"></div>
        
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold tracking-wider uppercase mb-4 animate-fade-in">
            <Zap className="w-3 h-3" /> 
            Novo: Modo Escuro Nativo
          </div>
          
          <h1 className="flex flex-col gap-2 items-center mb-10 leading-none">
            <span className="text-6xl md:text-9xl font-[1000] tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-100 to-emerald-500 bg-[length:200%_auto] animate-gradient-flow drop-shadow-[0_5px_15px_rgba(16,185,129,0.4)]">
              Money Tracker
            </span>
            <span className="text-2xl md:text-4xl font-bold text-white/80 tracking-tight mt-4">
              Domine seu tempo, maximize seus ganhos.
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A ferramenta definitiva para freelancers e profissionais autônomos que desejam profissionalismo no controle de horas e faturamento.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-[var(--primary)] text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-[0_0_30px_var(--primary-glow)] group"
            >
              Começar Agora Grátis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              Acessar minha conta
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="width-full max-w-5xl px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glass-card p-8 rounded-3xl group hover:border-emerald-500/50 transition-colors">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Rastreio Inteligente</h3>
            <p className="text-gray-400 leading-relaxed">
              Registre suas sessões de trabalho com precisão cirúrgica. Nunca mais perca um minuto faturável.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card p-8 rounded-3xl group hover:border-emerald-500/50 transition-colors">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
              <Coins className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Cálculo de Receita</h3>
            <p className="text-gray-400 leading-relaxed">
              Visualize seus ganhos em tempo real baseados em sua taxa horária configurada por cliente.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card p-8 rounded-3xl group hover:border-emerald-500/50 transition-colors">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Relatórios Visuais</h3>
            <p className="text-gray-400 leading-relaxed">
              Dashboards limpos e objetivos que mostram sua evolução mensal e metas atingidas.
            </p>
          </div>
        </div>
      </section>

      {/* Trust/Social Proof Section (Fictionalized for Premium feel) */}
      <section className="w-full max-w-5xl px-6 py-10 opacity-50 flex flex-wrap items-center justify-center gap-12 text-gray-500 font-medium grayscale mb-20">
        <div className="flex items-center gap-2 space-x-2">
          <ShieldCheck className="w-5 h-5" />
          <span>Segurança Nível Bancário</span>
        </div>
        <div>Privacidade por Design</div>
        <div>Fácil de Usar</div>
      </section>

      {/* Footer / CTA Final */}
      <footer className="w-full border-t border-white/5 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Coins className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-lg">Money Tracker</span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Money Tracker — Feito para quem valoriza seu tempo.
          </p>
        </div>
      </footer>
    </div>
  );
}
