export type Instrument = "idv10" | "habitos" | "fadiga";

export interface ParticipantData {
  nome: string;
  dataNascimento: string;
  profissao: string;
  email?: string;
}

export interface Assessment {
  participant: ParticipantData;
  fadiga: number[];      // 19 values, 0–4
}

export interface IFVSubscaleResult {
  sub1Raw: number;         // Fadiga e Limitação vocal (itens 0-4,8-10 → 0–32)
  sub2Raw: number;         // Restrição Vocal (itens 5-7 → 0–12)
  sub3Raw: number;         // Desconforto físico (itens 11-15 → 0–20)
  sub4Raw: number;         // Recuperação com repouso reverso (itens 16-18 → 0–12)
  totalRaw: number;        // 0–76
  totalPct: number;        // 0–100
  sub1AboveCutoff: boolean;
  sub2AboveCutoff: boolean;
  sub3AboveCutoff: boolean;
  sub4AboveCutoff: boolean;
  classificacao: 1 | 2;
}

export interface Scores {
  fadigaRaw: number;     // 0–76
  fadigaPct: number;     // 0–100
  composto: number;      // igual a fadigaPct
  classificacao: 1 | 2;
}

export interface Session {
  id: string;
  created_at: string;
  nome: string;
  data_nascimento: string;
  profissao: string;
  email: string | null;
}

export interface Result {
  id: string;
  session_id: string;
  score_idv10: number;
  score_habitos: number;
  score_fadiga: number;
  score_composto: number;
  classificacao: 1 | 2;
  created_at: string;
}

export interface SessionWithResult extends Session {
  results: Result[];
}

export const CLASSIFICATION_LABELS: Record<
  1 | 2,
  { label: string; color: string; bg: string; border: string; text: string }
> = {
  1: {
    label: "Sem fadiga vocal significativa",
    color: "#22c55e",
    bg: "bg-green-50",
    border: "border-green-400",
    text: "text-green-700",
  },
  2: {
    label: "Fadiga vocal clinicamente significativa",
    color: "#ef4444",
    bg: "bg-red-50",
    border: "border-red-400",
    text: "text-red-700",
  },
};

export const CLASSIFICATION_MESSAGES: Record<1 | 2, string> = {
  1: "Seu resultado está abaixo do ponto de corte clínico do IFV. Isso indica que você não apresenta, neste momento, nível significativo de fadiga vocal. Continue mantendo boas práticas de hidratação, aquecimento e descanso vocal para preservar sua saúde de voz.",
  2: "Seu resultado está acima do ponto de corte clínico do IFV, indicando fadiga vocal clinicamente significativa. Os sintomas relatados podem comprometer sua performance e qualidade vocal ao longo do dia. Recomendamos avaliação fonoaudiológica para identificar as causas e traçar um plano de cuidado vocal.",
};
