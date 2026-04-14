"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addWorkSession(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Não autorizado" };
    }

    const companyId = formData.get("companyId") as string;
    const hours = parseFloat(formData.get("hours") as string);
    const dateString = formData.get("date") as string;
    const description = formData.get("description") as string;

    if (!companyId || isNaN(hours) || !dateString) {
      return { success: false, error: "Preencha todos os campos corretamente." };
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!company || company.userId !== session.user.id) {
      return { success: false, error: "Empresa não encontrada." };
    }

    const grossEarnings = hours * company.hourlyRate;
    let netEarnings = grossEarnings - company.fixedDeduction;
    
    if (company.percentageDeduction > 0) {
      const tax = netEarnings * (company.percentageDeduction / 100);
      netEarnings = netEarnings - tax;
    }

    if (netEarnings < 0) netEarnings = 0;

    await prisma.workSession.create({
      data: {
        userId: session.user.id,
        companyId: company.id,
        duration: hours,
        earnings: netEarnings,
        date: new Date(dateString),
        description,
      }
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erro ao adicionar sessão:", error);
    return { success: false, error: "Erro interno no servidor" };
  }
}

export async function markAsReceived(sessionId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autorizado");

  const workSession = await prisma.workSession.findUnique({
    where: { id: sessionId }
  });

  if (workSession?.userId === session.user.id) {
    await prisma.workSession.update({
      where: { id: sessionId },
      data: { received: true }
    });
    revalidatePath("/");
  }
}

export async function deleteWorkSession(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const sessionId = formData.get("sessionId") as string;
  if (!sessionId) {
    throw new Error("ID do lançamento é obrigatório.");
  }

  await prisma.workSession.deleteMany({
    where: {
      id: sessionId,
      userId: session.user.id,
    }
  });

  revalidatePath("/");
}
