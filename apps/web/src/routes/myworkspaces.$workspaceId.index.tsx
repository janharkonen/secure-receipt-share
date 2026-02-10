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
        className="hover:text-primary hover:bg-primary/10 transition-colors"
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
      aria-label="PDF attachment"
      onClick={onClose}
    >
      <div
        className="flex h-[90vh] w-full max-w-4xl flex-col rounded-3xl border border-border/40 bg-card shadow-2xl shadow-primary/10 animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border/40 px-5 py-3.5">
          <span className="truncate text-sm font-bold text-foreground">
            📎 {title}
          </span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="min-h-0 flex-1 p-3">
          <iframe
            src={url}
            title={title}
            className="h-full w-full rounded-2xl border border-border/30 bg-muted/20"
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

  const categoryEmojis: Record<string, string> = {
    Food: "🍽️",
    Transport: "🚗",
    Office: "🖇️",
    Software: "💻",
    Travel: "✈️",
    Housing: "🏠",
    Health: "💊",
    Education: "📚",
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card/80 backdrop-blur-md border-b border-border/40 px-6 py-3.5 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <span className="text-lg font-bold text-foreground tracking-tight animate-slide-up">
            {isLoading ? (
              <span className="text-muted-foreground animate-pulse">
                Loading...
              </span>
            ) : error ? (
              <span className="text-destructive">Oops!</span>
            ) : (
              `📋 ${workspaceName}`
            )}
          </span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {Object.entries(receiptsByCategoryObject ?? {}).map(
          ([category, receipts], sectionIndex) => (
            <section
              key={category}
              className="mb-10 animate-slide-up"
              style={{ animationDelay: `${sectionIndex * 100}ms` }}
            >
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2.5">
                <span className="w-8 h-8 bg-gradient-to-br from-primary/15 to-accent/15 rounded-lg flex items-center justify-center text-sm shadow-sm">
                  {categoryEmojis[category] ?? "📂"}
                </span>
                {category}
                <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full ml-1">
                  {receipts.length}
                </span>
              </h2>
              <div className="bg-card rounded-2xl border border-border/40 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/30 border-b border-border/40">
                    <tr>
                      <th className="text-left px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Name
                      </th>
                      <th className="text-right px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Price
                      </th>
                      <th className="text-right px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        ALV
                      </th>
                      <th className="w-12 px-5 py-3.5 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        File
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {receipts.map((receipt) => (
                      <tr
                        key={receipt._id}
                        className="hover:bg-muted/20 transition-colors duration-150 group"
                      >
                        <td className="px-5 py-4 text-foreground font-medium group-hover:text-primary transition-colors">
                          {receipt.name}
                        </td>
                        <td className="px-5 py-4 text-right tabular-nums font-medium">
                          {receipt.price}
                        </td>
                        <td className="px-5 py-4 text-right tabular-nums text-muted-foreground">
                          {receipt.alv}
                        </td>
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
