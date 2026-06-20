import { Link, Outlet, useRouterState } from "@tanstack/react-router";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/monitoring", label: "Machine Monitoring" },
  { to: "/performance", label: "Model Performance" },
  { to: "/alerts", label: "Alerts" },
];

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
        <div className="p-4 text-xs text-muted-foreground border-t border-border">
          Student Demo Project
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
