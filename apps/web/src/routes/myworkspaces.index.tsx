import { convexQuery } from "@convex-dev/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/myworkspaces/")({
  component: WorkspacesPage,
  ssr: true,
});

function WorkspacesPage() {
  const workspaces1 = useQuery(
    convexQuery(api.workspaces.getMyWorkspaces, {}),
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Workspaces</h1>
        <p className="text-muted-foreground">
          Select a workspace to view receipts
        </p>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm">
        {workspaces1.isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading workspaces...
          </div>
        ) : workspaces1.error ? (
          <div className="p-8 text-center text-destructive">
            Error: {workspaces1.error.message}
          </div>
        ) : workspaces1.data ? (
          <div className="divide-y divide-border">
            {workspaces1.data.map((workspace) => (
              <Link
                className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
                key={workspace._id}
                to="/myworkspaces/$workspaceId"
                params={{ workspaceId: workspace._id }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-semibold text-lg">
                      {workspace.workspace_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      {workspace.workspace_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Click to view details
                    </div>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-muted-foreground"
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
          <div className="p-8 text-center text-muted-foreground">
            No workspaces found
          </div>
        )}
      </div>
    </main>
  );
}
