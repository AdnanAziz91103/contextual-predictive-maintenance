import { createFileRoute } from "@tanstack/react-router";
import { machines, modelMetrics, alerts } from "../lib/dummyData";

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
  const total = machines.length;
  const atRisk = machines.filter((m) => m.status !== "Healthy").length;
  const critical = alerts.filter((a) => a.type === "Critical").length;
  const avgFail =
    machines.reduce((s, m) => s + m.failureProbability, 0) / machines.length;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Dashboard</h2>
      <p className="text-muted-foreground mb-6">Overview of machine fleet health and model status.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Kpi label="Total Machines" value={String(total)} />
        <Kpi label="Machines at Risk" value={String(atRisk)} tone="warning" />
        <Kpi label="Critical Alerts" value={String(critical)} tone="danger" />
        <Kpi label="Avg Failure Probability" value={`${(avgFail * 100).toFixed(0)}%`} />
        <Kpi label="Macro F1 Score" value={modelMetrics.macroF1.toFixed(2)} tone="success" />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-semibold mb-3">Recent Alerts</h3>
          <ul className="space-y-2">
            {alerts.slice(0, 4).map((a) => (
              <li key={a.id} className="flex justify-between text-sm border-b border-border pb-2 last:border-0">
                <span><strong>{a.machineId}</strong> — {a.message}</span>
                <span className="text-muted-foreground">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-semibold mb-3">Status Breakdown</h3>
          {(["Healthy", "Warning", "Critical"] as const).map((s) => {
            const count = machines.filter((m) => m.status === s).length;
            const pct = (count / total) * 100;
            const color = s === "Healthy" ? "bg-success" : s === "Warning" ? "bg-warning" : "bg-danger";
            return (
              <div key={s} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>{s}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <div className="h-2 bg-muted rounded">
                  <div className={`h-2 rounded ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
