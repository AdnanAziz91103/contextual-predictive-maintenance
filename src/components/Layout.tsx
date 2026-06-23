import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/monitoring", label: "Machine Monitoring" },
  { to: "/performance", label: "Model Performance" },
  { to: "/alerts", label: "Alerts" },
];

function AiToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    try {
      setEnabled(localStorage.getItem("showAIInsights") === "true");
    } catch {
      setEnabled(false);
    }
  }, []);

  function toggle() {
    try {
      const key = "showAIInsights";
      const next = !enabled;
      localStorage.setItem(key, String(next));
      setEnabled(next);
      window.dispatchEvent(new Event("ai-toggle-changed"));
    } catch {
      // ignore in SSR or restricted environments
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs">AI Insights</label>
      <button
        onClick={toggle}
        className={`inline-flex items-center h-6 w-10 rounded-full p-1 transition-colors duration-200 ${
          enabled ? "bg-emerald-500" : "bg-slate-300"
        }`}
        aria-label="Toggle AI Insights"
      >
        <span
          className={`h-4 w-4 rounded-full bg-white shadow transform transition-all ${
            enabled ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export function Layout() {
  const { location } = useRouterState();
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white border-r border-border flex flex-col">
        <div className="p-5 border-b border-border">
          <h1 className="text-lg font-bold text-foreground">PdM Edge AI</h1>
          <p className="text-xs text-muted-foreground mt-1">Predictive Maintenance</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active =
              item.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 text-xs text-muted-foreground border-t border-border flex items-center justify-between">
          <div>Student Demo Project</div>
          <AiToggle />
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
