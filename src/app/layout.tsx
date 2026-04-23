import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth, signOut } from "@/auth";
import Link from "next/link";
import { Wallet, Settings, LogOut, Home, History } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://money-tracker-pro.vercel.app/"),
  title: "Money Tracker | Controle seu dinheiro e tempo",
  description: "A plataforma definitiva para freelancers e trabalhadores autônomos gerenciarem suas horas, empresas e ganhos mensais de forma profissional.",
  keywords: ["money tracker", "financeiro", "gestão de tempo", "freelancer", "controle de ganhos", "produtividade"],
  authors: [{ name: "Money Tracker Team" }],
  openGraph: {
    title: "Money Tracker | Gestão Financeira para Autônomos",
    description: "Controle suas horas e ganhos extras com facilidade. Configure metas mensais e gerencie suas empresas em um só lugar.",
    url: "https://money-tracker-pro.vercel.app/",
    siteName: "Money Tracker",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Money Tracker | Gestão Financeira para Autônomos",
    description: "Simplifique sua vida financeira. Monitore seu trabalho e alcance suas metas mensais.",
    creator: "@moneytracker",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="pt">
      <body className={inter.className} suppressHydrationWarning>
        <nav className="border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wallet className="text-black w-5 h-5" />
                </div>
                <span className="font-bold text-lg tracking-tight">Money Tracker</span>
              </Link>
              <div className="flex items-center gap-6">
                {session?.user ? (
                  <>
                    <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white flex items-center gap-2 transition-colors">
                      <Home className="w-4 h-4" /> Início
                    </Link>
                    <Link href="/history" className="text-sm font-medium text-gray-300 hover:text-white flex items-center gap-2 transition-colors">
                      <History className="w-4 h-4" /> Histórico
                    </Link>
                    <Link href="/companies" className="text-sm font-medium text-gray-300 hover:text-white flex items-center gap-2 transition-colors">
                      <Settings className="w-4 h-4" /> Empresas
                    </Link>
                    <form action={async () => {
                      "use server";
                      await signOut();
                    }}>
                      <button type="submit" className="text-sm font-medium text-red-400 hover:text-red-300 flex items-center gap-2 transition-colors cursor-pointer">
                        <LogOut className="w-4 h-4" /> Sair
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                      Entrar
                    </Link>
                    <Link href="/register" className="btn-primary px-4 py-2 rounded-xl text-sm shadow-[0_0_15px_var(--primary-glow)]">
                      Criar Conta
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
