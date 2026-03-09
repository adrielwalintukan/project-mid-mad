import { Slot } from "expo-router";
import { AppConvexProvider } from "../lib/convexClient";

export default function RootLayout() {
  return (
    <AppConvexProvider>
      <Slot />
    </AppConvexProvider>
  );
}
