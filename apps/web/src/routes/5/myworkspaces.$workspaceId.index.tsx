import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import type { Id } from "@secure-receipt-share/backend/convex/_generated/dataModel";
import { createFileRoute, useParams } from "@tanstack/react-router";

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

  const icons = ["🌱", "🌿", "🍀", "🌳", "🌴"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-100">
      <header className="bg-white/70 backdrop-blur border-b border-emerald-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <span className="text-2xl">🌿</span>
          <h1 className="text-xl font-semibold text-emerald-900">
            {isLoading ? "Loading..." : error ? "Error" : workspaceName}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {Object.entries(receiptsByCategoryObject ?? {}).map(
          ([category, receipts], catIndex) => (
            <section key={category} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">
                  {icons[catIndex % icons.length]}
                </span>
                <h2 className="text-lg font-semibold text-emerald-800">
                  {category}
                </h2>
              </div>
              <div className="bg-white/80 backdrop-blur border border-emerald-100 rounded-2xl overflow-hidden">
                {receipts.map((receipt, index) => (
                  <div
                    key={receipt._id}
                    className={`flex items-center justify-between p-5 ${index !== receipts.length - 1 ? "border-b border-emerald-50" : ""} hover:bg-emerald-50/50 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm">
                        🧾
                      </span>
                      <span className="font-medium text-emerald-900">
                        {receipt.name}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg">
                        {receipt.price}
                      </span>
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-lg">
                        ALV {receipt.alv}
                      </span>
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
