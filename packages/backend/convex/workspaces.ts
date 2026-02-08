import { v } from "convex/values";
import { query } from "./_generated/server";
import { authComponent } from "./auth";

export const getMyWorkspaces = query({
  returns: v.array(
    v.object({
      _id: v.string(),
      workspace_name: v.string(),
    }),
  ),
  handler: async (ctx) => {
    // Authentication
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
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

export const getWorkspaceData = query({
  returns: v.object({
    workspaceName: v.string(),
  }),
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    // Authorization
    const workspace = await ctx.db.get(args.workspaceId);
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }
    const email = authUser.email;
    if (!workspace?.access_rights.includes(email)) {
      throw new Error("Not authorized");
    }
    // Actual function logic
    const workspaceName = workspace?.workspace_name ?? "";
    const receipts = await ctx.db
      .query("receipts")
      .get((q) => q.eq(q.field("workspace_id"), args.workspaceId))
      .collect();
    return {
      workspaceName,
    };
  },
});
