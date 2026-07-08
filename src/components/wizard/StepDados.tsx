"use client";

import { type ChangeEvent } from "react";
import type { ParticipantData } from "@/lib/types";

interface StepDadosProps {
  data: ParticipantData;
  onChange: (data: ParticipantData) => void;
}

export function StepDados({ data, onChange }: StepDadosProps) {
  const set = (field: keyof ParticipantData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onChange({ ...data, [field]: e.target.value });

  const inputClass =
    "w-full h-12 sm:h-14 px-4 rounded-xl border-2 border-[#FDDFC4] bg-white text-[#2C1A0E] text-base sm:text-lg focus:outline-none focus:border-[#F5A877] transition-colors placeholder:text-gray-400";

  const labelClass = "block text-sm sm:text-base font-semibold text-[#8B4F1E] mb-2";

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <label className={labelClass}>
          Nome completo <span className="text-[#F5A877]">*</span>
        </label>
        <input
          type="text"
          placeholder="Seu nome"
          value={data.nome}
          onChange={set("nome")}
          className={inputClass}
          autoComplete="name"
          required
        />
      </div>

      <div>
        <label className={labelClass}>
          Data de nascimento <span className="text-[#F5A877]">*</span>
        </label>
        <input
          type="date"
          value={data.dataNascimento}
          onChange={set("dataNascimento")}
          className={inputClass}
          required
          max={new Date().toISOString().split("T")[0]}
        />
      </div>

      <div>
        <label className={labelClass}>
          Profissão <span className="text-[#F5A877]">*</span>
        </label>
        <input
          type="text"
          placeholder="Ex.: Radialista, Jornalista, Apresentador(a)…"
          value={data.profissao}
          onChange={set("profissao")}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className={labelClass}>E-mail (opcional)</label>
        <input
          type="email"
          placeholder="seu@email.com"
          value={data.email ?? ""}
          onChange={set("email")}
          className={inputClass}
          autoComplete="email"
        />
        <p className="mt-2 text-xs sm:text-sm text-gray-500">
          Seus dados são usados apenas para fins desta pesquisa e nunca serão
          compartilhados com terceiros.
        </p>
      </div>
    </div>
  );
}
