import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAuth from "@/hooks/useAuth";
import LogoutButton from "./auth/LogoutButton";
import { colors, spacing, typography, shadows } from "@/constants/theme";

/**
 * App header — role pill, logout, and settings in one actions pill.
 * @param {"toolbar" | "hero"} [variant="toolbar"] — hero = large title + subtitle
 */
export function AuthenticatedScreenHeader({
  title,
  subtitle,
  variant = "toolbar",
  showSettings = true,
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(420, width - 32);

  const actions = <LogoutButton showSettings={showSettings} />;

  if (variant === "hero") {
    return (
      <View
        style={[
          styles.heroWrap,
          {
            width: contentWidth,
            paddingTop: insets.top + spacing.sm,
          },
        ]}
      >
        <View style={styles.heroRow}>
          <View style={styles.heroActions}>{actions}</View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.toolbarWrap, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.toolbarTitleWrap}>
        <Text style={styles.toolbarTitle} numberOfLines={1} accessibilityRole="header">
          {title}
        </Text>
      </View>
      <View style={styles.toolbarActions}>{actions}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbarWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    minHeight: 56,
    ...shadows.subtle,
  },
  toolbarTitleWrap: {
    flex: 1,
    minWidth: 0,
  },
  toolbarTitle: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.primaryDeep,
  },
  toolbarActions: {
    flexShrink: 0,
  },
  heroWrap: {
    alignSelf: "center",
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.xs,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  heroTextBlock: {
    flex: 1,
    minWidth: 0,
    paddingRight: spacing.xs,
  },
  heroTitle: {
    fontSize: typography.size.xxxl,
    color: colors.primaryMid,
    letterSpacing: 0.2,
    fontWeight: typography.weight.bold,
  },
  heroSubtitle: {
    marginTop: spacing.xs,
    fontSize: typography.size.lg,
    color: colors.primaryCTA,
    fontWeight: typography.weight.semibold,
  },
  heroActions: {
    flexShrink: 0,
  },
});
