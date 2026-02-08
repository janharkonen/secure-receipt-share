import { convexQuery } from "@convex-dev/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/4/myworkspaces/")({
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
      className="min-h-screen bg-[#07131a] px-6 py-12 text-[#d6f3ff]"
      style={{
        fontFamily: '"Rajdhani", "Segoe UI", sans-serif',
      }}
    >
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="flex flex-col gap-6 rounded-[28px] border border-[#1f4452] bg-[#0a1b24] p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#7bd0ff]">
              Workspace Terminal
            </p>
            <h1 className="mt-3 text-4xl text-white">My Workspaces</h1>
            <p className="mt-2 text-sm uppercase tracking-[0.3em] text-[#7bd0ff]">
              Select a cockpit to inspect receipts.
            </p>
          </div>
          <Button
            className="rounded-full border border-[#1f4452] bg-[#7bd0ff] text-xs uppercase tracking-[0.35em] text-[#07131a] hover:bg-[#a7e3ff]"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </header>

        <Card className="rounded-[28px] border border-[#1f4452] bg-[#0a1b24] text-[#d6f3ff]">
          <CardContent className="space-y-5 p-8">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-[#7bd0ff]">
              <span>Signed in with Google</span>
              <span className="rounded-full border border-[#1f4452] px-3 py-1 text-[0.65rem]">
                Clear
              </span>
            </div>
            {workspaces1.isLoading ? (
              <p className="text-sm uppercase tracking-[0.3em] text-[#7bd0ff]">
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
                    className="group flex items-center justify-between rounded-[22px] border border-[#1f4452] bg-[#0a1b24] px-6 py-5 text-white transition hover:-translate-y-1 hover:border-[#7bd0ff]"
                    key={workspace._id}
                    to="/myworkspaces/$workspaceId"
                    params={{ workspaceId: workspace._id }}
                  >
                    <span className="text-xl">{workspace.workspace_name}</span>
                    <span className="text-xs uppercase tracking-[0.3em] text-[#7bd0ff]">
                      Launch →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#7bd0ff]">
                Unable to load workspaces
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
