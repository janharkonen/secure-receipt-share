import { convexQuery } from "@convex-dev/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/5/myworkspaces/")({
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
      className="min-h-screen bg-[#050505] px-6 py-12 text-[#f6f1e9]"
      style={{
        fontFamily: '"Bebas Neue", "Franklin Gothic Medium", sans-serif',
      }}
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="flex flex-col gap-6 border border-[#d1a679] bg-[#0c0c0c] p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-[#d1a679]">
              Workspace Syndicate
            </p>
            <h1 className="mt-3 text-5xl uppercase text-[#f6f1e9]">
              My Workspaces
            </h1>
            <p className="mt-2 text-sm uppercase tracking-[0.4em] text-[#d1a679]">
              Select a vault for receipt dispatch.
            </p>
          </div>
          <Button
            className="border border-[#d1a679] bg-[#f6f1e9] text-xs uppercase tracking-[0.4em] text-black hover:bg-[#d1a679]"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </header>

        <Card className="border border-[#d1a679] bg-[#0c0c0c] text-[#f6f1e9]">
          <CardContent className="space-y-5 p-8">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.5em] text-[#d1a679]">
              <span>Signed in with Google</span>
              <span className="border border-[#d1a679] px-3 py-1 text-[0.65rem]">
                Active
              </span>
            </div>
            {workspaces1.isLoading ? (
              <p className="text-sm uppercase tracking-[0.3em] text-[#d1a679]">
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
                    className="flex items-center justify-between border border-[#d1a679] bg-[#050505] px-6 py-4 text-2xl uppercase transition hover:-translate-y-1 hover:bg-[#f6f1e9] hover:text-black"
                    key={workspace._id}
                    to="/myworkspaces/$workspaceId"
                    params={{ workspaceId: workspace._id }}
                  >
                    {workspace.workspace_name}
                    <span className="text-xs uppercase tracking-[0.4em]">
                      Enter →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#d1a679]">
                Unable to load workspaces
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
