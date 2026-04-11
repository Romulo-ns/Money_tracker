import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
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
        {session?.user && (
          <nav className="border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <Link href="/" className="flex items-center gap-2">
                  <Wallet className="text-[var(--primary)] w-6 h-6" />
                  <span className="font-bold text-lg tracking-tight">Money Tracker</span>
                </Link>
                <div className="flex items-center gap-6">
                  <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white flex items-center gap-2 transition-colors">
                    <Home className="w-4 h-4" /> Início
                  </Link>
                  <Link href="/companies" className="text-sm font-medium text-gray-300 hover:text-white flex items-center gap-2 transition-colors">
                    <Settings className="w-4 h-4" /> Empresas
                  </Link>
                  <form action="/api/auth/signout" method="POST">
                    <button type="submit" className="text-sm font-medium text-red-400 hover:text-red-300 flex items-center gap-2 transition-colors">
                      <LogOut className="w-4 h-4" /> Sair
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </nav>
        )}
        <main className="max-w-5xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
