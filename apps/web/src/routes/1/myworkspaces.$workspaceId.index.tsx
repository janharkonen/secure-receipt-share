import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import type { Id } from "@secure-receipt-share/backend/convex/_generated/dataModel";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/1/myworkspaces/$workspaceId/")({
  component: WorkspacesPage,
});

function WorkspacesPage() {
  const { workspaceId } = useParams({ from: "/1/myworkspaces/$workspaceId/" });
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
      className="min-h-screen bg-[#f7f4ed] px-6 py-10 text-black"
      style={{
        fontFamily: '"IBM Plex Mono", "SFMono-Regular", monospace',
      }}
    >
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="border-4 border-black bg-white p-6 shadow-[10px_10px_0_0_#000]">
          <p className="text-xs uppercase tracking-[0.4em]">Workspace Ledger</p>
          <h1 className="mt-3 text-3xl font-black uppercase">
            {isLoading
              ? "Loading..."
              : error
                ? "Error: " + error.message
                : workspaceName}
          </h1>
          <p className="mt-2 text-sm text-black/70">
            Receipt categories organized for fast review.
          </p>
        </header>

        <div className="grid gap-6">
          {Object.entries(receiptsByCategoryObject ?? {}).map(
            ([category, receipts]) => (
              <section key={category} className="space-y-3">
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                  <h2 className="text-xl font-black uppercase">{category}</h2>
                  <span className="text-xs uppercase tracking-[0.3em]">
                    {receipts.length} items
                  </span>
                </div>
                <div className="grid gap-3">
                  {receipts.map((receipt) => (
                    <Card
                      key={receipt._id}
                      className="border-2 border-black px-4 py-3 shadow-[4px_4px_0_0_#000]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 text-sm uppercase tracking-[0.2em]">
                        <span className="font-black">{receipt.name}</span>
                        <span>Price: {receipt.price}</span>
                        <span>ALV: {receipt.alv}</span>
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
