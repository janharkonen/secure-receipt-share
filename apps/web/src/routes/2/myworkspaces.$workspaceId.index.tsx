import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import type { Id } from "@secure-receipt-share/backend/convex/_generated/dataModel";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

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
    <div
      className="min-h-screen bg-[#0b0e12] px-6 py-10 text-white"
      style={{
        fontFamily: '"DM Serif Display", "Playfair Display", serif',
      }}
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-[28px] border border-white/15 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">
            Workspace Ledger
          </p>
          <h1 className="mt-3 text-4xl">
            {isLoading
              ? "Loading..."
              : error
                ? "Error: " + error.message
                : workspaceName}
          </h1>
          <p className="mt-2 text-sm uppercase tracking-[0.3em] text-white/60">
            Category narratives and receipt lines.
          </p>
        </header>

        <div className="grid gap-6">
          {Object.entries(receiptsByCategoryObject ?? {}).map(
            ([category, receipts]) => (
              <section key={category} className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/20 pb-2">
                  <h2 className="text-2xl">{category}</h2>
                  <span className="text-xs uppercase tracking-[0.3em] text-white/60">
                    {receipts.length} receipts
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {receipts.map((receipt) => (
                    <Card
                      key={receipt._id}
                      className="rounded-[22px] border border-white/15 bg-white/5 px-5 py-4 text-white"
                    >
                      <div className="space-y-2">
                        <p className="text-lg">{receipt.name}</p>
                        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
                          <span>Price: {receipt.price}</span>
                          <span>ALV: {receipt.alv}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
