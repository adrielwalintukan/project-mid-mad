import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const registerUser = mutation({
    args: {
        name: v.string(),
        nim: v.string(),
        faculty: v.string(),
        email: v.string(),
        password: v.string(),
    },
    handler: async (ctx, args) => {
        // Basic check to see if email already exists
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (existingUser) {
            throw new Error("Email already registered");
        }

        // TODO: Hash the password before saving in production
        // e.g., using bcrypt or a similar library to encrypt args.password
        const userId = await ctx.db.insert("users", {
            name: args.name,
            nim: args.nim,
            faculty: args.faculty,
            email: args.email,
            password: args.password,
            points: 0,
            role: "student",
            createdAt: Date.now(),
        });

        const user = await ctx.db.get(userId);
        return user;
    },
});

export const loginUser = query({
    args: {
        email: v.string(),
        password: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (!user) {
            throw new Error("User not found");
        }

        // TODO: Compare hashed passwords in production instead of plain text
        if (user.password !== args.password) {
            throw new Error("Incorrect password");
        }

        return user;
    },
});

export const getUserById = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    },
});

export const addPoints = mutation({
    args: {
        userId: v.id("users"),
        amount: v.number(),
        activity: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Add record to points history
        await ctx.db.insert("points", {
            userId: args.userId,
            amount: args.amount,
            activity: args.activity,
            createdAt: Date.now(),
        });

        // Update user's total points
        const newPointsTotal = user.points + args.amount;
        await ctx.db.patch(args.userId, {
            points: newPointsTotal,
        });

        return newPointsTotal;
    },
});

export const getLeaderboard = query({
    handler: async (ctx) => {
        // Fetch top 10 users sorted by points (descending)
        // Convex queries are limited, so we fetch and sort them locally.
        // In larger-scale apps, you'd use a dedicated points sum index or materialized views.
        const users = await ctx.db.query("users").collect();

        users.sort((a, b) => b.points - a.points);
        return users.slice(0, 10);
    },
});
