"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede superar 50 caracteres")
    .trim(),
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Email inválido")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[a-zA-Z]/, "Debe incluir al menos una letra")
    .regex(/[0-9]/, "Debe incluir al menos un número"),
});

export type RegisterState = {
  ok: boolean;
  error?: string;
  email?: string;
};

export async function registerAction(
  _prev: RegisterState | undefined,
  formData: FormData
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, error: first?.message ?? "Datos inválidos" };
  }

  const { name, email, password } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return {
        ok: false,
        error: "Ya existe una cuenta con este email. Inicia sesión.",
      };
    }

    const hashed = await hashPassword(password);

    await prisma.user.create({
      data: {
        email,
        name,
        password: hashed,
      },
    });

    return { ok: true, email };
  } catch {
    return { ok: false, error: "No pudimos crear tu cuenta. Intenta de nuevo." };
  }
}