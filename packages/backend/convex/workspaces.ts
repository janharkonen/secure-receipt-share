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

type ReceiptsCategory = {
  _id: string;
  name: string;
  price: number;
  alv: number;
};

type ReceiptsByCategoryObject = Record<string, ReceiptsCategory[]>;

export const getWorkspaceData = query({
  returns: v.object({
    workspaceName: v.string(),
    receiptsByCategoryObject: v.record(
      v.string(),
      v.array(
        v.object({
          _id: v.string(),
          name: v.string(),
          price: v.number(),
          alv: v.number(),
        }),
      ),
    ),
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
    // Fetch data
    const workspaceName = workspace?.workspace_name ?? "";
    const receipts = await ctx.db
      .query("receipts")
      .filter((q) => q.eq(q.field("workspace_id"), args.workspaceId))
      .collect();

    // Process data
    const receiptsByCategoryObject: ReceiptsByCategoryObject = {};
    receipts.forEach((receipt) => {
      if (!receiptsByCategoryObject[receipt.category]) {
        receiptsByCategoryObject[receipt.category] = [];
      }
      receiptsByCategoryObject[receipt.category].push({
        _id: receipt._id.toString(),
        name: receipt.name,
        price: receipt.price,
        alv: receipt.alv,
      });
    });
    return {
      workspaceName,
      receiptsByCategoryObject,
    };
  },
});
