import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/5/myworkspaces/$workspaceId")({
  component: WorkspacesPage,
});

function WorkspacesPage() {
  return <Outlet />;
}
