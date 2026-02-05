import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/myworkspaces/$workspaceId")({
  component: WorkspacesPage,
});

function WorkspacesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-white">Workspace</h1>
      </div>
    </div>
  );
}
