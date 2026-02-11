import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { Id } from "./_generated/dataModel";

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
    workspace_name: v.string(),
    receipts: v.array(
      v.object({
        _id: v.id("receipts"),
        category: v.string(),
        name: v.string(),
        price: v.int64(),
        alv: v.float64(),
        file_id: v.optional(v.string()),
      }),
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

    const receiptsData = receipts.map((receipt) => ({
      _id: receipt._id,
      category: receipt.category,
      name: receipt.name,
      price: receipt.price,
      alv: receipt.alv,
      file_id: receipt.file_id,
    }));
    return {
      workspace_name: workspaceName,
      receipts: receiptsData,
    };
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) throw new Error("Not authenticated");
    return await ctx.storage.generateUploadUrl();
  },
});

export const getStorageUrl = query({
  args: { storageId: v.id("_storage") },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const createReceipt = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    category: v.string(),
    name: v.string(),
    price: v.int64(),
    alv: v.float64(),
    file_id: v.optional(v.id("_storage")),
  },
  returns: v.id("receipts"),
  handler: async (ctx, args) => {
    const workspace = await ctx.db.get(args.workspaceId);
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) throw new Error("Not authenticated");
    if (!workspace?.access_rights.includes(authUser.email)) {
      throw new Error("Not authorized");
    }
    return await ctx.db.insert("receipts", {
      workspace_id: args.workspaceId,
      category: args.category,
      name: args.name,
      price: args.price,
      alv: args.alv,
      file_id: args.file_id,
    });
  },
});

export const updateReceipt = mutation({
  args: {
    receiptId: v.id("receipts"),
    category: v.optional(v.string()),
    name: v.optional(v.string()),
    price: v.optional(v.int64()),
    alv: v.optional(v.float64()),
    file_id: v.optional(v.id("_storage")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const receipt = await ctx.db.get(args.receiptId);
    if (!receipt) throw new Error("Receipt not found");
    const workspace = await ctx.db.get(receipt.workspace_id);
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) throw new Error("Not authenticated");
    if (!workspace?.access_rights.includes(authUser.email)) {
      throw new Error("Not authorized");
    }
    const updates: {
      category?: string;
      name?: string;
      price?: bigint;
      alv?: number;
      file_id?: Id<"_storage">;
    } = {};
    if (args.category !== undefined) updates.category = args.category;
    if (args.name !== undefined) updates.name = args.name;
    if (args.price !== undefined) updates.price = args.price;
    if (args.alv !== undefined) updates.alv = args.alv;
    if (args.file_id !== undefined) updates.file_id = args.file_id;
    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(args.receiptId, updates);
    }
    return null;
  },
});
