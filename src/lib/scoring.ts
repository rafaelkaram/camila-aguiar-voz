import type { IFVSubscaleResult } from "./types";

// Pontos de corte validados — Zambon et al. (2020)
const IFV_CUTOFF_TOTAL = 11.5;
const IFV_CUTOFF_SUB1 = 4.5;   // Fadiga e Limitação vocal
const IFV_CUTOFF_SUB2 = 3.5;   // Restrição Vocal
const IFV_CUTOFF_SUB3 = 1.5;   // Desconforto físico associado à voz
const IFV_CUTOFF_SUB4 = 8.5;   // Recuperação com repouso (reverso)

// Itens que compõem F1 (0-based); os itens 5,6,7 formam F2 (Restrição Vocal)
const F1_INDICES = [0, 1, 2, 3, 4, 8, 9, 10];

export function calcIFVScores(fadiga: number[]): IFVSubscaleResult {
  // F1: Fadiga e Limitação vocal (8 itens, máx 32)
  const sub1Raw = F1_INDICES.reduce((a, i) => a + (fadiga[i] ?? 0), 0);

  // F2: Restrição Vocal — itens 5,6,7 (3 itens, máx 12)
  const sub2Raw = fadiga.slice(5, 8).reduce((a, b) => a + b, 0);

  // F3: Desconforto físico — itens 11–15 (5 itens, máx 20)
  const sub3Raw = fadiga.slice(11, 16).reduce((a, b) => a + b, 0);

  // F4: Recuperação com repouso — itens 16–18 (3 itens, reverso, máx 12)
  const sub4Raw = fadiga.slice(16, 19).reduce((a, b) => a + (4 - b), 0);

  const totalRaw = sub1Raw + sub2Raw + sub3Raw + sub4Raw;
  const totalPct = Math.round((totalRaw / 76) * 100);
  const classificacao: 1 | 2 = totalRaw < IFV_CUTOFF_TOTAL ? 1 : 2;

  return {
    sub1Raw,
    sub2Raw,
    sub3Raw,
    sub4Raw,
    totalRaw,
    totalPct,
    sub1AboveCutoff: sub1Raw >= IFV_CUTOFF_SUB1,
    sub2AboveCutoff: sub2Raw >= IFV_CUTOFF_SUB2,
    sub3AboveCutoff: sub3Raw >= IFV_CUTOFF_SUB3,
    sub4AboveCutoff: sub4Raw >= IFV_CUTOFF_SUB4,
    classificacao,
  };
}

export function calcAge(dataNascimento: string): number {
  const birth = new Date(dataNascimento);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}
