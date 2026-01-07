import { Stack } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after a short delay
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 100);
  }, []);

  console.log("=== LAYOUT RENDERING ===");

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}