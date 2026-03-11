import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getEvents = query({
    handler: async (ctx) => {
        return await ctx.db.query("events").collect();
    },
});

export const getEventById = query({
    args: {
        eventId: v.id("events"),
    },
    handler: async (ctx, args) => {
        const event = await ctx.db.get(args.eventId);
        if (!event) {
            throw new Error("Event not found");
        }
        return event;
    },
});

export const getUpcomingEvents = query({
    handler: async (ctx) => {
        const now = Date.now();
        const events = await ctx.db
            .query("events")
            .filter((q) => q.gt(q.field("date"), now))
            .collect();

        // Sort upcoming events by closest date first
        events.sort((a, b) => a.date - b.date);
        return events;
    },
});

export const addEvent = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        date: v.number(),
    },
    handler: async (ctx, args) => {
        const eventId = await ctx.db.insert("events", {
            title: args.title,
            description: args.description,
            date: args.date,
            createdAt: Date.now(),
        });
        return eventId;
    },
});

export const deleteEvent = mutation({
    args: {
        eventId: v.id("events"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.eventId);
    },
});

export const joinEvent = mutation({
    args: {
        userId: v.id("users"),
        eventId: v.id("events"),
    },
    handler: async (ctx, args) => {
        // Check if user already joined
        const existing = await ctx.db
            .query("eventParticipants")
            .withIndex("by_userId_eventId", (q) =>
                q.eq("userId", args.userId).eq("eventId", args.eventId)
            )
            .first();

        if (existing) {
            throw new Error("You have already joined this event.");
        }

        // Insert participation record
        await ctx.db.insert("eventParticipants", {
            userId: args.userId,
            eventId: args.eventId,
            joinedAt: Date.now(),
        });

        // Award +10 points
        const user = await ctx.db.get(args.userId);
        if (user) {
            await ctx.db.patch(args.userId, {
                points: user.points + 10,
            });
        }

        // Insert into points table
        await ctx.db.insert("points", {
            userId: args.userId,
            amount: 10,
            activity: "join_event",
            createdAt: Date.now(),
        });
    },
});

export const hasJoinedEvent = query({
    args: {
        userId: v.id("users"),
        eventId: v.id("events"),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("eventParticipants")
            .withIndex("by_userId_eventId", (q) =>
                q.eq("userId", args.userId).eq("eventId", args.eventId)
            )
            .first();
        return !!existing;
    },
});

export const getParticipantsByEvent = query({
    args: {
        eventId: v.id("events"),
    },
    handler: async (ctx, args) => {
        const participants = await ctx.db
            .query("eventParticipants")
            .withIndex("by_eventId", (q) => q.eq("eventId", args.eventId))
            .collect();

        const result = [];
        for (const p of participants) {
            const user = await ctx.db.get(p.userId);
            result.push({
                _id: p._id,
                joinedAt: p.joinedAt,
                userName: user?.name ?? "Unknown",
                userEmail: user?.email ?? "Unknown",
            });
        }
        return result;
    },
});
