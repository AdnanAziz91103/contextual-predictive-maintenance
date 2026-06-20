import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { modelMetrics } from "../lib/dummyData";

export const Route = createFileRoute("/performance")({
  head: () => ({ meta: [{ title: "Model Performance – PdM Edge AI" }] }),
  component: Performance,
});

function Performance() {
  const [threshold, setThreshold] = useState(0.5);
  const { macroF1, precision, recall, confusionMatrix, classes } = modelMetrics;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Model Performance</h2>
      <p className="text-muted-foreground mb-6">Edge AI classifier evaluation metrics.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="text-sm text-muted-foreground">Macro F1 Score</div>
          <div className="text-3xl font-bold mt-1">{macroF1.toFixed(2)}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="text-sm text-muted-foreground">Precision</div>
          <div className="text-3xl font-bold mt-1">{precision.toFixed(2)}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="text-sm text-muted-foreground">Recall</div>
          <div className="text-3xl font-bold mt-1">{recall.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-5 mb-6">
        <h3 className="font-semibold mb-3">Confusion Matrix</h3>
        <table className="text-sm border-collapse">
          <thead>
            <tr>
              <th className="p-2"></th>
              {classes.map((c) => (
                <th key={c} className="p-2 text-muted-foreground font-medium">Pred {c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {confusionMatrix.map((row, i) => (
              <tr key={i}>
                <td className="p-2 text-muted-foreground font-medium">True {classes[i]}</td>
                {row.map((v, j) => (
                  <td
                    key={j}
                    className={`p-3 text-center border border-border ${i === j ? "bg-success/10 font-semibold" : "bg-muted"}`}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="font-semibold mb-2">Decision Threshold</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Adjust the probability threshold for raising an alert.
        </p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="flex-1"
          />
          <div className="font-mono font-semibold w-16 text-right">{threshold.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
