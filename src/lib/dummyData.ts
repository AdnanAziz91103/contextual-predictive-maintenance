export type Machine = {
  id: string;
  location: string;
  temperature: number;
  vibration: number;
  current: number;
  failureProbability: number;
  status: "Healthy" | "Warning" | "Critical";
  recommendation: string;
};

export const machines: Machine[] = [
  { id: "M-001", location: "Plant A - Line 1", temperature: 72, vibration: 0.42, current: 12.3, failureProbability: 0.08, status: "Healthy", recommendation: "Continue normal operation." },
  { id: "M-002", location: "Plant A - Line 2", temperature: 88, vibration: 0.91, current: 14.1, failureProbability: 0.62, status: "Warning", recommendation: "Schedule inspection within 48 hours." },
  { id: "M-003", location: "Plant B - Line 1", temperature: 95, vibration: 1.45, current: 16.8, failureProbability: 0.87, status: "Critical", recommendation: "Stop machine and replace bearings immediately." },
  { id: "M-004", location: "Plant B - Line 3", temperature: 68, vibration: 0.31, current: 11.2, failureProbability: 0.05, status: "Healthy", recommendation: "Continue normal operation." },
  { id: "M-005", location: "Plant C - Line 1", temperature: 81, vibration: 0.74, current: 13.5, failureProbability: 0.41, status: "Warning", recommendation: "Monitor vibration trend closely." },
  { id: "M-006", location: "Plant C - Line 2", temperature: 90, vibration: 1.12, current: 15.4, failureProbability: 0.78, status: "Critical", recommendation: "Plan maintenance shutdown within 24 hours." },
  { id: "M-007", location: "Plant A - Line 3", temperature: 70, vibration: 0.38, current: 12.0, failureProbability: 0.07, status: "Healthy", recommendation: "Continue normal operation." },
  { id: "M-008", location: "Plant B - Line 2", temperature: 84, vibration: 0.83, current: 13.9, failureProbability: 0.54, status: "Warning", recommendation: "Lubricate bearings during next shift." },
];

export const modelMetrics = {
  macroF1: 0.89,
  precision: 0.91,
  recall: 0.87,
  confusionMatrix: [
    [120, 5, 2],
    [6, 88, 7],
    [1, 4, 67],
  ],
  classes: ["Healthy", "Warning", "Critical"],
};

export type Alert = {
  id: string;
  type: "Critical" | "Vibration" | "Temperature" | "Maintenance";
  machineId: string;
  message: string;
  time: string;
};

export const alerts: Alert[] = [
  { id: "A-1", type: "Critical", machineId: "M-003", message: "Critical failure risk detected. Probability 87%.", time: "2 min ago" },
  { id: "A-2", type: "Vibration", machineId: "M-006", message: "High vibration (1.12 mm/s) above safe threshold.", time: "8 min ago" },
  { id: "A-3", type: "Temperature", machineId: "M-002", message: "Temperature reached 88°C, nearing limit.", time: "15 min ago" },
  { id: "A-4", type: "Maintenance", machineId: "M-008", message: "Scheduled lubrication maintenance required.", time: "1 hr ago" },
  { id: "A-5", type: "Critical", machineId: "M-006", message: "Failure probability above 75%. Plan shutdown.", time: "1 hr ago" },
  { id: "A-6", type: "Temperature", machineId: "M-003", message: "Temperature reached 95°C — over safe limit.", time: "2 hr ago" },
];
