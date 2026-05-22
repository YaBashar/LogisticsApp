import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useAuth from "@/hooks/useAuth";
import ScreenHeader from "../components/ScreenHeader";
import { colors, spacing, typography, radii, touch, shadows } from "../constants/theme";

export default function Profile() {
  const { role } = useAuth();

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <ScreenHeader title="Profile" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={48} color={colors.primaryMid} />
          </View>
          {role ? (
            <View style={styles.rolePill}>
              <Text style={styles.roleText}>{role}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={() => router.push("/settings")}
            accessibilityRole="button"
            accessibilityLabel="Settings"
          >
            <View style={styles.rowLeft}>
              <Ionicons name="settings-outline" size={20} color={colors.secondaryDark} />
              <Text style={styles.rowLabel}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [styles.backLink, pressed && styles.backLinkPressed]}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backLinkText}>← Back</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primarySurface,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
    alignItems: "center",
  },
  avatarWrap: {
    alignItems: "center",
    marginBottom: spacing.xxl,
    gap: spacing.sm,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.primaryBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
    ...shadows.subtle,
  },
  rolePill: {
    backgroundColor: colors.secondarySurface,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.secondaryBorder,
  },
  roleText: {
    fontSize: typography.size.sm,
    color: colors.secondaryDark,
    fontWeight: typography.weight.bold,
    textTransform: "capitalize",
  },
  section: {
    width: "100%",
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    overflow: "hidden",
    ...shadows.subtle,
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    minHeight: touch.buttonHeight,
  },
  rowPressed: {
    backgroundColor: colors.primarySurface,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  rowLabel: {
    fontSize: typography.size.lg,
    color: colors.textPrimary,
    fontWeight: typography.weight.semibold,
  },
  backLink: {
    alignSelf: "center",
    minHeight: touch.minHeight,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    justifyContent: "center",
  },
  backLinkPressed: {
    opacity: 0.7,
  },
  backLinkText: {
    fontSize: typography.size.xl,
    color: colors.primaryCTA,
    fontWeight: typography.weight.semibold,
  },
});
