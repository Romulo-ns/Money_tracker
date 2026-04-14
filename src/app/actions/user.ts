"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateMonthlyGoal(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const monthlyGoal = parseFloat(formData.get("monthlyGoal") as string);
  
  if (isNaN(monthlyGoal) || monthlyGoal < 0) {
    throw new Error("A meta deve ser um número válido.");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { monthlyGoal }
  });

  revalidatePath("/");
}
