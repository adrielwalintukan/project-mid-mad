import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
