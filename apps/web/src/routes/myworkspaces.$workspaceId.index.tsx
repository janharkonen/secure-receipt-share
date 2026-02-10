import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useQuery as useConvexQuery } from "convex/react";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
  Layers,
  Loader2,
  Receipt,
  TrendingUp,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { api } from "@secure-receipt-share/backend/convex/_generated/api";
import type { Id } from "@secure-receipt-share/backend/convex/_generated/dataModel";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

/* ------------------------------------------------------------------ */
/*  Attachment button                                                  */
/* ------------------------------------------------------------------ */

function ReceiptAttachmentButton({ receipt }: { receipt: ReceiptRow }) {
  const [showPdf, setShowPdf] = useState(false);
  const storageUrl = useConvexQuery(
    api.workspaces.getStorageUrl,
    receipt.file_id ? { storageId: receipt.file_id as Id<"_storage"> } : "skip",
  );

  if (!receipt.file_id) {
    return <span className="text-muted-foreground/40">—</span>;
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
        className="hover:text-primary hover:bg-primary/10 transition-all hover:scale-110"
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

/* ------------------------------------------------------------------ */
/*  PDF modal                                                          */
/* ------------------------------------------------------------------ */

function PdfViewerModal({
  url,
  title,
  onClose,
}: {
  url: string;
  title: string;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    // Prevent background scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prev;
    };
  }, [handleKeyDown]);

  const isPdf = url.toLowerCase().endsWith(".pdf") || url.includes("pdf");
  // Google Docs viewer fallback for better cross-browser PDF rendering
  const viewerUrl = isPdf
    ? `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
    : url;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Viewing: ${title}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-lg animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        className="relative flex h-[92vh] w-[95vw] max-w-5xl flex-col rounded-3xl border border-border/30 bg-card shadow-2xl shadow-primary/10 animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Toolbar ─────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 border-b border-border/30 px-5 py-3">
          {/* Left: file info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground leading-tight">
                {title}
              </p>
              <p className="text-[11px] text-muted-foreground">PDF document</p>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => window.open(url, "_blank", "noopener")}
              aria-label="Open in new tab"
            >
              <ExternalLink className="size-3.5" />
              <span className="hidden sm:inline">Open</span>
            </Button>
            <a
              href={url}
              download
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label="Download file"
            >
              <Download className="size-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>
            <div className="w-px h-5 bg-border/50 mx-1 hidden sm:block" />
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground hover:bg-destructive/10 rounded-lg"
              aria-label="Close"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* ── Content area ────────────────────────── */}
        <div className="relative min-h-0 flex-1 bg-muted/10 m-2 rounded-2xl overflow-hidden">
          {/* Loading overlay */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-card/80 backdrop-blur-sm">
              <Loader2 className="size-8 text-primary animate-spin" />
              <p className="text-sm font-medium text-muted-foreground">
                Loading document…
              </p>
            </div>
          )}

          {/* Error state */}
          {hasError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-card">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <FileText className="size-8" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-foreground">
                  Unable to preview
                </p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  The document couldn't be loaded in the viewer.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setHasError(false);
                    setIsLoading(true);
                  }}
                >
                  Try again
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs gap-1.5"
                  onClick={() => window.open(url, "_blank", "noopener")}
                >
                  <ExternalLink className="size-3.5" />
                  Open in browser
                </Button>
              </div>
            </div>
          )}

          <iframe
            src={viewerUrl}
            title={title}
            className="h-full w-full rounded-2xl border-0"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        </div>

        {/* ── Bottom hint ─────────────────────────── */}
        <div className="flex items-center justify-center px-5 py-2 border-t border-border/20">
          <p className="text-[11px] text-muted-foreground/70">
            Press{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-muted/60 text-[10px] font-mono font-medium text-muted-foreground mx-0.5">
              Esc
            </kbd>{" "}
            to close
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ------------------------------------------------------------------ */
/*  Stat card                                                          */
/* ------------------------------------------------------------------ */

function StatCard({
  icon,
  label,
  value,
  accent = false,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
  delay?: number;
}) {
  return (
    <div
      className="animate-pop-in flex items-center gap-4 rounded-2xl border border-border/40 bg-card px-5 py-4 shadow-sm hover:shadow-md transition-all duration-300 group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-110 ${
          accent
            ? "bg-gradient-to-br from-accent/30 to-accent/10 text-accent-foreground"
            : "bg-gradient-to-br from-primary/20 to-primary/5 text-primary"
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className="text-lg font-bold text-foreground tracking-tight truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton loading state                                             */
/* ------------------------------------------------------------------ */

function WorkspaceLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/40 bg-card/80 backdrop-blur-md px-6 py-5 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-8 w-64" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Category colour palette                                           */
/* ------------------------------------------------------------------ */

const categoryMeta: Record<
  string,
  { emoji: string; gradient: string; ring: string }
> = {
  Food: {
    emoji: "🍽️",
    gradient: "from-amber-400/20 to-orange-300/10",
    ring: "ring-amber-400/20",
  },
  Transport: {
    emoji: "🚗",
    gradient: "from-sky-400/20 to-sky-300/10",
    ring: "ring-sky-400/20",
  },
  Office: {
    emoji: "🖇️",
    gradient: "from-slate-400/20 to-slate-300/10",
    ring: "ring-slate-400/20",
  },
  Software: {
    emoji: "💻",
    gradient: "from-violet-400/20 to-violet-300/10",
    ring: "ring-violet-400/20",
  },
  Travel: {
    emoji: "✈️",
    gradient: "from-teal-400/20 to-teal-300/10",
    ring: "ring-teal-400/20",
  },
  Housing: {
    emoji: "🏠",
    gradient: "from-rose-400/20 to-rose-300/10",
    ring: "ring-rose-400/20",
  },
  Health: {
    emoji: "💊",
    gradient: "from-red-400/20 to-red-300/10",
    ring: "ring-red-400/20",
  },
  Education: {
    emoji: "📚",
    gradient: "from-indigo-400/20 to-indigo-300/10",
    ring: "ring-indigo-400/20",
  },
};

const defaultMeta = {
  emoji: "📂",
  gradient: "from-primary/15 to-accent/10",
  ring: "ring-primary/15",
};

/* ------------------------------------------------------------------ */
/*  Currency formatter                                                 */
/* ------------------------------------------------------------------ */

const eur = new Intl.NumberFormat("fi-FI", {
  style: "currency",
  currency: "EUR",
});

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

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

  /* Derived stats */
  const stats = useMemo(() => {
    const entries = Object.entries(receiptsByCategoryObject ?? {});
    const allReceipts = entries.flatMap(([, r]) => r);
    return {
      totalReceipts: allReceipts.length,
      totalSpend: allReceipts.reduce((s, r) => s + r.price, 0),
      categories: entries.length,
    };
  }, [receiptsByCategoryObject]);

  if (isLoading) return <WorkspaceLoadingSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-pop-in space-y-3">
          <span className="text-5xl">😵</span>
          <p className="text-lg font-bold text-destructive">
            Something went wrong
          </p>
          <p className="text-sm text-muted-foreground">
            We couldn't load this workspace. Try refreshing.
          </p>
        </div>
      </div>
    );
  }

  const entries = Object.entries(receiptsByCategoryObject ?? {});

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ───────────────────────────────────── */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border/40 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            to="/myworkspaces"
            className="flex items-center justify-center size-9 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Back to workspaces"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="min-w-0 animate-slide-up">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Workspace
            </p>
            <h1 className="text-xl font-bold text-foreground tracking-tight truncate">
              {workspaceName}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        {/* ── Stats ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<Receipt className="size-5" />}
            label="Receipts"
            value={String(stats.totalReceipts)}
            delay={0}
          />
          <StatCard
            icon={<TrendingUp className="size-5" />}
            label="Total Spend"
            value={eur.format(stats.totalSpend)}
            accent
            delay={80}
          />
          <StatCard
            icon={<Layers className="size-5" />}
            label="Categories"
            value={String(stats.categories)}
            delay={160}
          />
        </div>

        {/* ── Empty state ────────────────────────────── */}
        {entries.length === 0 && (
          <div className="text-center py-20 animate-pop-in space-y-3">
            <span className="text-5xl animate-gentle-bounce inline-block">
              🧾
            </span>
            <p className="text-lg font-bold text-foreground">No receipts yet</p>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Receipts added to this workspace will appear here organised by
              category.
            </p>
          </div>
        )}

        {/* ── Category sections ──────────────────────── */}
        {entries.map(([category, receipts], sectionIndex) => {
          const meta = categoryMeta[category] ?? defaultMeta;
          const categoryTotal = receipts.reduce((s, r) => s + r.price, 0);

          return (
            <section
              key={category}
              className="animate-slide-up"
              style={{ animationDelay: `${sectionIndex * 80 + 200}ms` }}
            >
              {/* Category header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2.5">
                  <span
                    className={`flex size-9 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-base shadow-sm ring-1 ${meta.ring}`}
                  >
                    {meta.emoji}
                  </span>
                  {category}
                  <span className="ml-1 inline-flex items-center rounded-full bg-muted/60 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground ring-1 ring-border/30">
                    {receipts.length}
                  </span>
                </h2>
                <span className="text-sm font-semibold text-muted-foreground tabular-nums">
                  {eur.format(categoryTotal)}
                </span>
              </div>

              {/* Table card */}
              <div className="overflow-hidden rounded-2xl border border-border/40 bg-card shadow-md hover:shadow-lg transition-shadow duration-300">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 bg-muted/25">
                      <th className="text-left px-5 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        Name
                      </th>
                      <th className="text-right px-5 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        Price
                      </th>
                      <th className="text-right px-5 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        ALV&nbsp;%
                      </th>
                      <th className="w-14 px-5 py-3 text-center text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        File
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {receipts.map((receipt, i) => (
                      <tr
                        key={receipt._id}
                        className={`group transition-colors duration-150 hover:bg-primary/[0.04] ${
                          i % 2 === 1 ? "bg-muted/10" : ""
                        }`}
                      >
                        <td className="px-5 py-3.5 font-medium text-foreground group-hover:text-primary transition-colors">
                          {receipt.name}
                        </td>
                        <td className="px-5 py-3.5 text-right tabular-nums font-semibold text-foreground">
                          {eur.format(receipt.price)}
                        </td>
                        <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">
                          {receipt.alv}&nbsp;%
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <ReceiptAttachmentButton receipt={receipt} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Category subtotal row */}
                  <tfoot>
                    <tr className="border-t border-border/40 bg-muted/20">
                      <td className="px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Subtotal
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-sm font-bold text-foreground">
                        {eur.format(categoryTotal)}
                      </td>
                      <td />
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
