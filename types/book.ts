import { Id } from "../convex/_generated/dataModel";

export type Book = {
    _id: Id<"books">;
    title: string;
    author: string;
    faculty: string;
};