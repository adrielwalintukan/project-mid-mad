import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addReview = mutation({
    args: {
        userId: v.id("users"),
        bookId: v.id("books"),
        rating: v.number(),
        comment: v.string(),
    },
    handler: async (ctx, args) => {
        const reviewId = await ctx.db.insert("reviews", {
            ...args,
            createdAt: Date.now(),
        });
        return reviewId;
    },
});

export const getReviewsByBook = query({
    args: {
        bookId: v.id("books"),
    },
    handler: async (ctx, args) => {
        const reviews = await ctx.db
            .query("reviews")
            .withIndex("by_bookId", (q) => q.eq("bookId", args.bookId))
            .collect();
        return reviews;
    },
});

export const getReviewsByUser = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const reviews = await ctx.db
            .query("reviews")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .collect();
        return reviews;
    },
});

export const deleteReview = mutation({
    args: {
        reviewId: v.id("reviews"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.reviewId);
    },
});
