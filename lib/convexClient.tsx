import React, { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

// Get the Convex backend URL from Expo environment variables
const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
    throw new Error(
        "Missing EXPO_PUBLIC_CONVEX_URL environment variable. Please check your .env or .env.local file."
    );
}

// Create a singleton instance of the Convex client
export const convexClient = new ConvexReactClient(CONVEX_URL as string, {
    unsavedChangesWarning: false,
});

export function AppConvexProvider({ children }: { children: ReactNode }) {
    return (
        <ConvexProvider client={convexClient} >
            {children}
        </ConvexProvider>
    );
}
