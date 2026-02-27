import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { toast } from "sonner";

export const Route = createFileRoute("/myworkspaces")({
  component: WorkspacesPage,
});

function WorkspacesPage() {
  const navigate = useNavigate();
  const user = useQuery(api.auth.getCurrentUser);
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
    <div className="min-h-screen bg-background">
      <nav className="bg-card/80 backdrop-blur-md border-b border-border/40 px-6 py-2.5 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <img
              src="/receipt-with-lock-icon-light-nobg.png"
              alt="Secure Receipt Share"
              className="w-11 h-11 rounded-xl object-contain group-hover:rotate-3 transition-transform duration-300"
            />
            <span className="text-lg font-bold text-foreground tracking-tight">
              Secure Receipt Share
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              You are signed in as <Badge variant="secondary">{user?.email ?? "..."}</Badge>
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
