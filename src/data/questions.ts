export const IDV10_INSTRUCTION =
  "As afirmações abaixo são usadas por muitas pessoas para descrever suas vozes e o efeito de suas vozes na vida. Escolha a resposta que indica o quanto você compartilha da mesma experiência.";

export const IDV10_SCALE = [
  { value: 0, label: "Nunca" },
  { value: 1, label: "Quase nunca" },
  { value: 2, label: "Às vezes" },
  { value: 3, label: "Quase sempre" },
  { value: 4, label: "Sempre" },
];

// Ponto de corte: score bruto ≥ 7,5 (Costa, Oliveira & Behlau, CoDAS 2013)
export const IDV10_CUTOFF_RAW = 7.5;

export const IDV10_QUESTIONS: string[] = [
  "As pessoas têm dificuldade para me ouvir por causa da minha voz.",
  "As pessoas têm dificuldade para me entender em lugares barulhentos.",
  'As pessoas perguntam: "O que você tem na voz?"',
  "Sinto que tenho que fazer força para a minha voz sair.",
  "Meu problema de voz limita minha vida social e pessoal.",
  "Não consigo prever quando minha voz vai sair clara.",
  "Eu me sinto excluído nas conversas por causa da minha voz.",
  "Meu problema de voz me causa prejuízos econômicos.",
  "Meu problema de voz me chateia.",
  "Minha voz faz com que eu me sinta em desvantagem.",
];

export interface HabitosQuestion {
  text: string;
  options: { label: string; value: number }[];
}

// Triagem educativa de hábitos vocais — não é instrumento validado.
// Baseada em fatores de risco descritos na literatura de higiene vocal (Behlau & Pontes).
// value: escore de risco (0 = baixo, 1 = médio, 2 = alto)
export const HABITOS_QUESTIONS: HabitosQuestion[] = [
  {
    text: "Quantos copos de água você bebe por dia?",
    options: [
      { label: "Mais de 6 copos", value: 0 },
      { label: "4 a 6 copos", value: 1 },
      { label: "Menos de 4 copos", value: 2 },
    ],
  },
  {
    text: "Você fuma ou usa cigarro eletrônico?",
    options: [
      { label: "Não", value: 0 },
      { label: "Ex-fumante", value: 1 },
      { label: "Sim", value: 2 },
    ],
  },
  {
    text: "Você sente azia, queimação ou refluxo com frequência?",
    options: [
      { label: "Não", value: 0 },
      { label: "Às vezes", value: 1 },
      { label: "Sim", value: 2 },
    ],
  },
  {
    text: "Você trabalha em ambientes com muito ruído ou ar condicionado?",
    options: [
      { label: "Não", value: 0 },
      { label: "Às vezes", value: 1 },
      { label: "Sim", value: 2 },
    ],
  },
  {
    text: "Quantas horas por dia você usa a voz profissionalmente?",
    options: [
      { label: "Menos de 2h", value: 0 },
      { label: "2 a 4h", value: 1 },
      { label: "Mais de 4h", value: 2 },
    ],
  },
  {
    text: "Você faz aquecimento vocal antes de trabalhar?",
    options: [
      { label: "Sempre", value: 0 },
      { label: "Às vezes", value: 1 },
      { label: "Nunca", value: 2 },
    ],
  },
  {
    text: "Você faz desaquecimento vocal após trabalhar?",
    options: [
      { label: "Sempre", value: 0 },
      { label: "Às vezes", value: 1 },
      { label: "Nunca", value: 2 },
    ],
  },
  {
    text: "Você costuma gritar ou falar muito alto fora do trabalho?",
    options: [
      { label: "Não", value: 0 },
      { label: "Às vezes", value: 1 },
      { label: "Sim", value: 2 },
    ],
  },
  {
    text: "Você ingere álcool com frequência?",
    options: [
      { label: "Raramente", value: 0 },
      { label: "1 a 3x por semana", value: 1 },
      { label: "Quase todo dia", value: 2 },
    ],
  },
  {
    text: "Você usa a voz mesmo quando está resfriado ou rouquenho?",
    options: [
      { label: "Nunca", value: 0 },
      { label: "Às vezes", value: 1 },
      { label: "Sempre", value: 2 },
    ],
  },
];

// ─── IFV — Índice de Fadiga Vocal ────────────────────────────────────────────
// Tradução e adaptação cultural: Zambon F et al. (2020)
// Instrumento original: Vocal Fatigue Index (VFI)
//   Nanjundeswaran C, Jacobson BH, Gartner-Schmidt J, Abbott KV.
//   J Voice. 2015;29(4):433-40.
//
// Instrução exibida antes das perguntas:
//   "As frases abaixo apresentam alguns sintomas frequentemente associados a
//    problemas de voz. Assinale a resposta que indica o quanto você apresenta
//    o mesmo sintoma."
//
// 19 itens · Likert 0-4
// Subescalas:
//   1. Fadiga e Limitação vocal         (itens 0–10)
//   2. Desconforto físico associado à voz (itens 11–15)
//   3. Recuperação com repouso vocal    (itens 16–18) ← ESCORE REVERSO

export const VFI_INSTRUCTION =
  "As frases abaixo apresentam alguns sintomas frequentemente associados a problemas de voz. Assinale a resposta que indica o quanto você apresenta o mesmo sintoma.";

export const VFI_SCALE = [
  { value: 0, label: "Nunca" },
  { value: 1, label: "Quase nunca" },
  { value: 2, label: "Às vezes" },
  { value: 3, label: "Quase sempre" },
  { value: 4, label: "Sempre" },
];

export const VFI_QUESTIONS: string[] = [
  // Subescala 1 — Fadiga e Limitação vocal (itens 1–11)
  "Fico sem vontade de falar depois que falei um pouco mais.",
  "Minha voz fica cansada quando eu falo muito.",
  "Sinto que o esforço aumenta enquanto falo.",
  "Minha voz fica rouca depois que falo.",
  "Tenho que fazer força para produzir a voz.",
  "Procuro evitar falar depois que usei muito a voz.",
  "Evito situações sociais quando sei que vou ter que falar muito.",
  "Tenho dificuldades para falar com minha família depois de um dia de trabalho.",
  "Tenho que fazer força para produzir a voz depois que falei um pouco mais.",
  "Tenho dificuldade para projetar a minha voz enquanto falo.",
  "Minha voz fica fraca depois que eu falo um pouco mais.",
  // Subescala 2 — Desconforto físico associado à voz (itens 12–16)
  "Fico com dor no pescoço ao final do dia quando uso a voz.",
  "Fico com dor na garganta ao final do dia quando uso a voz.",
  "Quando eu falo muito sinto dor para falar.",
  "Quando eu falo minha garganta dói.",
  "Quando eu falo sinto desconforto no pescoço.",
  // Subescala 3 — Recuperação com repouso vocal (itens 17–19) ← REVERSO
  "Quando eu descanso minha voz melhora.",
  "Quando eu descanso faço menos força para falar.",
  "Quando eu descanso minha voz fica menos rouca.",
];

// Itens com escore reverso (subescala 3 — recuperação): maior resposta = menos fadiga
export const VFI_REVERSE_INDICES = [16, 17, 18];

export const VFI_SUBSCALE_RANGES = {
  fadiga:      { start: 0,  end: 10, label: "Fadiga e limitação vocal" },
  desconforto: { start: 11, end: 15, label: "Desconforto físico" },
  recuperacao: { start: 16, end: 18, label: "Recuperação com repouso" },
};

// Score máximo bruto: 19 × 4 = 76
export const VFI_MAX = 76;
