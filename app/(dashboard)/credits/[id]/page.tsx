import { auth } from "@/lib/auth";
import { getLoanById } from "@/server/queries/loan-queries";
import { CreditDetailClient } from "@/components/credits/CreditDetailClient";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Crédito ${id} | Walta`,
  };
}

export default async function CreditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const loan = await getLoanById(id);
  if (!loan) {
    notFound();
  }

  return <CreditDetailClient loan={loan} />;
}
