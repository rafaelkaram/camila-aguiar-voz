"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CLASSIFICATION_LABELS } from "@/lib/types";
import { calcAge } from "@/lib/scoring";
import type { SessionWithResult } from "@/lib/types";

interface ParticipantTableProps {
  sessions: SessionWithResult[];
}

export function ParticipantTable({ sessions }: ParticipantTableProps) {
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState<string>("all");

  const filtered = sessions.filter((s) => {
    const matchSearch =
      s.nome.toLowerCase().includes(search.toLowerCase()) ||
      s.profissao.toLowerCase().includes(search.toLowerCase());
    const cls = s.results[0]?.classificacao?.toString() ?? "0";
    const matchClass = filterClass === "all" || cls === filterClass;
    return matchSearch && matchClass;
  });

  const handleExport = () => {
    const rows = [
      ["Nome", "Profissão", "Idade", "Email", "IDV-10%", "Hábitos%", "Fadiga%", "Composto", "Classificação", "Data"],
      ...sessions.map((s) => {
        const r = s.results[0];
        const cls = r ? CLASSIFICATION_LABELS[r.classificacao as 1 | 2].label : "";
        return [
          s.nome,
          s.profissao,
          calcAge(s.data_nascimento).toString(),
          s.email ?? "",
          r?.score_idv10?.toFixed(1) ?? "",
          r?.score_habitos?.toFixed(1) ?? "",
          r?.score_fadiga?.toFixed(1) ?? "",
          r?.score_composto?.toFixed(1) ?? "",
          cls,
          new Date(s.created_at).toLocaleDateString("pt-BR"),
        ];
      }),
    ];

    const csv = rows.map((row) => row.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `avaliacoes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1">
          <input
            type="search"
            placeholder="Buscar por nome ou profissão…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 h-10 px-3 rounded-xl border-2 border-[#FDDFC4] bg-white text-sm text-[#2C1A0E] focus:outline-none focus:border-[#F5A877]"
          />
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="h-10 px-3 rounded-xl border-2 border-[#FDDFC4] bg-white text-sm text-[#2C1A0E] focus:outline-none focus:border-[#F5A877]"
          >
            <option value="all">Todos</option>
            <option value="1">Sem fadiga significativa</option>
            <option value="2">Fadiga vocal presente</option>
          </select>
        </div>
        <button
          onClick={handleExport}
          className="h-10 px-4 rounded-xl bg-[#F5A877] text-white text-sm font-semibold hover:bg-[#C47A42] transition-colors whitespace-nowrap"
        >
          Exportar CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#FDDFC4] bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#FDF0E6] text-[#8B4F1E] text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Nome</th>
              <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Profissão</th>
              <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Idade</th>
              <th className="text-left px-4 py-3 font-semibold">Score</th>
              <th className="text-left px-4 py-3 font-semibold">Nível</th>
              <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Data</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FDDFC4]">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Nenhum participante encontrado.
                </td>
              </tr>
            )}
            {filtered.map((s) => {
              const r = s.results[0];
              const cls = r
                ? CLASSIFICATION_LABELS[r.classificacao as 1 | 2]
                : null;
              return (
                <tr key={s.id} className="hover:bg-[#FDF0E6] transition-colors">
                  <td className="px-4 py-3 font-medium text-[#2C1A0E]">
                    {s.nome}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                    {s.profissao}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    {calcAge(s.data_nascimento)} anos
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#C47A42]">
                    {r ? `${Math.round(r.score_composto)}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {cls ? (
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold text-white`}
                        style={{ backgroundColor: cls.color }}
                      >
                        {cls.label}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                    {new Date(s.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/participante/${s.id}`}
                      className="flex items-center gap-1 text-xs text-[#F5A877] font-semibold hover:text-[#C47A42]"
                    >
                      Ver
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400">
        {filtered.length} de {sessions.length} participante(s)
      </p>
    </div>
  );
}
