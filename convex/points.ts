import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getPointsByUser = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        // Retrieve historical point logs using the by_userId index
        const points = await ctx.db
            .query("points")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .collect();
        return points;
    },
});

export const addPointLog = mutation({
    args: {
        userId: v.id("users"),
        amount: v.number(),
        activity: v.string(),
    },
    handler: async (ctx, args) => {
        // Insert into points history
        const logId = await ctx.db.insert("points", {
            userId: args.userId,
            amount: args.amount,
            activity: args.activity,
            createdAt: Date.now(),
        });

        // We also need to keep the total points up to date on the user schema 
        // to match the getPointsByUser logic requested before or just rely on addPoints inside users.ts 
        // This explicitly implements addPointLog independently based on prompt rules
        const user = await ctx.db.get(args.userId);
        if (user) {
            await ctx.db.patch(args.userId, {
                points: user.points + args.amount,
            });
        }

        return logId;
    },
});

export const getTotalPoints = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        // There are 2 ways depending on the architecture:
        // 1. Calculate sum from the 'points' table
        // 2. Fetch directly from user.points
        // According to Convex limits, relying on user.points is preferred. 
        // We will pull the user.points value directly for O(1) reads.
        const user = await ctx.db.get(args.userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user.points;
    },
});
