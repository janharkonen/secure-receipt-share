import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import type { Id } from "@secure-receipt-share/backend/convex/_generated/dataModel";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/3/myworkspaces/$workspaceId/")({
  component: WorkspacesPage,
});

function WorkspacesPage() {
  const { workspaceId } = useParams({ from: "/3/myworkspaces/$workspaceId/" });
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
      className="min-h-screen bg-[#f2efe9] px-6 py-12 text-[#2c1c12]"
      style={{
        fontFamily: '"Cormorant Garamond", "Times New Roman", serif',
      }}
    >
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="border border-[#2c1c12] bg-white p-8">
          <p className="text-xs uppercase tracking-[0.5em] text-[#6b4a3a]">
            Workspace Ledger
          </p>
          <h1 className="mt-3 text-4xl font-semibold">
            {isLoading
              ? "Loading..."
              : error
                ? "Error: " + error.message
                : workspaceName}
          </h1>
          <p className="mt-2 text-sm uppercase tracking-[0.3em] text-[#6b4a3a]">
            Review each category with editorial clarity.
          </p>
        </header>

        <div className="grid gap-8">
          {Object.entries(receiptsByCategoryObject ?? {}).map(
            ([category, receipts]) => (
              <section key={category} className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#2c1c12] pb-2">
                  <h2 className="text-2xl font-semibold">{category}</h2>
                  <span className="text-xs uppercase tracking-[0.3em] text-[#6b4a3a]">
                    {receipts.length} receipts
                  </span>
                </div>
                <div className="grid gap-4">
                  {receipts.map((receipt) => (
                    <Card
                      key={receipt._id}
                      className="border border-[#2c1c12] bg-white px-6 py-4"
                    >
                      <div className="space-y-2">
                        <p className="text-lg font-semibold">{receipt.name}</p>
                        <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em] text-[#6b4a3a]">
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
