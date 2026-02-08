import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/myworkspaces/$workspaceId")({
  component: WorkspacesPage,
});

function WorkspacesPage() {
  return <Outlet />;
}
