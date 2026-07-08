"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { StepDados } from "./StepDados";
import { LikertScale } from "./LikertScale";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import {
  VFI_QUESTIONS,
  VFI_SCALE,
  VFI_INSTRUCTION,
} from "@/data/questions";
import type { ParticipantData } from "@/lib/types";
import { saveAssessment } from "@/actions/assessment";

const STEP_DADOS = 0;
const STEP_FADIGA = 1;

const STEP_LABELS = [
  "Seus dados",
  "IFV — Índice de Fadiga Vocal",
];

const EMPTY_PARTICIPANT: ParticipantData = {
  nome: "",
  dataNascimento: "",
  profissao: "",
  email: "",
};

export function WizardForm() {
  const router = useRouter();

  const [step, setStep] = useState(STEP_DADOS);
  const [participant, setParticipant] = useState<ParticipantData>(EMPTY_PARTICIPANT);
  const [fadiga, setFadiga] = useState<(number | undefined)[]>(
    Array(VFI_QUESTIONS.length).fill(undefined)
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subIdx, setSubIdx] = useState(0);

  const setAnswer = useCallback(
    (idx: number, val: number) => {
      setFadiga((prev) => {
        const next = [...prev];
        next[idx] = val;
        return next;
      });
    },
    []
  );

  const canAdvanceDados = () =>
    participant.nome.trim().length > 0 &&
    participant.dataNascimento.length > 0 &&
    participant.profissao.trim().length > 0;

  const currentAnswer = (): number | undefined => {
    if (step === STEP_FADIGA) return fadiga[subIdx];
    return undefined;
  };

  const totalSubQuestions = () => {
    if (step === STEP_FADIGA) return VFI_QUESTIONS.length;
    return 0;
  };

  const goNext = async () => {
    setError(null);

    if (step === STEP_DADOS) {
      if (!canAdvanceDados()) return;
      setStep(STEP_FADIGA);
      setSubIdx(0);
      return;
    }

    const total = totalSubQuestions();
    const isLastSub = subIdx === total - 1;

    if (!isLastSub) {
      setSubIdx((i) => i + 1);
      return;
    }

    await handleSubmit();
  };

  const goBack = () => {
    setError(null);

    if (step === STEP_DADOS) return;

    if (subIdx > 0) {
      setSubIdx((i) => i - 1);
      return;
    }

    setStep(STEP_DADOS);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await saveAssessment({
        participant,
        fadiga: fadiga.map((v) => v ?? 0),
      });

      if (result.error || !result.sessionId) {
        setError(result.error ?? "Erro desconhecido. Tente novamente.");
        return;
      }

      router.push(`/resultado/${result.sessionId}`);
    } catch {
      setError("Falha ao enviar. Verifique sua conexão e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const globalCurrent = () => {
    if (step === STEP_DADOS) return 1;
    return 1 + subIdx + 1;
  };

  const globalTotal = 1 + VFI_QUESTIONS.length;

  const canGoNext = () => {
    if (step === STEP_DADOS) return canAdvanceDados();
    return currentAnswer() !== undefined;
  };

  const isLastQuestion = step === STEP_FADIGA && subIdx === VFI_QUESTIONS.length - 1;

  const progressLabel = () => {
    if (step === STEP_DADOS) return STEP_LABELS[0];
    return `${STEP_LABELS[step]} — ${subIdx + 1}/${totalSubQuestions()}`;
  };

  return (
    <div className="flex flex-col min-h-dvh bg-[#F7F4F0]">
      <ProgressBar
        current={globalCurrent()}
        total={globalTotal}
        label={progressLabel()}
      />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-32 max-w-2xl mx-auto w-full">
        {/* Section header — shown only on first question */}
        {step === STEP_FADIGA && subIdx === 0 && (
          <div className="mb-8 p-5 sm:p-7 rounded-2xl bg-[#FDF0E6] border border-[#FDDFC4]">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2C1A0E]">{STEP_LABELS[step]}</h2>
            <p className="mt-2 text-sm sm:text-base text-[#8B4F1E] leading-relaxed">
              {VFI_INSTRUCTION}
            </p>
          </div>
        )}

        <div className="space-y-6">
          {step === STEP_DADOS && (
            <>
              <div className="text-center pb-2">
                <div className="flex justify-center mb-4">
                  <Logo variant="color" width={180} height={68} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#2C1A0E]">
                  Avaliação de Saúde Vocal
                </h1>
                <p className="text-sm sm:text-base text-[#8B4F1E] mt-1">
                  Preencha seus dados para começar
                </p>
              </div>
              <StepDados data={participant} onChange={setParticipant} />
            </>
          )}

          {step === STEP_FADIGA && (
            <LikertScale
              question={VFI_QUESTIONS[subIdx]}
              questionNumber={subIdx + 1}
              options={VFI_SCALE}
              value={fadiga[subIdx]}
              onChange={(val) => setAnswer(subIdx, val)}
            />
          )}
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Fixed bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#FDDFC4] px-4 py-4 sm:py-5 z-20">
        <div className="max-w-2xl mx-auto flex gap-3">
          {(step > STEP_DADOS || subIdx > 0) && (
            <Button
              variant="secondary"
              size="md"
              onClick={goBack}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            onClick={goNext}
            disabled={!canGoNext()}
            loading={submitting}
            className="flex-1 flex items-center justify-center gap-1"
          >
            {isLastQuestion ? "Ver resultado" : "Próxima"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
