import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CLASSIFICATION_LABELS } from "@/lib/types";
import { ParticipantTable } from "@/components/dashboard/ParticipantTable";
import { RiskDistChart, ScoreBarChart, TimelineChart } from "@/components/dashboard/Charts";
import type { SessionWithResult } from "@/lib/types";
import { LogoutButton } from "./LogoutButton";

export const metadata = { title: "Dashboard — Camila Aguiar Fonoaudióloga" };

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  // Fetch all sessions with their results
  const { data: sessions } = await supabase
    .from("sessions")
    .select(`*, results(*)`)
    .order("created_at", { ascending: false });

  const allSessions = (sessions ?? []) as SessionWithResult[];

  // --- Stats ---
  const total = allSessions.length;
  const withResult = allSessions.filter((s) => s.results?.length > 0);

  const classDist = ([1, 2] as const).map((c) => ({
    name: ["Sem fadiga significativa", "Fadiga vocal presente"][c - 1],
    value: withResult.filter((s) => s.results[0]?.classificacao === c).length,
  }));

  const avgScores = [
    {
      name: "IFV Total",
      avg:
        withResult.reduce((a, s) => a + (s.results[0]?.score_fadiga ?? 0), 0) /
        (withResult.length || 1),
    },
  ];

  // Timeline: group by date
  const byDate: Record<string, { count: number; total: number }> = {};
  withResult.forEach((s) => {
    const d = new Date(s.created_at).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
    if (!byDate[d]) byDate[d] = { count: 0, total: 0 };
    byDate[d].count++;
    byDate[d].total += s.results[0]?.score_composto ?? 0;
  });
  const timeline = Object.entries(byDate)
    .map(([date, v]) => ({
      date,
      count: v.count,
      avg: Math.round(v.total / v.count),
    }))
    .slice(-14);

  const avgComposto =
    withResult.length > 0
      ? withResult.reduce((a, s) => a + (s.results[0]?.score_composto ?? 0), 0) /
        withResult.length
      : 0;

  return (
    <div className="min-h-dvh bg-[#F7F4F0]">
      {/* Top nav */}
      <header className="bg-white border-b border-[#FDDFC4] px-4 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#2C1A0E]">Dashboard Vocal</h1>
            <p className="text-xs text-[#8B4F1E]">Camila Aguiar Fonoaudióloga</p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard label="Total de participantes" value={total.toString()} />
          <KpiCard
            label="Score médio composto"
            value={`${avgComposto.toFixed(1)}%`}
          />
          <KpiCard
            label="Resultado mais frequente"
            value={
              [...classDist].sort((a, b) => b.value - a.value)[0]?.name ?? "—"
            }
          />
          <KpiCard
            label="Com fadiga vocal"
            value={`${withResult.filter((s) => s.results[0]?.classificacao === 2).length}`}
          />
        </div>

        {/* Charts row */}
        <div className="grid md:grid-cols-2 gap-6">
          <ChartCard title="Distribuição por nível de risco">
            <RiskDistChart data={classDist} />
          </ChartCard>
          <ChartCard title="Score médio por instrumento">
            <ScoreBarChart data={avgScores} />
          </ChartCard>
        </div>

        {/* Timeline */}
        {timeline.length > 1 && (
          <ChartCard title="Participantes e score médio por dia">
            <TimelineChart data={timeline} />
          </ChartCard>
        )}

        {/* Participants table */}
        <div className="bg-white rounded-2xl border border-[#FDDFC4] p-5">
          <h2 className="text-base font-bold text-[#2C1A0E] mb-4">
            Participantes
          </h2>
          <ParticipantTable sessions={allSessions} />
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#FDDFC4] p-4">
      <p className="text-xs text-[#8B4F1E] font-semibold uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-2xl font-extrabold text-[#2C1A0E]">{value}</p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#FDDFC4] p-5">
      <h3 className="text-sm font-bold text-[#2C1A0E] mb-4">{title}</h3>
      {children}
    </div>
  );
}
