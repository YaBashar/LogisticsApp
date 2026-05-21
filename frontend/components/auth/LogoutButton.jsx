import { Pressable, Text, StyleSheet, Alert, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useAuth from "@/hooks/useAuth";
import { axiosPrivate } from "@/services/axios";
import { colors, spacing, typography, radii, touch, shadows } from "@/constants/theme";

export default function LogoutButton({ showSettings = true }) {
  const { logout, role } = useAuth();

  const handleLogout = () => {
    Alert.alert("Log out", "You will need to sign in again to continue.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            await axiosPrivate.post("/auth/logout");
          } catch (error) {
            // Best-effort logout — proceed regardless
          } finally {
            await logout();
            router.replace("/auth/login");
          }
        },
      },
    ]);
  };

  const goSettings = () => router.push("/settings");

  return (
    <View style={styles.container}>
      {role ? (
        <View style={styles.rolePill} accessibilityLabel={`Role: ${role}`}>
          <Text style={styles.roleText}>{role}</Text>
        </View>
      ) : null}

      <Pressable
        onPress={handleLogout}
        accessibilityRole="button"
        accessibilityLabel="Log out"
        style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
      >
        <Text style={styles.logoutLabel}>Log out</Text>
      </Pressable>

      {showSettings ? (
        <Pressable
          onPress={goSettings}
          accessibilityRole="button"
          accessibilityLabel="Settings"
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <Ionicons name="settings-outline" size={20} color={colors.secondary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    ...shadows.subtle,
  },
  pressed: {
    opacity: 0.75,
  },
  rolePill: {
    backgroundColor: colors.secondarySurface,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  roleText: {
    fontSize: typography.size.sm,
    color: colors.secondaryDark,
    fontWeight: typography.weight.bold,
    textTransform: "capitalize",
  },
  actionButton: {
    minHeight: touch.minHeight,
    minWidth: touch.minHeight,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xs,
  },
  logoutLabel: {
    fontSize: typography.size.base,
    color: colors.error,
    fontWeight: typography.weight.bold,
  },
  iconButton: {
    minHeight: touch.minHeight,
    minWidth: touch.minHeight,
    justifyContent: "center",
    alignItems: "center",
  },
});
