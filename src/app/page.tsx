import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import { Zap, Clock, Coins, AlertCircle } from "lucide-react";
import DashboardForm from "@/components/DashboardForm";
import PaymentConfirmButton from "@/components/PaymentConfirmButton";
import LandingPage from "@/components/LandingPage";
import { Company, WorkSession } from "@prisma/client";
import { EditMonthlyGoalModal } from "@/components/EditMonthlyGoalModal";
import { DeleteWorkSessionButton } from "@/components/DeleteWorkSessionButton";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return <LandingPage />;
  }

  const companies = await prisma.company.findMany({
    where: { userId: session.user.id }
  });

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
        <div className="w-20 h-20 bg-[var(--primary-glow)] rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Zap className="text-[var(--primary)] w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Bem-vindo ao Money Tracker!</h1>
        <p className="text-gray-400 mb-8 max-w-md">Para começar a contar suas horas e ganhos, você precisa configurar a sua primeira empresa (ou cliente).</p>
        <Link href="/companies" className="btn-primary px-8 py-3 rounded-full text-lg shadow-[0_0_20px_var(--primary-glow)]">
          Configurar Primeira Empresa
        </Link>
      </div>
    );
  }

  const now = new Date();
  
  // Mês Atual
  const startCurrent = startOfMonth(now);
  const endCurrent = endOfMonth(now);
  
  const currentMonthSessions = await prisma.workSession.findMany({
    where: {
      userId: session.user.id,
      date: { gte: startCurrent, lte: endCurrent }
    },
    include: { company: true },
    orderBy: { date: "desc" }
  });

  const totalCurrentEarnings = currentMonthSessions.reduce((acc, s) => acc + s.earnings, 0);
  const totalCurrentHours = currentMonthSessions.reduce((acc, s) => acc + s.duration, 0);

  // Mês Passado (Pendentes)
  const startLast = startOfMonth(subMonths(now, 1));
  const endLast = endOfMonth(subMonths(now, 1));

  const pendingLastMonth = await prisma.workSession.findMany({
    where: {
      userId: session.user.id,
      date: { gte: startLast, lte: endLast },
      received: false
    },
    include: { company: true },
    orderBy: { date: "desc" }
  });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { monthlyGoal: true }
  });

  const monthlyGoal = user?.monthlyGoal || 500;
  // Prevent division by zero if goal is somehow 0
  const progressPercentage = monthlyGoal > 0 ? Math.min((totalCurrentEarnings / monthlyGoal) * 100, 100) : 100;

  return (
    <div className="p-4 sm:p-8 space-y-8">
      
      {/* Gamificação: Barra de Progresso */}
      <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
        <div className="flex justify-between items-end mb-2">
          <div>
            <div className="flex items-center">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Meta Mensal de Ganhos</h2>
              <EditMonthlyGoalModal currentGoal={monthlyGoal} />
            </div>
            <div className="text-2xl font-bold flex items-baseline gap-2 mt-1">
              €{totalCurrentEarnings.toFixed(2)} <span className="text-sm font-normal text-gray-500">/ €{monthlyGoal.toFixed(2)}</span>
            </div>
          </div>
          {progressPercentage >= 100 && (
            <div className="px-3 py-1 bg-[var(--primary)] text-black text-xs font-bold rounded-full animate-bounce">
              Meta Atingida! 🎉
            </div>
          )}
        </div>
        <div className="w-full h-4 bg-[#27272a] rounded-full overflow-hidden mt-4">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-[var(--primary)] transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%`, boxShadow: '0 0 10px var(--primary)' }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Resumo do Mês */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-6 rounded-2xl border-t-4 border-t-[var(--primary)]">
              <div className="flex items-center gap-3 text-gray-400 mb-2">
                <Coins className="w-5 h-5 text-[var(--primary)]" />
                <span className="font-medium">Total do Mês</span>
              </div>
              <div className="text-4xl font-bold text-white">€{totalCurrentEarnings.toFixed(2)}</div>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center gap-3 text-gray-400 mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Horas Trabalhadas</span>
              </div>
              <div className="text-4xl font-bold text-white">{totalCurrentHours.toFixed(1)}<span className="text-2xl text-gray-500">h</span></div>
            </div>
          </div>

          {/* Avisos do Mês Passado */}
          {pendingLastMonth.length > 0 && (
            <div className="glass-card p-6 rounded-2xl border border-red-500/30 bg-red-500/5">
              <h3 className="text-red-400 font-bold flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5" /> 
                Pagamentos do mês passado pendentes!
              </h3>
              <div className="space-y-3">
                {pendingLastMonth.map((session: WorkSession & { company: Company }) => (
                  <div key={session.id} className="flex items-center justify-between bg-[#18181b] p-3 rounded-xl border border-[#27272a]">
                    <div>
                      <div className="font-semibold">{session.company.name}</div>
                      <div className="text-xs text-gray-400">{session.duration}h • €{session.earnings.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <PaymentConfirmButton sessionId={session.id} />
                      <DeleteWorkSessionButton sessionId={session.id} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Histórico do Mês Atual */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="font-semibold text-lg mb-4">Lançamentos Recentes</h3>
            {currentMonthSessions.length === 0 ? (
              <div className="text-center text-gray-500 py-8">Nenhum lançamento este mês ainda.</div>
            ) : (
              <div className="space-y-4">
                {currentMonthSessions.map((session: WorkSession & { company: Company }) => (
                  <div key={session.id} className="flex justify-between items-center pb-4 border-b border-[#27272a] last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium">{session.company.name} {session.description && <span className="text-gray-400 text-sm font-normal">— {session.description}</span>}</div>
                      <div className="text-xs text-gray-500 mt-1">{session.date.toLocaleDateString("pt-PT")} • {session.duration} horas</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right font-bold text-[var(--primary)]">
                        +€{session.earnings.toFixed(2)}
                      </div>
                      <DeleteWorkSessionButton sessionId={session.id} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lançamento Rápido */}
        <div className="glass-card p-6 rounded-2xl md:col-span-1 h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Zap className="text-[var(--primary)]" />
            Lançar Horas
          </h2>
          <DashboardForm companies={companies} />
        </div>

      </div>
    </div>
  );
}
