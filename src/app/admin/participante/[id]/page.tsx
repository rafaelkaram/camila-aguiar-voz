import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CLASSIFICATION_LABELS, CLASSIFICATION_MESSAGES } from "@/lib/types";
import { calcAge, calcIFVScores } from "@/lib/scoring";
import { VFI_QUESTIONS } from "@/data/questions";
import type { Session, Result } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ParticipantePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

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

  const { data: responses } = await supabase
    .from("responses")
    .select("*")
    .eq("session_id", id)
    .order("question_index", { ascending: true });

  const s = session as Session;
  const r = result as Result | null;
  const cls = r ? CLASSIFICATION_LABELS[r.classificacao] : null;

  const fadigaResp =
    responses?.filter((r) => r.instrumento === "fadiga").sort((a, b) => a.question_index - b.question_index) ?? [];

  const fadigaArr = Array.from({ length: 19 }, (_, i) => {
    const resp = fadigaResp.find((r) => r.question_index === i);
    return resp?.valor ?? 0;
  });
  const ifv = calcIFVScores(fadigaArr);

  const LIKERT_LABELS = ["Nunca", "Quase nunca", "Às vezes", "Quase sempre", "Sempre"];

  return (
    <div className="min-h-dvh bg-[#F7F4F0] pb-12">
      <header className="bg-white border-b border-[#FDDFC4] px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1 text-sm text-[#C47A42] font-semibold hover:text-[#8B4F1E]"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div>
            <h1 className="text-base font-bold text-[#2C1A0E]">{s.nome}</h1>
            <p className="text-xs text-[#8B4F1E]">
              {s.profissao} · {calcAge(s.data_nascimento)} anos ·{" "}
              {new Date(s.created_at).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Classification */}
        {r && cls && (
          <div className={`rounded-2xl border-2 p-5 ${cls.bg} ${cls.border}`}>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shrink-0"
                style={{ backgroundColor: cls.color }}
              >
                {ifv.totalRaw}
              </div>
              <div>
                <p className={`font-bold text-base ${cls.text}`}>{cls.label}</p>
                <p className={`text-sm ${cls.text} opacity-80`}>
                  Score total IFV: {ifv.totalRaw} / 76 · Corte: 11,5
                </p>
              </div>
            </div>
            <p className={`mt-3 text-sm leading-relaxed ${cls.text}`}>
              {CLASSIFICATION_MESSAGES[r.classificacao]}
            </p>

            {/* Subscale scores */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Fadiga/Limitação", raw: ifv.sub1Raw, max: 32, above: ifv.sub1AboveCutoff },
                { label: "Restrição Vocal", raw: ifv.sub2Raw, max: 12, above: ifv.sub2AboveCutoff },
                { label: "Desconforto", raw: ifv.sub3Raw, max: 20, above: ifv.sub3AboveCutoff },
                { label: "Recuperação", raw: ifv.sub4Raw, max: 12, above: ifv.sub4AboveCutoff },
              ].map(({ label, raw, max, above }) => (
                <div
                  key={label}
                  className={`bg-white rounded-xl p-3 text-center border ${above ? "border-red-300" : "border-[#FDDFC4]"}`}
                >
                  <p className="text-xs text-[#8B4F1E] font-semibold">{label}</p>
                  <p className="text-xl font-bold text-[#2C1A0E]">{raw}<span className="text-xs font-normal text-gray-400">/{max}</span></p>
                  {above && <p className="text-[10px] text-red-500 font-semibold">acima do corte</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Participant info */}
        <div className="bg-white rounded-2xl border border-[#FDDFC4] p-5">
          <h2 className="text-sm font-bold text-[#2C1A0E] mb-3">
            Dados do participante
          </h2>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-[#8B4F1E] font-semibold">Nome</dt>
              <dd className="text-[#2C1A0E]">{s.nome}</dd>
            </div>
            <div>
              <dt className="text-xs text-[#8B4F1E] font-semibold">Profissão</dt>
              <dd className="text-[#2C1A0E]">{s.profissao}</dd>
            </div>
            <div>
              <dt className="text-xs text-[#8B4F1E] font-semibold">Idade</dt>
              <dd className="text-[#2C1A0E]">{calcAge(s.data_nascimento)} anos</dd>
            </div>
            <div>
              <dt className="text-xs text-[#8B4F1E] font-semibold">E-mail</dt>
              <dd className="text-[#2C1A0E]">{s.email ?? "—"}</dd>
            </div>
          </dl>
        </div>

        {/* IFV responses */}
        <ResponseSection
          title="IFV — Índice de Fadiga Vocal (Zambon et al., 2020)"
          questions={VFI_QUESTIONS}
          responses={fadigaResp}
          valueLabel={(v) => `${v} — ${LIKERT_LABELS[v] ?? ""}`}
          score={r?.score_fadiga}
        />
      </div>
    </div>
  );
}

interface ResponseSectionProps {
  title: string;
  questions: string[];
  responses: { question_index: number; valor: number }[];
  valueLabel: (val: number, idx: number) => string;
  score?: number;
}

function ResponseSection({
  title,
  questions,
  responses,
  valueLabel,
  score,
}: ResponseSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#FDDFC4] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-[#2C1A0E]">{title}</h2>
        {score !== undefined && (
          <span className="text-sm font-bold text-[#F5A877]">
            {Math.round(score)}%
          </span>
        )}
      </div>
      <ol className="space-y-3">
        {questions.map((q, idx) => {
          const resp = responses.find((r) => r.question_index === idx);
          return (
            <li key={idx} className="flex gap-3 text-sm">
              <span className="text-[#F5A877] font-bold shrink-0 w-5">
                {idx + 1}.
              </span>
              <div className="flex-1">
                <p className="text-[#2C1A0E] leading-snug">{q}</p>
                {resp !== undefined ? (
                  <p className="text-[#8B4F1E] font-semibold mt-0.5 text-xs">
                    {valueLabel(resp.valor, idx)}
                  </p>
                ) : (
                  <p className="text-gray-400 text-xs mt-0.5">Sem resposta</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
