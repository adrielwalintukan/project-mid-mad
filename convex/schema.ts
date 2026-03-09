import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        nim: v.string(),
        faculty: v.string(),
        email: v.string(),
        password: v.string(),
        points: v.number(),
        role: v.string(),
        createdAt: v.number(),
    }).index("by_email", ["email"]),

    books: defineTable({
        title: v.string(),
        author: v.string(),
        faculty: v.string(),
        category: v.string(),
        description: v.string(),
        coverUrl: v.string(),
        isAvailable: v.boolean(),
        createdAt: v.number(),
    }).index("by_faculty", ["faculty"]),

    reviews: defineTable({
        userId: v.id("users"),
        bookId: v.id("books"),
        rating: v.number(),
        comment: v.string(),
        createdAt: v.number(),
    })
        .index("by_userId", ["userId"])
        .index("by_bookId", ["bookId"]),

    points: defineTable({
        userId: v.id("users"),
        amount: v.number(),
        activity: v.string(),
        createdAt: v.number(),
    }).index("by_userId", ["userId"]),

    events: defineTable({
        title: v.string(),
        description: v.string(),
        date: v.number(),
        createdAt: v.number(),
    }),

    notifications: defineTable({
        userId: v.id("users"),
        message: v.string(),
        isRead: v.boolean(),
        createdAt: v.number(),
    }).index("by_userId", ["userId"]),

    borrowLogs: defineTable({
        userId: v.id("users"),
        bookId: v.id("books"),
        borrowDate: v.number(),
        returnDate: v.number(),
        status: v.string(),
    })
        .index("by_userId", ["userId"])
        .index("by_bookId", ["bookId"]),

    visits: defineTable({
        userId: v.id("users"),
        date: v.number(),
    }).index("by_userId", ["userId"]),

    visitCodes: defineTable({
        code: v.string(),
        createdAt: v.number(),
    }).index("by_code", ["code"]),
});
