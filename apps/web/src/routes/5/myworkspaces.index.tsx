import { convexQuery } from "@convex-dev/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-100">
      <header className="bg-white/70 backdrop-blur border-b border-emerald-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌿</span>
            <h1 className="text-xl font-semibold text-emerald-900">
              My Workspaces
            </h1>
          </div>
          <Button
            variant="outline"
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <p className="text-emerald-600/70 mb-6">
          Choose your workspace to continue
        </p>

        {workspaces1.isLoading ? (
          <div className="text-center py-12">
            <span className="text-3xl animate-pulse">🍃</span>
            <p className="text-emerald-600 mt-2">Growing your workspaces...</p>
          </div>
        ) : workspaces1.error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600">
            Error: {workspaces1.error.message}
          </div>
        ) : workspaces1.data ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {workspaces1.data.map((workspace, index) => (
              <Link
                className="bg-white/80 backdrop-blur border border-emerald-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-emerald-100 hover:border-emerald-200 transition-all group"
                key={workspace._id}
                to="/myworkspaces/$workspaceId"
                params={{ workspaceId: workspace._id }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xl shadow-md">
                    {["🌱", "🌿", "🍀", "🌳", "🌴"][index % 5]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-emerald-900 group-hover:text-emerald-700 transition-colors">
                      {workspace.workspace_name}
                    </h3>
                    <p className="text-sm text-emerald-600/60 mt-1">
                      Click to explore
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-emerald-600/70">
            No workspaces yet. Time to plant some seeds! 🌱
          </div>
        )}
      </main>
    </div>
  );
}
