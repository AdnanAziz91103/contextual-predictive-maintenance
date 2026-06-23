import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { machines, modelMetrics, alerts } from "../lib/dummyData";
import * as ai from "../lib/ai";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Dashboard – PdM Edge AI" }],
  }),
  component: Dashboard,
});

function Kpi({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "warning" | "danger" | "success" }) {
  const toneClass =
    tone === "danger" ? "text-danger" :
    tone === "warning" ? "text-warning" :
    tone === "success" ? "text-success" : "text-foreground";
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className={`mt-2 text-3xl font-bold ${toneClass}`}>{value}</div>
    </div>
  );
}

function Dashboard() {
  const [showAi, setShowAi] = useState<boolean>(false);

  useEffect(() => {
    const sync = () => {
      try {
        setShowAi(localStorage.getItem("showAIInsights") === "true");
      } catch {
        setShowAi(false);
      }
    };
    sync();
    window.addEventListener("ai-toggle-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ai-toggle-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const total = machines.length;
  const atRisk = machines.filter((m) => m.status !== "Healthy").length;
  const critical = alerts.filter((a) => a.type === "Critical").length;
  const avgFail = machines.reduce((s, m) => s + m.failureProbability, 0) / machines.length;

  const anomalyScores = machines.map((m) => ai.anomalyScore(m));
  const avgAnomaly = anomalyScores.reduce((s, v) => s + v, 0) / anomalyScores.length;

  const locationData = Object.entries(
    machines.reduce<Record<string, number>>((acc, machine) => {
      acc[machine.location] = (acc[machine.location] || 0) + 1;
      return acc;
    }, {}),
  ).map(([location, count]) => ({ location, count }));

  const alertTypeData = ["Critical", "Vibration", "Temperature", "Maintenance"].map((type) => ({
    type,
    count: alerts.filter((alert) => alert.type === type).length,
  }));

  const statusTrendData = [
    { name: "6h", Healthy: 5, Warning: 2, Critical: 1 },
    { name: "12h", Healthy: 5, Warning: 2, Critical: 1 },
    { name: "18h", Healthy: 4, Warning: 3, Critical: 1 },
    { name: "24h", Healthy: 4, Warning: 2, Critical: 2 },
    { name: "30h", Healthy: 3, Warning: 3, Critical: 2 },
  ];

  const topRiskMachines = [...machines]
    .sort((a, b) => b.failureProbability - a.failureProbability)
    .slice(0, 4);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Dashboard</h2>
      <p className="text-muted-foreground mb-6">Overview of machine fleet health, prediction performance, and priority actions.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
        <Kpi label="Total Machines" value={String(total)} />
        <Kpi label="Machines at Risk" value={String(atRisk)} tone="warning" />
        <Kpi label="Critical Alerts" value={String(critical)} tone="danger" />
        <Kpi label="Avg Failure Probability" value={`${(avgFail * 100).toFixed(0)}%`} />
        {showAi && (
          <Kpi label="Avg Anomaly Score" value={`${(avgAnomaly * 100).toFixed(0)}%`} tone={avgAnomaly > 0.5 ? "warning" : "default"} />
        )}
        <Kpi label="Macro F1 Score" value={modelMetrics.macroF1.toFixed(2)} tone="success" />
        <Kpi label="Precision" value={modelMetrics.precision.toFixed(2)} tone="success" />
      </div>

      <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-semibold mb-3">Machine Health Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={statusTrendData} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ stroke: "var(--border)" }} />
                <Line type="monotone" dataKey="Healthy" stroke="#22c55e" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="Warning" stroke="#f59e0b" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="Critical" stroke="#ef4444" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-semibold mb-3">Failure Probability by Location</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData} margin={{ top: 10, right: 0, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="location" tick={{ fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: "rgba(148, 163, 184, 0.12)" }} />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-semibold mb-3">Priority Machines</h3>
          <div className="space-y-3">
            {topRiskMachines.map((machine) => (
              <div key={machine.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{machine.id}</div>
                    <div className="text-sm text-muted-foreground">{machine.location}</div>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    machine.status === "Healthy" ? "bg-success/10 text-success" :
                    machine.status === "Warning" ? "bg-warning/10 text-warning" :
                    "bg-danger/10 text-danger"
                  }`}>
                    {machine.status}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>Temp: {machine.temperature}°C</div>
                  <div>Vib: {machine.vibration.toFixed(2)} mm/s</div>
                  <div>Current: {machine.current.toFixed(1)} A</div>
                  <div>Risk: {(machine.failureProbability * 100).toFixed(0)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-semibold mb-3">Recent Alerts</h3>
          <ul className="space-y-2">
            {alerts.slice(0, 4).map((a) => (
              <li key={a.id} className="flex justify-between text-sm border-b border-border pb-2 last:border-0">
                <div>
                  <div className="font-medium">{a.machineId}</div>
                  <div className="text-muted-foreground">{a.message}</div>
                </div>
                <span className="text-muted-foreground">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-semibold mb-3">Alert Type Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertTypeData} margin={{ top: 10, right: 0, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="type" tick={{ fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: "rgba(148, 163, 184, 0.12)" }} />
                <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {showAi && (
        <div className="mt-8 bg-card border border-border rounded-lg p-5">
        <h3 className="font-semibold mb-3">AI Insights (explainability & RUL)</h3>
        <p className="text-sm text-muted-foreground mb-4">Automated, local explanations and remaining-useful-life estimates for priority machines.</p>
        <div className="space-y-3">
          {topRiskMachines.map((machine) => (
            <div key={machine.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">{machine.id} — <span className="text-sm text-muted-foreground">{machine.location}</span></div>
                  <div className="text-sm text-muted-foreground mt-1">Anomaly: {(ai.anomalyScore(machine) * 100).toFixed(0)}% • RUL: {ai.predictRUL(machine)}d</div>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  machine.status === "Healthy" ? "bg-success/10 text-success" :
                  machine.status === "Warning" ? "bg-warning/10 text-warning" :
                  "bg-danger/10 text-danger"
                }`}>{machine.status}</span>
              </div>
              <div className="mt-3 text-sm">
                <div className="font-medium">Why did the model flag this?</div>
                <div className="text-muted-foreground">{ai.explainFailure(machine)}</div>
                <div className="mt-2 font-medium">Recommended action</div>
                <div className="text-muted-foreground">{ai.suggestAction(machine)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
    </div>
  );
}
