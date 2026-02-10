import { convexQuery } from "@convex-dev/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/myworkspaces/")({
  component: WorkspacesPage,
  ssr: true,
});

function WorkspacesPage() {
  const workspaces1 = useQuery(convexQuery(api.workspaces.getMyWorkspaces, {}));

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Your Workspaces 🗂️
        </h1>
        <p className="text-muted-foreground mt-1">
          Select a workspace to view your receipts
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border/60 shadow-lg shadow-primary/5 overflow-hidden">
        {workspaces1.isLoading ? (
          <div className="p-10 text-center text-muted-foreground">
            <div className="animate-pulse">Loading workspaces...</div>
          </div>
        ) : workspaces1.error ? (
          <div className="p-10 text-center text-destructive">
            Error: {workspaces1.error.message}
          </div>
        ) : workspaces1.data ? (
          <div className="divide-y divide-border/50">
            {workspaces1.data.map((workspace) => (
              <Link
                className="flex items-center justify-between p-5 hover:bg-muted/50 transition-all duration-200 group"
                key={workspace._id}
                to="/myworkspaces/$workspaceId"
                params={{ workspaceId: workspace._id }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <span className="text-primary font-bold text-xl">
                      {workspace.workspace_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {workspace.workspace_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Click to view details →
                    </div>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-muted-foreground">
            No workspaces found
          </div>
        )}
      </div>
    </main>
  );
}
