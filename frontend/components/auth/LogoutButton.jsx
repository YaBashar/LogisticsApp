import { Pressable, Alert, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useAuth from "../../hooks/useAuth";
import { axiosPrivate } from "../../services/axios";
import { touch } from "../../constants/theme";

export function LogoutButton({ style }) {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Log out", "You will need to sign in again to continue.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            await axiosPrivate.post("/auth/logout");
          } catch {
            // Best-effort logout — proceed regardless
          } finally {
            await logout();
            router.replace("/auth/login");
          }
        },
      },
    ]);
  };

  return (
    <Pressable
      onPress={handleLogout}
      accessibilityRole="button"
      accessibilityLabel="Log out"
      style={({ pressed }) => [styles.btn, style, pressed && styles.pressed]}
    >
      <Ionicons name="log-out-outline" size={22} color="white" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: touch.minHeight,
    minWidth: touch.minHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});
