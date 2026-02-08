import { convexQuery } from "@convex-dev/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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

  const colors = [
    "from-rose-400 to-orange-400",
    "from-fuchsia-400 to-pink-400",
    "from-indigo-400 to-purple-400",
    "from-cyan-400 to-blue-400",
    "from-emerald-400 to-teal-400",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
            🎨 My Workspaces
          </h1>
          <Button
            className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur rounded-full px-6"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </header>

        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8">
          <p className="text-gray-500 mb-6">Choose a workspace to continue</p>
          {workspaces1.isLoading ? (
            <div className="text-center py-8">
              <span className="text-4xl animate-spin inline-block">🌀</span>
              <p className="text-gray-500 mt-2">Loading...</p>
            </div>
          ) : workspaces1.error ? (
            <p className="text-red-500 text-center py-8">
              Error: {workspaces1.error.message}
            </p>
          ) : workspaces1.data ? (
            <div className="grid gap-4 md:grid-cols-2">
              {workspaces1.data.map((workspace, index) => (
                <Link
                  className={`block p-6 rounded-2xl bg-gradient-to-r ${colors[index % colors.length]} text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200`}
                  key={workspace._id}
                  to="/myworkspaces/$workspaceId"
                  params={{ workspaceId: workspace._id }}
                >
                  <span className="text-2xl mb-2 block">📁</span>
                  <span className="text-lg font-bold">
                    {workspace.workspace_name}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No workspaces yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
