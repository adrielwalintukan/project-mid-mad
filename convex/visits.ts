import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addVisit = mutation({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const visitId = await ctx.db.insert("visits", {
            userId: args.userId,
            date: Date.now(),
        });
        return visitId;
    },
});

export const getVisitsByUser = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const visits = await ctx.db
            .query("visits")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .collect();
        return visits;
    },
});

export const getTodayVisit = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const now = new Date();
        // Get start of today (midnight)
        const startOfToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        ).getTime();

        const visits = await ctx.db
            .query("visits")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .filter((q) => q.gte(q.field("date"), startOfToday))
            .collect();

        // Return the visit if it exists today
        return visits.length > 0 ? visits[0] : null;
    },
});

export const getVisitCount = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        // For small/medium scales, retrieving and counting length is okay. 
        const visits = await ctx.db
            .query("visits")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .collect();
        return visits.length;
    },
});
