import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import type { Id } from "@secure-receipt-share/backend/convex/_generated/dataModel";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/5/myworkspaces/$workspaceId/")({
  component: WorkspacesPage,
});

function WorkspacesPage() {
  const { workspaceId } = useParams({ from: "/5/myworkspaces/$workspaceId/" });
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
      className="min-h-screen bg-[#050505] px-6 py-12 text-[#f6f1e9]"
      style={{
        fontFamily: '"Bebas Neue", "Franklin Gothic Medium", sans-serif',
      }}
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="border border-[#d1a679] bg-[#0c0c0c] p-8">
          <p className="text-xs uppercase tracking-[0.5em] text-[#d1a679]">
            Workspace Ledger
          </p>
          <h1 className="mt-3 text-5xl uppercase text-[#f6f1e9]">
            {isLoading
              ? "Loading..."
              : error
                ? "Error: " + error.message
                : workspaceName}
          </h1>
          <p className="mt-2 text-sm uppercase tracking-[0.4em] text-[#d1a679]">
            Category breakdowns and receipt signals.
          </p>
        </header>

        <div className="grid gap-8">
          {Object.entries(receiptsByCategoryObject ?? {}).map(
            ([category, receipts]) => (
              <section key={category} className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#d1a679] pb-2">
                  <h2 className="text-3xl uppercase text-[#f6f1e9]">
                    {category}
                  </h2>
                  <span className="text-xs uppercase tracking-[0.4em] text-[#d1a679]">
                    {receipts.length} receipts
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {receipts.map((receipt) => (
                    <Card
                      key={receipt._id}
                      className="border border-[#d1a679] bg-[#050505] px-6 py-4 text-[#f6f1e9]"
                    >
                      <div className="space-y-2">
                        <p className="text-2xl uppercase">{receipt.name}</p>
                        <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.4em] text-[#d1a679]">
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
