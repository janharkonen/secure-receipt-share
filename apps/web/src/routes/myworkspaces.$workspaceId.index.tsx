import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import type { Id } from "@secure-receipt-share/backend/convex/_generated/dataModel";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/myworkspaces/$workspaceId/")({
  component: WorkspacesPage,
});

function WorkspacesPage() {
  const { workspaceId } = useParams({ from: "/myworkspaces/$workspaceId/" });
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
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <span className="text-xl font-semibold text-foreground">
            {isLoading ? "Loading..." : error ? "Error" : workspaceName}
          </span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {Object.entries(receiptsByCategoryObject ?? {}).map(
          ([category, receipts]) => (
            <section key={category} className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                {category}
              </h2>
              <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">
                        Name
                      </th>
                      <th className="text-right px-5 py-3 text-sm font-medium text-muted-foreground">
                        Price
                      </th>
                      <th className="text-right px-5 py-3 text-sm font-medium text-muted-foreground">
                        ALV
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {receipts.map((receipt) => (
                      <tr key={receipt._id} className="hover:bg-muted/30">
                        <td className="px-5 py-4 text-foreground">
                          {receipt.name}
                        </td>
                        <td className="px-5 py-4 text-right text-muted-foreground">
                          {receipt.price}
                        </td>
                        <td className="px-5 py-4 text-right text-muted-foreground">
                          {receipt.alv}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ),
        )}
      </main>
    </div>
  );
}
