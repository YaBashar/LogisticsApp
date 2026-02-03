import { Stack } from "expo-router";
import { useEffect } from "react";
import { AuthProvider } from "../components/AuthProvider";
import { usePushNotifs } from "@/hooks/usePushNotifs";
import * as SplashScreen from "expo-splash-screen";

// Prevent splash screen from auto-hiding

function AppContent() {
  usePushNotifs();
  return <Stack screenOptions={{ headerShown: false }} />;
}

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after a short delay
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 100);
  }, []);

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
