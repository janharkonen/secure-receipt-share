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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">SR</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">
            {isLoading ? "Loading..." : error ? "Error" : workspaceName}
          </span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {Object.entries(receiptsByCategoryObject ?? {}).map(
          ([category, receipts]) => (
            <section key={category} className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-700 rounded-full" />
                {category}
              </h2>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">
                        Name
                      </th>
                      <th className="text-right px-5 py-3 text-sm font-medium text-gray-500">
                        Price
                      </th>
                      <th className="text-right px-5 py-3 text-sm font-medium text-gray-500">
                        ALV
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {receipts.map((receipt) => (
                      <tr key={receipt._id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 text-gray-900">
                          {receipt.name}
                        </td>
                        <td className="px-5 py-4 text-right text-gray-600">
                          {receipt.price}
                        </td>
                        <td className="px-5 py-4 text-right text-gray-600">
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
