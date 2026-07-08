"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

const RISK_COLORS: Record<string, string> = {
  "Sem fadiga significativa": "#22c55e",
  "Fadiga vocal presente": "#ef4444",
};

interface RiskDistChartProps {
  data: { name: string; value: number }[];
}

export function RiskDistChart({ data }: RiskDistChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={3}
          dataKey="value"
          label={({ name, percent }: { name?: string; percent?: number }) =>
            `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={RISK_COLORS[entry.name] ?? "#F5A877"}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(val: unknown) => [
            `${val} participantes`,
          ]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

interface ScoreBarChartProps {
  data: { name: string; avg: number }[];
}

export function ScoreBarChart({ data }: ScoreBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#FDDFC4" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#8B4F1E" }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#8B4F1E" }} />
        <Tooltip
          formatter={(val: unknown) => [
            `${(val as number).toFixed(1)}%`,
          ]}
        />
        <Bar dataKey="avg" fill="#F5A877" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface TimelineChartProps {
  data: { date: string; count: number; avg: number }[];
}

export function TimelineChart({ data }: TimelineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#FDDFC4" />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#8B4F1E" }} />
        <YAxis
          yAxisId="left"
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: "#8B4F1E" }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 10, fill: "#8B4F1E" }}
        />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="avg"
          stroke="#F5A877"
          strokeWidth={2}
          dot={false}
          name="Score médio"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="count"
          stroke="#C47A42"
          strokeWidth={2}
          dot={false}
          name="Participantes"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
