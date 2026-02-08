import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import type { Id } from "@secure-receipt-share/backend/convex/_generated/dataModel";
import { createFileRoute, useParams } from "@tanstack/react-router";

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
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-8 py-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-light text-gray-900">
            {isLoading ? "..." : error ? "Error" : workspaceName}
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-12">
        {Object.entries(receiptsByCategoryObject ?? {}).map(
          ([category, receipts]) => (
            <section key={category} className="mb-12">
              <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-4">
                {category}
              </h2>
              <div className="space-y-2">
                {receipts.map((receipt) => (
                  <div
                    key={receipt._id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                  >
                    <span className="text-gray-800">{receipt.name}</span>
                    <div className="flex gap-6 text-sm text-gray-400">
                      <span>{receipt.price}</span>
                      <span>ALV {receipt.alv}</span>
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
