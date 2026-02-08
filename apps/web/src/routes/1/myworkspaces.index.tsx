import { convexQuery } from "@convex-dev/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/1/myworkspaces/")({
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
    <div
      className="min-h-screen bg-[#f7f4ed] px-6 py-10 text-black"
      style={{
        fontFamily: '"IBM Plex Mono", "SFMono-Regular", monospace',
      }}
    >
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-col gap-4 border-4 border-black bg-white p-6 shadow-[10px_10px_0_0_#000] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em]">Workspace Index</p>
            <h1 className="mt-2 text-3xl font-black uppercase">
              My Workspaces
            </h1>
            <p className="mt-2 text-sm text-black/70">
              Select a vault to review receipt archives.
            </p>
          </div>
          <Button
            className="border-2 border-black bg-black text-xs uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </header>

        <Card className="border-4 border-black shadow-[6px_6px_0_0_#000]">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em]">
              <span>Signed in with Google</span>
              <span className="border border-black px-3 py-1">Active</span>
            </div>
            {workspaces1.isLoading ? (
              <p className="text-sm uppercase tracking-[0.2em] text-black/60">
                Loading workspaces...
              </p>
            ) : workspaces1.error ? (
              <p className="text-sm text-red-600">
                Error: {workspaces1.error.message}
              </p>
            ) : workspaces1.data ? (
              <div className="grid gap-3">
                {workspaces1.data.map((workspace) => (
                  <Link
                    className="flex items-center justify-between border-2 border-black bg-white px-4 py-3 text-sm uppercase tracking-[0.2em] transition hover:-translate-y-0.5 hover:bg-black hover:text-white"
                    key={workspace._id}
                    to="/myworkspaces/$workspaceId"
                    params={{ workspaceId: workspace._id }}
                  >
                    {workspace.workspace_name}
                    <span>→</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-black/60">
                Unable to load workspaces
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
