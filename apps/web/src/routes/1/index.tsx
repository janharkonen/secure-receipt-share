import {
  createFileRoute,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/1/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useRouteContext({ from: "/" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/myworkspaces" });
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/myworkspaces",
      });
    } catch (error) {
      toast.error("Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f7f4ed] px-6 py-10 text-black"
      style={{
        fontFamily: '"IBM Plex Mono", "SFMono-Regular", monospace',
      }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center gap-10">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em]">
          <span>Secure Receipt Share</span>
          <span className="border-2 border-black px-3 py-1">Access</span>
        </div>
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div className="border-4 border-black bg-white p-8 shadow-[10px_10px_0_0_#000]">
            <p className="text-xs uppercase tracking-[0.3em]">Control Panel</p>
            <h1 className="mt-4 text-4xl font-black uppercase">
              Receipt Command Center
            </h1>
            <p className="mt-4 text-sm uppercase tracking-[0.25em] text-black/70">
              Brutalist ledger access for secure workspace sharing.
            </p>
            <div className="mt-8 grid gap-2 text-xs uppercase">
              <div className="border border-black px-3 py-2">
                Verified workspace vaults
              </div>
              <div className="border border-black px-3 py-2">
                Live receipt categorization
              </div>
              <div className="border border-black px-3 py-2">
                Real-time access control
              </div>
            </div>
          </div>
          <Card className="border-4 border-black shadow-[6px_6px_0_0_#000]">
            <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em]">Authenticate</p>
                <h2 className="mt-2 text-2xl font-black uppercase">
                  Sign in now
                </h2>
                <p className="mt-3 text-sm text-black/70">
                  Use Google to enter your workspace roster.
                </p>
              </div>
              <Button
                className="w-full border-2 border-black bg-black text-xs uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
