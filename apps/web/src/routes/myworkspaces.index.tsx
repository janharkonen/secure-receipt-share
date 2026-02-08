import { convexQuery } from "@convex-dev/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/myworkspaces/")({
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">SR</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Dashboard
            </span>
          </div>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-600"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Workspaces</h1>
          <p className="text-gray-500">Select a workspace to view receipts</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {workspaces1.isLoading ? (
            <div className="p-8 text-center text-gray-500">
              Loading workspaces...
            </div>
          ) : workspaces1.error ? (
            <div className="p-8 text-center text-red-500">
              Error: {workspaces1.error.message}
            </div>
          ) : workspaces1.data ? (
            <div className="divide-y divide-gray-100">
              {workspaces1.data.map((workspace) => (
                <Link
                  className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                  key={workspace._id}
                  to="/myworkspaces/$workspaceId"
                  params={{ workspaceId: workspace._id }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-700 font-semibold text-lg">
                        {workspace.workspace_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {workspace.workspace_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Click to view details
                      </div>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No workspaces found
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
