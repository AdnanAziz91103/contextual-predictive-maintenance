import { createFileRoute, Link } from "@tanstack/react-router";
import { machines } from "../lib/dummyData";

export const Route = createFileRoute("/machines/$id")({
  head: () => ({ meta: [{ title: "Machine Details – PdM Edge AI" }] }),
  component: MachineDetails,
});

function MachineDetails() {
  const { id } = Route.useParams();
  const machine = machines.find((m) => m.id === id);

  if (!machine) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-2">Machine not found</h2>
        <Link to="/monitoring" className="text-primary hover:underline">Back to monitoring</Link>
      </div>
    );
  }

  const statusColor =
    machine.status === "Healthy" ? "text-success" :
    machine.status === "Warning" ? "text-warning" : "text-danger";

  return (
    <div>
      <Link to="/monitoring" className="text-sm text-primary hover:underline">← Back to Monitoring</Link>
      <h2 className="text-2xl font-bold mt-2 mb-1">{machine.id}</h2>
      <p className="text-muted-foreground mb-6">{machine.location}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="text-sm text-muted-foreground">Temperature</div>
          <div className="text-2xl font-bold mt-1">{machine.temperature} °C</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="text-sm text-muted-foreground">Vibration</div>
          <div className="text-2xl font-bold mt-1">{machine.vibration.toFixed(2)} mm/s</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="text-sm text-muted-foreground">Current</div>
          <div className="text-2xl font-bold mt-1">{machine.current.toFixed(1)} A</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-5 mb-6">
        <h3 className="font-semibold mb-3">Failure Probability</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-3 bg-muted rounded overflow-hidden">
            <div
              className={`h-3 ${machine.failureProbability > 0.7 ? "bg-danger" : machine.failureProbability > 0.4 ? "bg-warning" : "bg-success"}`}
              style={{ width: `${machine.failureProbability * 100}%` }}
            />
          </div>
          <div className="font-semibold w-12 text-right">{(machine.failureProbability * 100).toFixed(0)}%</div>
        </div>
        <div className={`mt-3 font-medium ${statusColor}`}>Status: {machine.status}</div>
      </div>

      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="font-semibold mb-2">Recommendation</h3>
        <p className="text-sm">{machine.recommendation}</p>
      </div>
    </div>
  );
}
