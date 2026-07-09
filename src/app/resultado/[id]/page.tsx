import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { ResultDisplay } from "@/components/result/ResultDisplay";
import type { Session, Result } from "@/lib/types";

export const metadata = {
  title: "Seu Resultado Vocal — Camila Aguiar Fonoaudióloga",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultadoPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data: session } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", id)
    .single();

  if (!session) notFound();

  const { data: result } = await supabase
    .from("results")
    .select("*")
    .eq("session_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!result) notFound();

  const { data: responses } = await supabase
    .from("responses")
    .select("question_index, valor")
    .eq("session_id", id)
    .eq("instrumento", "fadiga")
    .order("question_index", { ascending: true });

  return (
    <ResultDisplay
      session={session as Session}
      result={result as Result}
      fadigaRespostas={responses ?? []}
    />
  );
}
