import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth, signOut } from "@/auth";
import Link from "next/link";
import { Wallet, Settings, LogOut, Home } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Money Tracker",
  description: "Controle suas horas e seus ganhos extras",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="pt">
      <body className={inter.className}>
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
