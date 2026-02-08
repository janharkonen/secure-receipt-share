import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/myworkspaces")({
  component: WorkspacesPage,
});

function WorkspacesPage() {
  const navigate = useNavigate();
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
      <nav className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/receipt-with-lock-icon-nobg.png"
              alt="Secure Receipt Share"
              className="w-10 h-10 rounded-lg object-contain"
            />
            <span className="text-xl font-semibold text-foreground">
              Secure Receipt Share
            </span>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
