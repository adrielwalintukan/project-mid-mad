import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getBooks = query({
    handler: async (ctx) => {
        return await ctx.db.query("books").collect();
    },
});

export const getBookById = query({
    args: {
        bookId: v.id("books"),
    },
    handler: async (ctx, args) => {
        const book = await ctx.db.get(args.bookId);
        if (!book) {
            throw new Error("Book not found");
        }
        return book;
    },
});

export const getBooksByFaculty = query({
    args: {
        faculty: v.string(),
    },
    handler: async (ctx, args) => {
        const books = await ctx.db
            .query("books")
            .withIndex("by_faculty", (q) => q.eq("faculty", args.faculty))
            .collect();
        return books;
    },
});

export const searchBooks = query({
    args: {
        searchTerm: v.string(),
    },
    handler: async (ctx, args) => {
        const books = await ctx.db.query("books").collect();
        if (!args.searchTerm) return books;

        const searchTermLower = args.searchTerm.toLowerCase();
        return books.filter((book) =>
            book.title.toLowerCase().includes(searchTermLower)
        );
    },
});

export const getAvailableBooks = query({
    handler: async (ctx) => {
        const books = await ctx.db
            .query("books")
            .filter((q) => q.eq(q.field("isAvailable"), true))
            .collect();
        return books;
    },
});

export const addBook = mutation({
    args: {
        title: v.string(),
        author: v.string(),
        faculty: v.string(),
        category: v.string(),
        description: v.string(),
        coverUrl: v.string(),
        isAvailable: v.boolean(),
    },
    handler: async (ctx, args) => {
        const bookId = await ctx.db.insert("books", {
            ...args,
            createdAt: Date.now(),
        });
        return bookId;
    },
});

export const deleteBook = mutation({
    args: {
        bookId: v.id("books"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.bookId);
    },
});
