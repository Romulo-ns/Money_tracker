import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth } from "date-fns";
import { Coins, Clock, ArrowLeft, History as HistoryIcon } from "lucide-react";
import Link from "next/link";
import MonthSelector from "@/components/MonthSelector";
import { EditWorkSessionModal } from "@/components/EditWorkSessionModal";
import { DeleteWorkSessionButton } from "@/components/DeleteWorkSessionButton";
import LandingPage from "@/components/LandingPage";
import { Company, WorkSession } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{
    month?: string;
    year?: string;
  }>;
}

export default async function HistoryPage({ searchParams }: PageProps) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return <LandingPage />;
  }

  const { month, year } = await searchParams;

  const now = new Date();
  const currentMonth = month ? parseInt(month) : now.getMonth() + 1;
  const currentYear = year ? parseInt(year) : now.getFullYear();

  const startDate = startOfMonth(new Date(currentYear, currentMonth - 1));
  const endDate = endOfMonth(new Date(currentYear, currentMonth - 1));

  const companies = await prisma.company.findMany({
    where: { userId: session.user.id }
  });

  const sessions = await prisma.workSession.findMany({
    where: {
      userId: session.user.id,
      date: { gte: startDate, lte: endDate }
    },
    include: { company: true },
    orderBy: { date: "desc" }
  });

  // Buscar meses que tiveram atividade
  const allUserSessions = await prisma.workSession.findMany({
    where: { userId: session.user.id },
    select: { date: true }
  });

  const activeMonths = Array.from(new Set(
    allUserSessions.map(s => `${s.date.getFullYear()}-${s.date.getMonth() + 1}`)
  ));

  const totalEarnings = sessions.reduce((acc, s) => acc + s.earnings, 0);
  const totalHours = sessions.reduce((acc, s) => acc + s.duration, 0);

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-[#27272a] rounded-full transition-colors text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <HistoryIcon className="text-[var(--primary)] w-6 h-6" />
              Histórico de Recebimentos
            </h1>
            <p className="text-gray-400 text-sm">Visualize e gerencie seus ganhos passados</p>
          </div>
        </div>
      </div>

      <MonthSelector 
        currentMonth={currentMonth} 
        currentYear={currentYear} 
        activeMonths={activeMonths}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border-t-4 border-t-[var(--primary)]">
          <div className="flex items-center gap-3 text-gray-400 mb-2">
            <Coins className="w-5 h-5 text-[var(--primary)]" />
            <span className="font-medium">Total do Período</span>
          </div>
          <div className="text-4xl font-bold text-white">€{totalEarnings.toFixed(2)}</div>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-3 text-gray-400 mb-2">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Horas Trabalhadas</span>
          </div>
          <div className="text-4xl font-bold text-white">
            {totalHours.toFixed(1)}<span className="text-2xl text-gray-500">h</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl">Lançamentos</h3>
          <span className="bg-[#27272a] text-xs font-bold px-3 py-1 rounded-full text-gray-300">
            {sessions.length} {sessions.length === 1 ? 'lançamento' : 'lançamentos'}
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-[#18181b] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#27272a]">
              <HistoryIcon className="text-gray-600 w-8 h-8" />
            </div>
            <p className="text-gray-500 font-medium">Nenhum lançamento encontrado para este período.</p>
            <Link href="/" className="text-[var(--primary)] text-sm hover:underline mt-2 inline-block">
              Voltar ao dashboard para lançar horas
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session: WorkSession & { company: Company }) => (
              <div 
                key={session.id} 
                className="flex justify-between items-center pb-4 border-b border-[#27272a] last:border-0 last:pb-0 group transition-colors"
              >
                <div>
                  <div className="font-medium text-white group-hover:text-[var(--primary)] transition-colors">
                    {session.company.name} 
                    {session.description && (
                      <span className="text-gray-400 text-sm font-normal"> — {session.description}</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {session.date.toLocaleDateString("pt-PT")} • {session.duration} horas
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right font-bold text-[var(--primary)] mr-2">
                    +€{session.earnings.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-1">
                    <EditWorkSessionModal workSession={session} companies={companies} />
                    <DeleteWorkSessionButton sessionId={session.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
