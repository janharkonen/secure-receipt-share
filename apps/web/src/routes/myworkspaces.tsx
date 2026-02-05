import { convexQuery } from "@convex-dev/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
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

export const Route = createFileRoute("/myworkspaces")({
  component: WorkspacesPage,
  beforeLoad: async ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
});

function WorkspacesPage() {
  const navigate = useNavigate();
  const currentUser = useQuery(convexQuery(api.auth.getCurrentUser, {}));

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
            {currentUser.isLoading ? (
              <p className="text-muted-foreground">Loading user data...</p>
            ) : currentUser.data ? (
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {currentUser.data.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {currentUser.data.email}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">Unable to load user data</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
