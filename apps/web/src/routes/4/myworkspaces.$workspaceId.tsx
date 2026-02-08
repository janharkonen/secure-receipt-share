import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/4/myworkspaces/$workspaceId")({
  component: WorkspacesPage,
});

function WorkspacesPage() {
  return <Outlet />;
}
