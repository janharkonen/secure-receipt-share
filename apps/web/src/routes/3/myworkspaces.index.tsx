import { convexQuery } from "@convex-dev/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/3/myworkspaces/")({
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
      className="min-h-screen bg-[#f2efe9] px-6 py-12 text-[#2c1c12]"
      style={{
        fontFamily: '"Cormorant Garamond", "Times New Roman", serif',
      }}
    >
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="flex flex-col gap-6 border border-[#2c1c12] p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-[#6b4a3a]">
              Workspace Registry
            </p>
            <h1 className="mt-3 text-4xl font-semibold">My Workspaces</h1>
            <p className="mt-2 text-sm uppercase tracking-[0.3em] text-[#6b4a3a]">
              Select a ledger suite to continue.
            </p>
          </div>
          <Button
            className="border border-[#2c1c12] bg-[#2c1c12] text-xs uppercase tracking-[0.35em] text-[#f2efe9] hover:bg-[#3b261a]"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </header>

        <Card className="border border-[#2c1c12] bg-white">
          <CardContent className="space-y-5 p-8">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-[#6b4a3a]">
              <span>Signed in with Google</span>
              <span className="border border-[#2c1c12] px-3 py-1 text-[0.65rem]">
                Active
              </span>
            </div>
            {workspaces1.isLoading ? (
              <p className="text-sm uppercase tracking-[0.3em] text-[#6b4a3a]">
                Loading workspaces...
              </p>
            ) : workspaces1.error ? (
              <p className="text-sm text-red-600">
                Error: {workspaces1.error.message}
              </p>
            ) : workspaces1.data ? (
              <div className="grid gap-4">
                {workspaces1.data.map((workspace) => (
                  <Link
                    className="flex items-center justify-between border border-[#2c1c12] bg-white px-5 py-4 text-lg transition hover:-translate-y-1 hover:bg-[#2c1c12] hover:text-[#f2efe9]"
                    key={workspace._id}
                    to="/myworkspaces/$workspaceId"
                    params={{ workspaceId: workspace._id }}
                  >
                    {workspace.workspace_name}
                    <span className="text-xs uppercase tracking-[0.3em]">
                      Enter →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#6b4a3a]">
                Unable to load workspaces
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
