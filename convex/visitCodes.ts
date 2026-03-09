import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Admin sets a new visit code (replaces old style by just inserting new one)
export const setVisitCode = mutation({
    args: {
        code: v.string(),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("visitCodes", {
            code: args.code,
            createdAt: Date.now(),
        });
        return id;
    },
});

// Returns the most recently created visit code
export const getVisitCode = query({
    args: {},
    handler: async (ctx) => {
        const latest = await ctx.db
            .query("visitCodes")
            .order("desc")
            .first();
        return latest;
    },
});
