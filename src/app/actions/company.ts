"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCompany(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const name = formData.get("name") as string;
  const hourlyRate = parseFloat(formData.get("hourlyRate") as string);
  const fixedDeduction = parseFloat(formData.get("fixedDeduction") as string) || 0;
  const percentageDeduction = parseFloat(formData.get("percentageDeduction") as string) || 0;
  
  const paymentDayString = formData.get("paymentDay") as string;
  const paymentDay = paymentDayString ? parseInt(paymentDayString, 10) : null;

  if (!name || isNaN(hourlyRate)) {
    throw new Error("Nome e Valor por Hora são obrigatórios.");
  }

  await prisma.company.create({
    data: {
      name,
      hourlyRate,
      fixedDeduction,
      percentageDeduction,
      paymentDay,
      userId: session.user.id,
    }
  });

  revalidatePath("/companies");
  revalidatePath("/");
}

export async function deleteCompany(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const companyId = formData.get("companyId") as string;
  if (!companyId) {
    throw new Error("ID da empresa é obrigatório.");
  }

  await prisma.company.deleteMany({
    where: {
      id: companyId,
      userId: session.user.id,
    }
  });

  revalidatePath("/companies");
  revalidatePath("/");
}
