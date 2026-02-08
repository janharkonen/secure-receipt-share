import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useQuery as useConvexQuery } from "convex/react";
import { FileText } from "lucide-react";
import { useState } from "react";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import type { Id } from "@secure-receipt-share/backend/convex/_generated/dataModel";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/myworkspaces/$workspaceId/")({
  component: WorkspacesPage,
});

type ReceiptRow = {
  _id: string;
  name: string;
  price: number;
  alv: number;
  file_id?: string;
};

function ReceiptAttachmentButton({ receipt }: { receipt: ReceiptRow }) {
  const [showPdf, setShowPdf] = useState(false);
  const storageUrl = useConvexQuery(
    api.workspaces.getStorageUrl,
    receipt.file_id ? { storageId: receipt.file_id as Id<"_storage"> } : "skip",
  );

  if (!receipt.file_id) {
    return <span className="text-muted-foreground/50">—</span>;
  }

  const url = storageUrl ?? null;

  return (
    <>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="View attachment"
        onClick={() => setShowPdf(true)}
        disabled={storageUrl === undefined || storageUrl === null}
      >
        <FileText className="size-4" />
      </Button>
      {showPdf && url && (
        <PdfViewerModal
          url={url}
          title={receipt.name}
          onClose={() => setShowPdf(false)}
        />
      )}
    </>
  );
}

function PdfViewerModal({
  url,
  title,
  onClose,
}: {
  url: string;
  title: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="PDF attachment"
      onClick={onClose}
    >
      <div
        className="flex h-[90vh] w-full max-w-4xl flex-col rounded-lg border border-border bg-card shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="truncate text-sm font-medium text-foreground">
            {title}
          </span>
          <Button variant="ghost" size="xs" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="min-h-0 flex-1 p-2">
          <iframe
            src={url}
            title={title}
            className="h-full w-full rounded border border-border bg-muted"
          />
        </div>
      </div>
    </div>
  );
}

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
                      <th className="w-12 px-5 py-3 text-right text-sm font-medium text-muted-foreground">
                        Attachment
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {receipts.map((receipt) => (
                      <tr key={receipt._id} className="hover:bg-muted/30">
                        <td className="px-5 py-4 text-foreground">
                          {receipt.name}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {receipt.price}
                        </td>
                        <td className="px-5 py-4 text-right">{receipt.alv}</td>
                        <td className="px-5 py-4 text-right">
                          <ReceiptAttachmentButton receipt={receipt} />
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
