import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  receipts: defineTable({
    workspace_id: v.id("workspaces"),
    category: v.string(),
    name: v.string(),
    price: v.float64(),
    alv: v.float64(),
    file_id: v.optional(v.id("_storage")),
  }),
  workspaces: defineTable({
    access_rights: v.array(v.string()),
    workspace_name: v.string(),
  }),
});
