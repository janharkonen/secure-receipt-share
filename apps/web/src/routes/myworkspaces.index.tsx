import { convexQuery } from "@convex-dev/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">My Workspaces</h1>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome!</CardTitle>
            <CardDescription>You are signed in with Google</CardDescription>
          </CardHeader>
          <CardContent>
            {workspaces1.isLoading ? (
              <p className="text-muted-foreground">Loading workspaces...</p>
            ) : workspaces1.error ? (
              <p className="text-red-500">Error: {workspaces1.error.message}</p>
            ) : workspaces1.data ? (
              <div className="space-y-2">
                {workspaces1.data.map((workspace) => (
                  <Link
                    className="flex items-center justify-between p-2 rounded-md bg-muted"
                    key={workspace._id}
                    to="/myworkspaces/$workspaceId"
                    params={{ workspaceId: workspace._id }}
                  >
                    {workspace.workspace_name}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Unable to load workspaces</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
