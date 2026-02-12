import { Stack } from "expo-router";
import { useEffect } from "react";
import { AuthProvider } from "../components/AuthProvider";
import "@/services/axiosConfig";
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

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
