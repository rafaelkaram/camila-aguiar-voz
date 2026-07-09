"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { calcIFVScores } from "@/lib/scoring";
import type { ParticipantData } from "@/lib/types";

export interface SaveAssessmentInput {
  participant: ParticipantData;
  fadiga: number[];
}

export interface SaveAssessmentResult {
  sessionId: string;
  error?: string;
}

export async function saveAssessment(
  input: SaveAssessmentInput
): Promise<SaveAssessmentResult> {
  const supabase = createServiceClient();
  const { participant, fadiga } = input;

  // 1. Insert session
  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .insert({
      nome: participant.nome.trim(),
      data_nascimento: participant.dataNascimento,
      profissao: participant.profissao.trim(),
      email: participant.email?.trim() || null,
    })
    .select("id")
    .single();

  if (sessionError || !session) {
    console.error("Session insert error:", sessionError);
    return { sessionId: "", error: "Erro ao salvar dados do participante." };
  }

  const sessionId = session.id as string;

  // 2. Save IFV responses
  const responseRows = fadiga.map((valor, i) => ({
    session_id: sessionId,
    instrumento: "fadiga",
    question_index: i,
    valor,
  }));

  const { error: responsesError } = await supabase
    .from("responses")
    .insert(responseRows);

  if (responsesError) {
    console.error("Responses insert error:", responsesError);
    return { sessionId, error: "Erro ao salvar respostas." };
  }

  // 3. Calculate and store result
  const scores = calcIFVScores(fadiga);

  const { error: resultError } = await supabase.from("results").insert({
    session_id: sessionId,
    score_idv10: 0,
    score_habitos: 0,
    score_fadiga: scores.totalPct,
    score_composto: scores.totalPct,
    classificacao: scores.classificacao,
  });

  if (resultError) {
    console.error("Result insert error:", resultError);
    return { sessionId, error: "Erro ao calcular resultado." };
  }

  return { sessionId };
}
