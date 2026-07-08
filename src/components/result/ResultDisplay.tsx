"use client";

import { ArrowRight, Copy, AlertCircle } from "lucide-react";
import { CLASSIFICATION_LABELS, CLASSIFICATION_MESSAGES } from "@/lib/types";
import type { Result, Session } from "@/lib/types";
import { calcAge, calcIFVScores } from "@/lib/scoring";
import { Logo } from "@/components/ui/Logo";

interface ResultDisplayProps {
  session: Session;
  result: Result;
  fadigaRespostas: { question_index: number; valor: number }[];
}

function SubscaleBar({
  label,
  rawScore,
  maxScore,
  cutoff,
  aboveCutoff,
  color,
}: {
  label: string;
  rawScore: number;
  maxScore: number;
  cutoff: number;
  aboveCutoff: boolean;
  color: string;
}) {
  const pct = Math.round((rawScore / maxScore) * 100);
  const cutoffPct = (cutoff / maxScore) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {aboveCutoff && (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          )}
          <span className="text-sm sm:text-base font-medium text-[#2C1A0E] truncate">
            {label}
          </span>
        </div>
        <span className="text-sm sm:text-base font-extrabold shrink-0" style={{ color }}>
          {rawScore} / {maxScore}
        </span>
      </div>
      {/* Bar with cutoff marker */}
      <div className="relative h-3 sm:h-4 bg-[#FDDFC4] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
        {/* Cutoff marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-400/70"
          style={{ left: `${cutoffPct}%` }}
        />
      </div>
      <p className="text-xs text-gray-400">
        Ponto de corte: {cutoff}{aboveCutoff ? " — " : ""}
        {aboveCutoff && <span className="text-red-500 font-semibold">acima do corte</span>}
      </p>
    </div>
  );
}

function Donut({ rawScore, maxScore, color }: { rawScore: number; maxScore: number; color: string }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative w-36 h-36 sm:w-48 sm:h-48 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#E5E7EB" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${(rawScore / maxScore) * circ} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl sm:text-4xl font-extrabold leading-none" style={{ color }}>
          {rawScore}
        </span>
        <span className="text-xs sm:text-sm text-gray-400 font-medium mt-1">/ {maxScore}</span>
      </div>
    </div>
  );
}

export function ResultDisplay({ session, result, fadigaRespostas }: ResultDisplayProps) {
  const cls = CLASSIFICATION_LABELS[result.classificacao];
  const msg = CLASSIFICATION_MESSAGES[result.classificacao];
  const age = calcAge(session.data_nascimento);
  const agendamentoLink =
    process.env.NEXT_PUBLIC_LINK_AGENDAMENTO ?? "https://wa.me/5500000000000";

  // Recalculate subscale scores from raw responses
  const fadigaArr = Array.from({ length: 19 }, (_, i) => {
    const r = fadigaRespostas.find((r) => r.question_index === i);
    return r?.valor ?? 0;
  });
  const ifv = calcIFVScores(fadigaArr);

  return (
    <div className="min-h-dvh bg-[#F7F4F0]">

      {/* Sticky header */}
      <header className="bg-white border-b border-[#FDDFC4] px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <Logo variant="color" width={180} height={67} className="shrink-0" />
          <div className="text-right min-w-0">
            <p className="text-[10px] sm:text-xs text-[#8B4F1E] font-semibold uppercase tracking-widest">
              Resultado da Avaliação
            </p>
            <p className="text-sm sm:text-base font-bold text-[#2C1A0E] leading-tight truncate">
              {session.nome}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {session.profissao} · {age} anos
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10 space-y-5 sm:space-y-6 pb-14">

        {/* Classification hero card */}
        <div className={`rounded-3xl border-2 px-6 py-8 sm:px-10 sm:py-10 text-center ${cls.bg} ${cls.border}`}>
          <Donut rawScore={ifv.totalRaw} maxScore={76} color={cls.color} />
          <div className="mt-5 sm:mt-6 space-y-3">
            <span
              className="inline-block px-5 py-1.5 rounded-full text-sm sm:text-base font-bold text-white"
              style={{ backgroundColor: cls.color }}
            >
              {cls.label}
            </span>
            <p className={`text-sm sm:text-base leading-relaxed ${cls.text}`}>{msg}</p>
            <p className={`text-xs sm:text-sm font-medium ${cls.text} opacity-70`}>
              Ponto de corte: 11,5
            </p>
          </div>
        </div>

        {/* Subscale breakdown */}
        <div className="bg-white rounded-2xl border border-[#FDDFC4] p-5 sm:p-8 space-y-6 sm:space-y-7">
          <h2 className="text-base sm:text-lg font-bold text-[#2C1A0E]">
            Resultado por subescala
          </h2>
          <SubscaleBar
            label="Fadiga e Limitação vocal"
            rawScore={ifv.sub1Raw}
            maxScore={32}
            cutoff={4.5}
            aboveCutoff={ifv.sub1AboveCutoff}
            color="#F5A877"
          />
          <SubscaleBar
            label="Restrição Vocal"
            rawScore={ifv.sub2Raw}
            maxScore={12}
            cutoff={3.5}
            aboveCutoff={ifv.sub2AboveCutoff}
            color="#E8925C"
          />
          <SubscaleBar
            label="Desconforto físico"
            rawScore={ifv.sub3Raw}
            maxScore={20}
            cutoff={1.5}
            aboveCutoff={ifv.sub3AboveCutoff}
            color="#C47A42"
          />
          <SubscaleBar
            label="Recuperação com repouso"
            rawScore={ifv.sub4Raw}
            maxScore={12}
            cutoff={8.5}
            aboveCutoff={ifv.sub4AboveCutoff}
            color="#8B4F1E"
          />
        </div>

        {/* CTA */}
        <div className="bg-[#FDF0E6] border border-[#FDDFC4] rounded-2xl p-5 sm:p-8 space-y-3 sm:space-y-4">
          <div>
            <p className="text-base sm:text-lg font-bold text-[#2C1A0E]">
              Ficou com dúvidas sobre seu resultado?
            </p>
            <p className="text-sm sm:text-base text-[#8B4F1E] mt-1 leading-relaxed">
              A Camila Aguiar pode te ajudar a entender melhor sua saúde vocal.
            </p>
          </div>
          <a
            href={agendamentoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 sm:py-5 rounded-xl bg-[#F5A877] text-white font-bold text-base sm:text-lg hover:bg-[#C47A42] transition-colors"
          >
            Conversar com a Camila
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        {/* Share */}
        <ShareButton sessionId={session.id} />

        <p className="text-center text-xs text-gray-400 pb-2 leading-relaxed">
          IFV: Zambon F, Moreti F, Ribeiro VV, Nanjundeswaran C, Behlau M. J Voice. 2020.
        </p>
      </div>
    </div>
  );
}

function ShareButton({ sessionId }: { sessionId: string }) {
  const handleCopy = () => {
    const url = `${window.location.origin}/resultado/${sessionId}`;
    navigator.clipboard.writeText(url).catch(() => {});
    alert("Link copiado!");
  };

  return (
    <button
      onClick={handleCopy}
      className="w-full py-4 rounded-xl border-2 border-[#FDDFC4] bg-white text-[#C47A42] text-sm sm:text-base font-semibold hover:bg-[#FDF0E6] transition-colors flex items-center justify-center gap-2"
    >
      <Copy className="w-4 h-4" />
      Copiar link do resultado
    </button>
  );
}
