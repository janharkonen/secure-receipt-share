import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import type { Id } from "@secure-receipt-share/backend/convex/_generated/dataModel";
import { createFileRoute, useParams } from "@tanstack/react-router";

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

  const categoryColors = [
    "from-rose-400 to-orange-400",
    "from-fuchsia-400 to-pink-400",
    "from-indigo-400 to-purple-400",
    "from-cyan-400 to-blue-400",
    "from-emerald-400 to-teal-400",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
            {isLoading ? "Loading..." : error ? "Error" : `📋 ${workspaceName}`}
          </h1>
        </header>

        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8">
          {Object.entries(receiptsByCategoryObject ?? {}).map(
            ([category, receipts], catIndex) => (
              <section key={category} className="mb-8 last:mb-0">
                <div
                  className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${categoryColors[catIndex % categoryColors.length]} text-white font-bold mb-4 shadow-md`}
                >
                  {category}
                </div>
                <div className="grid gap-3">
                  {receipts.map((receipt) => (
                    <div
                      key={receipt._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-semibold text-gray-800">
                        {receipt.name}
                      </span>
                      <div className="flex gap-4">
                        <span className="px-3 py-1 bg-gradient-to-r from-rose-400 to-orange-400 text-white rounded-full text-sm font-medium">
                          {receipt.price}
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-full text-sm font-medium">
                          ALV {receipt.alv}
                        </span>
                      </div>
                    </div>
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
