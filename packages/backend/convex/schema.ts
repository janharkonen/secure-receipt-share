import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  receipts: defineTable({
    alv: v.float64(),
    category: v.string(),
    file_id: v.string(),
    price: v.float64(),
    workspace_id: v.string(),
  }),
  workspaces: defineTable({
    access_rights: v.array(v.string()),
    workspace_name: v.string(),
  }).index("by_access_rights", ["access_rights"]),
});
