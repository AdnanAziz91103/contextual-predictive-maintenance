import { createFileRoute, Link } from "@tanstack/react-router";
import { machines } from "../lib/dummyData";

export const Route = createFileRoute("/monitoring")({
  head: () => ({ meta: [{ title: "Machine Monitoring – PdM Edge AI" }] }),
  component: Monitoring,
});

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "Healthy" ? "bg-success/10 text-success" :
    status === "Warning" ? "bg-warning/10 text-warning" :
    "bg-danger/10 text-danger";
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{status}</span>;
}

function Monitoring() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Machine Monitoring</h2>
      <p className="text-muted-foreground mb-6">Live telemetry across all monitored machines.</p>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="px-4 py-3">Machine ID</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Temp (°C)</th>
              <th className="px-4 py-3">Vibration (mm/s)</th>
              <th className="px-4 py-3">Current (A)</th>
              <th className="px-4 py-3">Failure Prob.</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {machines.map((m) => (
              <tr key={m.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{m.id}</td>
                <td className="px-4 py-3">{m.location}</td>
                <td className="px-4 py-3">{m.temperature}</td>
                <td className="px-4 py-3">{m.vibration.toFixed(2)}</td>
                <td className="px-4 py-3">{m.current.toFixed(1)}</td>
                <td className="px-4 py-3">{(m.failureProbability * 100).toFixed(0)}%</td>
                <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                <td className="px-4 py-3">
                  <Link to="/machines/$id" params={{ id: m.id }} className="text-primary hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
