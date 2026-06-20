import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { Layout } from "../components/Layout";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Contextual Predictive Maintenance – IoT Edge AI" },
      { name: "description", content: "Predictive maintenance dashboard for IoT Edge AI." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => (
    <div className="p-8">
      <h1 className="text-2xl font-bold">404 - Not Found</h1>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-8">
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <pre className="mt-2 text-sm">{error.message}</pre>
    </div>
  ),
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Layout />
    </QueryClientProvider>
  );
}
