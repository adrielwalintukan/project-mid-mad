import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const borrowBook = mutation({
    args: {
        userId: v.id("users"),
        bookId: v.id("books"),
    },
    handler: async (ctx, args) => {
        // Basic rules applied (you may want to add validations whether the book is available)
        const borrowId = await ctx.db.insert("borrowLogs", {
            userId: args.userId,
            bookId: args.bookId,
            borrowDate: Date.now(),
            returnDate: 0, // 0 indicates it hasn't been returned yet
            status: "borrowed", // can be "borrowed", "returned", "overdue"
        });

        // Optionally update book isAvailable status
        await ctx.db.patch(args.bookId, {
            isAvailable: false,
        });

        return borrowId;
    },
});

export const returnBook = mutation({
    args: {
        borrowId: v.id("borrowLogs"),
    },
    handler: async (ctx, args) => {
        const borrowLog = await ctx.db.get(args.borrowId);

        if (!borrowLog) {
            throw new Error("Borrow log not found");
        }

        // Update log
        await ctx.db.patch(args.borrowId, {
            returnDate: Date.now(),
            status: "returned",
        });

        // Optionally update book isAvailable status
        await ctx.db.patch(borrowLog.bookId, {
            isAvailable: true,
        });
    },
});

export const getBorrowByUser = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const logs = await ctx.db
            .query("borrowLogs")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .collect();
        return logs;
    },
});

export const getBorrowByBook = query({
    args: {
        bookId: v.id("books"),
    },
    handler: async (ctx, args) => {
        const logs = await ctx.db
            .query("borrowLogs")
            .withIndex("by_bookId", (q) => q.eq("bookId", args.bookId))
            .collect();
        return logs;
    },
});

export const getActiveBorrows = query({
    handler: async (ctx) => {
        const logs = await ctx.db
            .query("borrowLogs")
            .filter((q) => q.eq(q.field("status"), "borrowed"))
            .collect();
        return logs;
    },
});
