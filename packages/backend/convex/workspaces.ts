import { v } from "convex/values";
import { query } from "./_generated/server";
import { authComponent } from "./auth";

export const getWorkspaces = query({
  returns: v.union(
    v.array(
      v.object({
        _id: v.string(),
        workspace_name: v.string(),
      }),
    ),
    v.null(),
  ),
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      return null;
    }
    const email = authUser.email;
    const allWorkspaces = await ctx.db.query("workspaces").collect();
    const workspaces = allWorkspaces.filter((workspace) =>
      workspace.access_rights.includes(email),
    );
    return workspaces.map((workspace) => ({
      _id: workspace._id.toString(),
      workspace_name: workspace.workspace_name,
    }));
  },
});
