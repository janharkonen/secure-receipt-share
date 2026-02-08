import { convexQuery } from "@convex-dev/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <div
      className="min-h-screen bg-[#0b0e12] px-6 py-10 text-white"
      style={{
        fontFamily: '"DM Serif Display", "Playfair Display", serif',
      }}
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-5 rounded-[28px] border border-white/15 bg-white/5 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              Workspace Gallery
            </p>
            <h1 className="mt-3 text-4xl">My Workspaces</h1>
            <p className="mt-2 text-sm uppercase tracking-[0.3em] text-white/60">
              Curated vaults for your receipts and collaborators.
            </p>
          </div>
          <Button
            className="rounded-full bg-white text-xs uppercase tracking-[0.35em] text-black hover:bg-white/80"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </header>

        <Card className="rounded-[28px] border border-white/15 bg-white/5 text-white">
          <CardContent className="space-y-5 p-8">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/60">
              <span>Signed in with Google</span>
              <span className="rounded-full border border-white/30 px-3 py-1 text-[0.65rem]">
                Verified
              </span>
            </div>
            {workspaces1.isLoading ? (
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">
                Loading workspaces...
              </p>
            ) : workspaces1.error ? (
              <p className="text-sm text-red-400">
                Error: {workspaces1.error.message}
              </p>
            ) : workspaces1.data ? (
              <div className="grid gap-4">
                {workspaces1.data.map((workspace) => (
                  <Link
                    className="flex flex-col gap-2 rounded-[22px] border border-white/20 bg-white/5 px-6 py-5 text-white transition hover:-translate-y-1 hover:bg-white/10"
                    key={workspace._id}
                    to="/myworkspaces/$workspaceId"
                    params={{ workspaceId: workspace._id }}
                  >
                    <span className="text-2xl">{workspace.workspace_name}</span>
                    <span className="text-xs uppercase tracking-[0.3em] text-white/60">
                      Enter workspace →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/60">
                Unable to load workspaces
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
