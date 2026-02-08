import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import type { Id } from "@secure-receipt-share/backend/convex/_generated/dataModel";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-white">
          {isLoading
            ? "Loading..."
            : error
              ? "Error: " + error.message
              : workspaceName}
        </h1>
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(receiptsByCategoryObject ?? {}).map(
            ([category, receipts]) => (
              <div key={category}>
                <h2 className="text-xl font-bold text-white">{category}</h2>
                <div className="grid grid-cols-1 mt-4 gap-4">
                  {receipts.map((receipt) => (
                    <Card key={receipt._id} className="py-3 px-4">
                      <div className="flex items-center justify-start gap-4">
                        <span className="font-medium">{receipt.name}</span>
                        <span className="text-sm text-gray-500">
                          Price: {receipt.price}
                        </span>
                        <span className="text-sm text-gray-500">
                          ALV: {receipt.alv}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
