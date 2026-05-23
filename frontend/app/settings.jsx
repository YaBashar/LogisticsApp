import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import { axiosPrivate } from "../services/axios";
import { colors, spacing, typography, radii, touch } from "../constants/theme";
import { ScreenHeader } from "../components/ScreenHeader";

const cardBorder = {
  borderWidth: 1,
  borderColor: colors.borderLight,
};

function SettingsMenuRow({
  icon,
  iconColor,
  iconBg,
  label,
  subtitle,
  onPress,
  showChevron = true,
  destructive,
  busy,
  disabled,
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuRow,
        pressed && !disabled && styles.menuRowPressed,
        disabled && styles.menuRowDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${label}, ${subtitle}` : label}
      accessibilityState={{ busy, disabled }}
    >
      <View style={styles.menuRowMain}>
        <View style={[styles.menuIconWrap, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <View style={styles.menuTextBlock}>
          <Text style={[styles.menuLabel, destructive && styles.menuLabelDestructive]}>
            {label}
          </Text>
          {subtitle ? (
            <Text
              style={[styles.menuSubtitle, destructive && styles.menuSubtitleDestructive]}
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {busy ? (
        <ActivityIndicator size="small" color={destructive ? colors.error600 : colors.primaryCTA} />
      ) : showChevron ? (
        <Ionicons name="chevron-forward" size={16} color={colors.textPlaceholder} />
      ) : null}
    </Pressable>
  );
}

export function Settings() {
  const { logout } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const { width: screenWidth } = useWindowDimensions();
  const contentMaxWidth = Math.min(420, screenWidth - 32);

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
            // Best-effort logout
          } finally {
            await logout();
            router.replace("/auth/login");
          }
        },
      },
    ]);
  };

  const confirmDelete = () => {
    if (deleting) return;
    const message =
      Platform.OS === "ios"
        ? "Your account will be deactivated. You can restore it within 30 days by logging in again. After 30 days it will be permanently removed."
        : "Your account will be deactivated. Restore within 30 days from login, or it will be permanently removed.";

    Alert.alert("Delete account?", message, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete account",
        style: "destructive",
        onPress: () => runDelete(),
      },
    ]);
  };

  const runDelete = async () => {
    setDeleting(true);
    try {
      await axiosPrivate.delete("/auth/delete-account");
      await logout();
      Alert.alert(
        "Account deleted",
        "You can restore your account within 30 days when you sign in.",
        [{ text: "OK", onPress: () => router.replace("/auth/login") }]
      );
    } catch (error) {
      const msg =
        error?.response?.data?.error || error?.message || "Could not delete account. Try again.";
      Alert.alert("Error", msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <ScreenHeader title="Settings" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scroll, { maxWidth: contentMaxWidth }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoBanner}>
          <View style={styles.infoIconWrap}>
            <Ionicons name="information-circle-outline" size={22} color={colors.primaryCTA} />
          </View>
          <Text style={styles.infoText}>
            Manage your account settings. Deleting your account is reversible within 30 days.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.menuCard}>
          <SettingsMenuRow
            icon="key-outline"
            iconColor={colors.primaryCTA}
            iconBg={colors.primarySurface}
            label="Change password"
            subtitle="Update your login credentials"
            onPress={() => router.push("/changePassword")}
          />
          <View style={styles.menuDivider} />
          <SettingsMenuRow
            icon="notifications-outline"
            iconColor={colors.accent600}
            iconBg={colors.accent50}
            label="Notifications"
            subtitle="Manage alerts & preferences"
            onPress={() => router.push("/notifications")}
          />
        </View>

        <View style={styles.dangerCard}>
          <Text style={styles.dangerLabel}>DANGER ZONE</Text>
          <SettingsMenuRow
            icon="log-out-outline"
            iconColor={colors.error600}
            iconBg={colors.error50}
            label="Log out"
            showChevron={false}
            destructive
            onPress={handleLogout}
          />
          <View style={styles.menuDivider} />
          <SettingsMenuRow
            icon="trash-outline"
            iconColor={colors.error600}
            iconBg={colors.error50}
            label="Delete my account"
            subtitle="Reversible within 30 days"
            destructive
            onPress={confirmDelete}
            busy={deleting}
            disabled={deleting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primarySurface,
  },
  scrollView: {
    flex: 1,
  },
  scroll: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.xxl,
    backgroundColor: colors.brand100,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  infoText: {
    flex: 1,
    fontSize: typography.size.base,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.base,
  },
  sectionLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: -spacing.sm,
  },
  menuCard: {
    width: "100%",
    borderRadius: radii.xxl,
    backgroundColor: colors.surface,
    overflow: "hidden",
    ...cardBorder,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    minHeight: touch.minHeight + spacing.sm,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  menuRowPressed: {
    backgroundColor: colors.primarySurface,
  },
  menuRowDisabled: {
    opacity: 0.6,
  },
  menuRowMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  menuTextBlock: {
    flex: 1,
    gap: 2,
  },
  menuLabel: {
    fontSize: typography.size.base,
    color: colors.textPrimary,
    fontWeight: typography.weight.semibold,
  },
  menuLabelDestructive: {
    color: colors.error600,
  },
  menuSubtitle: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
    lineHeight: typography.lineHeight.tight,
  },
  menuSubtitleDestructive: {
    color: colors.error600,
    opacity: 0.75,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderLight,
    marginLeft: spacing.lg + 36 + spacing.md,
  },
  dangerCard: {
    width: "100%",
    borderRadius: radii.xxl,
    backgroundColor: colors.error50,
    borderWidth: 1,
    borderColor: "rgba(220,38,38,0.18)",
    overflow: "hidden",
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  dangerLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.error600,
    letterSpacing: 0.8,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
});
