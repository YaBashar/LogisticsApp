import { View, Text, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import LogoutButton from "./auth/LogoutButton";
import { colors, spacing, typography, radii } from "../constants/theme";

export default function ScreenHeader({ title, left }) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const contentMaxWidth = Math.min(420, screenWidth - 32);

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={[styles.headerInner, { maxWidth: contentMaxWidth }]}>
        {left ?? (
          <>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              style={({ pressed }) => [styles.headerBtn, pressed && styles.headerBtnPressed]}
            >
              <Ionicons name="arrow-back-outline" size={22} color={colors.textOnDark} />
            </Pressable>
            <Text style={styles.headerTitle} numberOfLines={1} accessibilityRole="header">
              {title}
            </Text>
          </>
        )}
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => router.push("/settings")}
            accessibilityRole="button"
            accessibilityLabel="Settings"
            style={({ pressed }) => [styles.headerBtn, pressed && styles.headerBtnPressed]}
          >
            <Ionicons name="settings-outline" size={18} color={colors.textOnDark} />
          </Pressable>
          <LogoutButton style={styles.headerBtn} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: colors.primaryDark,
    borderBottomLeftRadius: radii.card,
    borderBottomRightRadius: radii.card,
    paddingHorizontal: spacing.base,
    paddingBottom: 10,
    alignItems: "center",
  },
  headerInner: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    gap: spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.textOnDark,
  },
  headerActions: {
    flexDirection: "row",
    gap: spacing.sm,
    flexShrink: 0,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerBtnPressed: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
});
