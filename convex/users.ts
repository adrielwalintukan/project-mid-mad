import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const registerUser = mutation({
    args: {
        name: v.string(),
        nim: v.optional(v.string()),
        faculty: v.optional(v.string()),
        email: v.string(),
        password: v.string(),
        role: v.optional(v.string()),
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

        // Validate student email domain
        const role = args.role ?? "student";
        if (role === "student" && !args.email.endsWith("@student.unklab.ac.id")) {
            throw new Error("Student email must end with @student.unklab.ac.id");
        }
        if (role === "admin" && !args.email.endsWith("@admin.unklab.ac.id")) {
            throw new Error("Admin email must end with @admin.unklab.ac.id");
        }

        // TODO: Hash the password before saving in production
        const userId = await ctx.db.insert("users", {
            name: args.name,
            nim: args.nim ?? "",
            faculty: args.faculty ?? "",
            email: args.email,
            password: args.password,
            points: 0,
            role: args.role ?? "student",
            createdAt: Date.now(),
        });

        const user = await ctx.db.get(userId);
        return user;
    },
});

export const loginUser = mutation({
    args: {
        email: v.string(),
        password: v.string(),
        role: v.string(),
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

        // Validate that the selected role matches the registered role
        if (user.role !== args.role) {
            throw new Error("Wrong role selected");
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
        const users = await ctx.db.query("users").collect();

        // Only show students on the leaderboard
        const students = users.filter((u) => u.role === "student");

        students.sort((a, b) => b.points - a.points);
        return students.slice(0, 10);
    },
});

export const getAllUsers = query({
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        return users;
    },
});
