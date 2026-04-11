"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addWorkSession(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const companyId = formData.get("companyId") as string;
  const hours = parseFloat(formData.get("hours") as string);
  const dateString = formData.get("date") as string;
  const description = formData.get("description") as string;

  if (!companyId || isNaN(hours) || !dateString) {
    throw new Error("Preencha todos os campos corretamente.");
  }

  // Buscar a empresa para aplicar as taxas
  const company = await prisma.company.findUnique({
    where: { id: companyId }
  });

  if (!company || company.userId !== session.user.id) {
    throw new Error("Empresa não encontrada.");
  }

  // Cálculo: (Horas * Taxa) - Desconto Fixo - % Imposto
  const grossEarnings = hours * company.hourlyRate;
  let netEarnings = grossEarnings - company.fixedDeduction;
  
  if (company.percentageDeduction > 0) {
    const tax = netEarnings * (company.percentageDeduction / 100);
    netEarnings = netEarnings - tax;
  }

  if (netEarnings < 0) netEarnings = 0; // Proteção para não ficar negativo

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
