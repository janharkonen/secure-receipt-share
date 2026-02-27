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

  const workspaceEmojis = [
    "🌿",
    "🍂",
    "🌻",
    "🪵",
    "🌾",
    "🍁",
    "🌲",
    "🪴",
    "🍃",
    "🌰",
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Your Workspaces 🗂️
        </h1>
        <p className="text-muted-foreground mt-1.5">
          Pick a workspace to dive into your receipts
        </p>
      </div>

      {workspaces1.isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl border border-border/40 shadow-md p-6 animate-pulse"
            >
              <div className="w-14 h-14 bg-muted rounded-xl mb-4" />
              <div className="h-5 bg-muted rounded-lg w-2/3 mb-2" />
              <div className="h-3 bg-muted/60 rounded-lg w-1/3" />
            </div>
          ))}
        </div>
      ) : workspaces1.error ? (
        <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-10 text-center text-destructive animate-pop-in">
          Oops! {workspaces1.error.message}
        </div>
      ) : workspaces1.data && workspaces1.data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces1.data.map((workspace, index) => (
            <Link
              className="group bg-card rounded-2xl border border-border/40 shadow-md hover:shadow-xl p-6 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 animate-slide-up"
              style={{ animationDelay: `${index * 80}ms` }}
              key={workspace._id}
              to="/myworkspaces/$workspaceId"
              params={{ workspaceId: workspace._id }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary/15 via-accent/10 to-chart-2/15 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                <span className="text-2xl">
                  {workspaceEmojis[index % workspaceEmojis.length]}
                </span>
              </div>
              <div className="font-bold text-foreground group-hover:text-primary transition-colors text-base mb-1">
                {workspace.workspace_name}
              </div>
              {workspace.access_rights?.length > 0 && (
                <div className="mb-2">
                  <div className="text-[10px] text-muted-foreground/80 uppercase tracking-wide mb-1">
                    Access right given to:
                  </div>
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-x-1.5 gap-y-0.5">
                  {workspace.access_rights.map((email) => (
                    <span
                      key={email}
                      className="inline-flex items-center rounded-md bg-muted/60 px-1.5 py-0.5"
                    >
                      {email}
                    </span>
                  ))}
                  </div>
                </div>
              )}
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                View receipts
                <svg
                  className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border/40 border-dashed shadow-sm p-14 text-center text-muted-foreground animate-pop-in">
          <span className="text-4xl block mb-3">📭</span>
          No workspaces yet — check back soon!
        </div>
      )}
    </main>
  );
}
