import { convexQuery } from "@convex-dev/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/2/myworkspaces/")({
  component: WorkspacesPage,
  ssr: true,
});

function WorkspacesPage() {
  const navigate = useNavigate();
  const workspaces1 = useQuery(convexQuery(api.workspaces.getMyWorkspaces, {}));

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({ to: "/" });
          toast.success("Signed out successfully");
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(120,0,255,0.1),transparent_50%)]" />

      <header className="relative z-10 border-b border-cyan-500/20 px-8 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            ▲ WORKSPACES
          </h1>
          <Button
            variant="outline"
            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
            onClick={handleSignOut}
          >
            DISCONNECT
          </Button>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-8 py-12">
        <div className="border border-cyan-500/20 rounded-xl bg-black/50 backdrop-blur p-6">
          <p className="text-cyan-500/60 font-mono text-sm mb-6">
            // select workspace to continue
          </p>
          {workspaces1.isLoading ? (
            <p className="text-cyan-400 animate-pulse">⟳ LOADING...</p>
          ) : workspaces1.error ? (
            <p className="text-red-400">✗ ERROR: {workspaces1.error.message}</p>
          ) : workspaces1.data ? (
            <div className="space-y-3">
              {workspaces1.data.map((workspace, index) => (
                <Link
                  className="block p-4 border border-purple-500/30 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-400/50 transition-all group"
                  key={workspace._id}
                  to="/myworkspaces/$workspaceId"
                  params={{ workspaceId: workspace._id }}
                >
                  <span className="text-cyan-400 font-mono mr-3">
                    0{index + 1}
                  </span>
                  <span className="text-white group-hover:text-cyan-300 transition-colors">
                    {workspace.workspace_name}
                  </span>
                  <span className="float-right text-purple-400">→</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-cyan-500/60">NO DATA FOUND</p>
          )}
        </div>
      </main>
    </div>
  );
}
