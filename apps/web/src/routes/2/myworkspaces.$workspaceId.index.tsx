import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import type { Id } from "@secure-receipt-share/backend/convex/_generated/dataModel";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/2/myworkspaces/$workspaceId/")({
  component: WorkspacesPage,
});

function WorkspacesPage() {
  const { workspaceId } = useParams({ from: "/2/myworkspaces/$workspaceId/" });
  const {
    data: { workspaceName, receiptsByCategoryObject } = {},
    isLoading,
    error,
  } = useQuery(
    convexQuery(api.workspaces.getWorkspaceData, {
      workspaceId: workspaceId as Id<"workspaces">,
    }),
  );

  return (
    <div className="min-h-screen bg-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,255,200,0.08),transparent_50%)]" />

      <header className="relative z-10 border-b border-cyan-500/20 px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            {isLoading
              ? "⟳ LOADING..."
              : error
                ? "✗ ERROR"
                : `◆ ${workspaceName}`}
          </h1>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-8 py-12">
        {Object.entries(receiptsByCategoryObject ?? {}).map(
          ([category, receipts]) => (
            <section key={category} className="mb-10">
              <h2 className="text-sm font-mono text-purple-400 mb-4 flex items-center gap-2">
                <span className="w-4 h-[2px] bg-purple-400" />
                {category.toUpperCase()}
              </h2>
              <div className="space-y-2">
                {receipts.map((receipt) => (
                  <div
                    key={receipt._id}
                    className="flex items-center justify-between p-4 border border-cyan-500/20 rounded-lg bg-cyan-500/5 hover:bg-cyan-500/10 transition-all"
                  >
                    <span className="text-white font-medium">
                      {receipt.name}
                    </span>
                    <div className="flex gap-6 font-mono text-sm">
                      <span className="text-cyan-400">{receipt.price}</span>
                      <span className="text-purple-400">ALV:{receipt.alv}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ),
        )}
      </main>
    </div>
  );
}
