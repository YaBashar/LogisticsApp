import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { font } from "../styles/font";
import useAuth from "@/hooks/useAuth";
import { axiosPrivate } from "@/services/axios";

/**
 * Settings + Logout row for main app screens (next to each other, top-right).
 */
export function AuthenticatedScreenHeader({ title }) {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await axiosPrivate.post("/auth/logout");
    } catch {
      // Still sign out locally if the network call fails
    }
    await logout();
    router.replace("/auth/login");
  };

  const goSettings = () => router.push("/settings");

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 8 }]}>
      <View style={styles.leftSpacer} />
      {title ? (
        <Text style={[font, styles.title]} numberOfLines={1}>
          {title}
        </Text>
      ) : (
        <View style={styles.titleSpacer} />
      )}
      <View style={styles.actions}>
        <Pressable
          onPress={goSettings}
          accessibilityRole="button"
          accessibilityLabel="Settings"
          hitSlop={10}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
        >
          <Ionicons name="settings-outline" size={24} color="#004F3B" />
        </Pressable>
        <Pressable
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Log out"
          hitSlop={10}
          style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}
        >
          <Text style={[font, styles.logoutText]}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 6,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 79, 59, 0.12)",
    minHeight: 44,
  },
  leftSpacer: {
    width: 72,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#004F3B",
    textAlign: "center",
  },
  titleSpacer: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: 144,
    justifyContent: "flex-end",
  },
  iconBtn: {
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  logoutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#B42318",
  },
  pressed: {
    opacity: 0.72,
  },
});
