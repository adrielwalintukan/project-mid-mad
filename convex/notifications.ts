import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getNotificationsByUser = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const notifications = await ctx.db
            .query("notifications")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .collect();

        // Optional: Sort by newest first
        notifications.sort((a, b) => b.createdAt - a.createdAt);
        return notifications;
    },
});

export const addNotification = mutation({
    args: {
        userId: v.id("users"),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        const notificationId = await ctx.db.insert("notifications", {
            userId: args.userId,
            message: args.message,
            isRead: false,
            createdAt: Date.now(),
        });
        return notificationId;
    },
});

export const markAsRead = mutation({
    args: {
        notificationId: v.id("notifications"),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.notificationId, {
            isRead: true,
        });
    },
});

export const deleteNotification = mutation({
    args: {
        notificationId: v.id("notifications"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.notificationId);
    },
});
