import { convexQuery } from "@convex-dev/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-8 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-light text-gray-900">Workspaces</h1>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-gray-600"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-12">
        {workspaces1.isLoading ? (
          <p className="text-gray-400 text-center">Loading...</p>
        ) : workspaces1.error ? (
          <p className="text-red-400 text-center">
            {workspaces1.error.message}
          </p>
        ) : workspaces1.data ? (
          <div className="space-y-3">
            {workspaces1.data.map((workspace) => (
              <Link
                className="block p-6 border border-gray-100 rounded-lg hover:border-gray-200 hover:shadow-sm transition-all"
                key={workspace._id}
                to="/myworkspaces/$workspaceId"
                params={{ workspaceId: workspace._id }}
              >
                <span className="text-gray-800 font-medium">
                  {workspace.workspace_name}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No workspaces found</p>
        )}
      </main>
    </div>
  );
}
