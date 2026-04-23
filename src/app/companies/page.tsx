import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { startOfYear, endOfYear } from "date-fns";
import { Building2, Plus, Percent, TrendingUp, Coins, Globe, Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import { createCompany } from "@/app/actions/company";
import { DeleteCompanyButton } from "@/components/DeleteCompanyButton";
import { EditCompanyModal } from "@/components/EditCompanyModal";

export default async function CompaniesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const now = new Date();
  const yearStart = startOfYear(now);
  const yearEnd = endOfYear(now);

  const [companies, annualEarnings, allTimeEarnings, allTimeAggregate] = await Promise.all([
    prisma.company.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }
    }),
    prisma.workSession.groupBy({
      by: ['companyId'],
      where: {
        userId: session.user.id,
        date: { gte: yearStart, lte: yearEnd }
      },
      _sum: { earnings: true }
    }),
    prisma.workSession.groupBy({
      by: ['companyId'],
      where: { userId: session.user.id },
      _sum: { earnings: true }
    }),
    prisma.workSession.aggregate({
      where: { userId: session.user.id },
      _sum: { earnings: true }
    })
  ]);

  const totalAllTime = allTimeAggregate._sum.earnings || 0;
  const totalAnnual = annualEarnings.reduce((acc, curr) => acc + (curr._sum.earnings || 0), 0);

  const companiesWithStats = companies.map(company => ({
    ...company,
    annualTotal: annualEarnings.find(e => e.companyId === company.id)?._sum.earnings || 0,
    allTimeTotal: allTimeEarnings.find(e => e.companyId === company.id)?._sum.earnings || 0
  }));

  return (
    <div className="p-4 sm:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Minhas Empresas</h1>
          <p className="text-gray-400 text-sm">Configure seus locais de trabalho e taxas.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="glass-card px-6 py-4 rounded-2xl border-l-4 border-l-emerald-500 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <Coins className="text-emerald-500 w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Total ({now.getFullYear()})</div>
              <div className="text-2xl font-bold text-white">€{totalAnnual.toFixed(2)}</div>
            </div>
          </div>

          <div className="glass-card px-6 py-4 rounded-2xl border-l-4 border-l-blue-500 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Globe className="text-blue-500 w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Total de Sempre</div>
              <div className="text-2xl font-bold text-white">€{totalAllTime.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Formulário de Criação (Card Inicial) */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-glow)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 relative z-10">
            <Plus className="text-[var(--primary)]" />
            Nova Empresa
          </h2>
          <form action={createCompany} className="space-y-4 relative z-10">
            <div>
              <label className="text-xs font-medium text-gray-400">Nome da Empresa / Local</label>
              <input name="name" type="text" required className="w-full mt-1 px-3 py-2 text-sm rounded-lg input-field" placeholder="Ex: Escritório Centro" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400">Valor por Hora (€)</label>
              <input name="hourlyRate" type="number" step="0.01" required className="w-full mt-1 px-3 py-2 text-sm rounded-lg input-field" placeholder="Ex: 8.50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-400">Desconto Fixo (€)</label>
                <input name="fixedDeduction" type="number" step="0.01" defaultValue="0" className="w-full mt-1 px-3 py-2 text-sm rounded-lg input-field" placeholder="0.00" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400">Desp. %. (Fonte)</label>
                <div className="relative">
                  <input name="percentageDeduction" type="number" step="0.1" defaultValue="0" className="w-full mt-1 pl-3 pr-8 py-2 text-sm rounded-lg input-field" placeholder="0" />
                  <Percent className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 mt-0.5" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400">Dia de Pagamento (Mês)</label>
              <input name="paymentDay" type="number" min={1} max={31} className="w-full mt-1 px-3 py-2 text-sm rounded-lg input-field" placeholder="Ex: 5" />
            </div>
            <button type="submit" className="w-full py-2.5 mt-2 rounded-lg btn-primary text-sm">Adicionar Empresa</button>
          </form>
        </div>

        {/* Lista de Empresas */}
        {companiesWithStats.map((company) => (
          <div key={company.id} className="glass-card p-6 rounded-2xl flex flex-col justify-between group relative">
            <div className="absolute top-6 right-6 flex items-center">
              <EditCompanyModal company={company} />
              <DeleteCompanyButton companyId={company.id} />
            </div>
            <div>
              <div className="w-10 h-10 bg-[#18181b] rounded-xl border border-[#27272a] shadow-md flex items-center justify-center mb-4">
                <Building2 className="text-[var(--primary)] w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{company.name}</h2>
              <div className="space-y-1 text-sm text-gray-300">
                <p>Taxa: <span className="font-semibold text-white">€{company.hourlyRate.toFixed(2)}/h</span></p>
                {company.fixedDeduction > 0 && <p>Fixo: <span className="text-red-400">-€{company.fixedDeduction.toFixed(2)}</span></p>}
                {company.percentageDeduction > 0 && <p>Imposto: <span className="text-red-400">-{company.percentageDeduction}%</span></p>}
                {company.paymentDay && (
                  <p className="flex items-center gap-1.5 mt-2 text-xs text-[var(--primary)] font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    Pagamento: dia {company.paymentDay}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-[#27272a] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Este Ano:</span>
                  <span className="font-bold text-white">€{company.annualTotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>Total de Sempre:</span>
                <span className="font-bold text-white">€{company.allTimeTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
