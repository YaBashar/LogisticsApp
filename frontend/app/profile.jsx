import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { axiosPrivate } from "@/services/axios";
import useAuth from "@/hooks/useAuth";
import { STATES_ORDERED } from "@/constants/shipmentStatus";
import { colors, spacing, typography, radii, touch } from "../constants/theme";

function formatRole(role) {
  if (!role) return "";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function getInitials(name) {
  if (!name || typeof name !== "string") return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const STATUS_META = {
  Pending: {
    icon: "time-outline",
    tint: colors.warning600,
    bg: colors.warning100,
  },
  Picked: {
    icon: "cube-outline",
    tint: colors.accent600,
    bg: colors.accent100,
  },
  Shipped: {
    icon: "airplane-outline",
    tint: colors.accent700,
    bg: colors.accent50,
  },
  Delivered: {
    icon: "checkmark-circle-outline",
    tint: colors.success600,
    bg: colors.success100,
  },
  Received: {
    icon: "archive-outline",
    tint: colors.secondaryDark,
    bg: colors.secondarySurface,
  },
};

function MenuRow({ icon, iconColor, iconBg, label, onPress, showChevron = true, destructive }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.menuRow, pressed && styles.menuRowPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.menuRowLeft}>
        <View style={[styles.menuIconWrap, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <Text style={[styles.menuLabel, destructive && styles.menuLabelDestructive]}>{label}</Text>
      </View>
      {showChevron ? (
        <Ionicons name="chevron-forward" size={16} color={colors.textPlaceholder} />
      ) : null}
    </Pressable>
  );
}

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const contentMaxWidth = Math.min(420, screenWidth - 32);
  const { logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const fetchProfile = useCallback(async () => {
    setError(false);
    try {
      const res = await axiosPrivate.get("/auth/profile");
      setProfile(res.data);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchProfile();
      setLoading(false);
    })();
  }, [fetchProfile]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  };

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

  const displayRole = formatRole(profile?.role);
  const shipmentCounts = profile?.shipmentCounts ?? {};
  const initials = getInitials(profile?.name);

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={[styles.headerInner, { maxWidth: contentMaxWidth }]}>
          <View style={styles.headerNav}>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              style={({ pressed }) => [styles.headerBtn, pressed && styles.headerBtnPressed]}
            >
              <Ionicons name="arrow-back-outline" size={20} color={colors.textOnDark} />
            </Pressable>
            <Text style={styles.headerTitle} accessibilityRole="header">
              Profile
            </Text>
            {loading ? (
              <ActivityIndicator size="small" color={colors.textOnDark} />
            ) : profile ? (
              <View style={styles.avatarCircle} accessibilityLabel={`Profile, ${profile.name}`}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
          </View>

          {error ? (
            <View style={styles.identityError}>
              <Text style={styles.identityErrorText}>Could not load profile.</Text>
              <Pressable
                style={({ pressed }) => [styles.retryBtn, pressed && styles.retryBtnPressed]}
                onPress={async () => {
                  setLoading(true);
                  await fetchProfile();
                  setLoading(false);
                }}
                accessibilityRole="button"
                accessibilityLabel="Retry loading profile"
              >
                <Text style={styles.retryBtnText}>Try again</Text>
              </Pressable>
            </View>
          ) : profile ? (
            <View style={styles.identityBlock}>
              <Text style={styles.name} numberOfLines={1}>
                {profile.name}
              </Text>
              <Text style={styles.email} numberOfLines={1}>
                {profile.email}
              </Text>
              {displayRole ? (
                <View style={styles.rolePill}>
                  <Text style={styles.roleText}>{displayRole}</Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scroll, { maxWidth: contentMaxWidth }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primaryCTA}
          />
        }
      >
        {!loading && !error && profile ? (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Shipment summary</Text>
            <View style={styles.statsGrid}>
              {STATES_ORDERED.map((status) => {
                const meta = STATUS_META[status] ?? STATUS_META.Pending;
                const count = shipmentCounts[status] ?? 0;
                const isReceived = status === "Received";
                return (
                  <View key={status} style={[styles.statCard, isReceived && styles.statCardFull]}>
                    <View style={[styles.statIconWrap, { backgroundColor: meta.bg }]}>
                      <Ionicons name={meta.icon} size={16} color={meta.tint} />
                    </View>
                    <View style={[styles.statTextRow, isReceived && styles.statTextRowCentered]}>
                      <Text style={styles.statCount}>{count}</Text>
                      <Text style={styles.statLabel}>{status}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        <View style={styles.menuCard}>
          <MenuRow
            icon="settings-outline"
            iconColor={colors.secondaryDark}
            iconBg={colors.secondarySurface}
            label="Settings"
            onPress={() => router.push("/settings")}
          />
          <View style={styles.menuDivider} />
          <MenuRow
            icon="notifications-outline"
            iconColor={colors.accent600}
            iconBg={colors.accent50}
            label="Notifications"
            showChevron={false}
            onPress={() => router.push("/notifications")}
          />
          <View style={styles.menuDivider} />
          <MenuRow
            icon="log-out-outline"
            iconColor={colors.error600}
            iconBg={colors.error50}
            label="Log out"
            showChevron={false}
            destructive
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const cardBorder = {
  borderWidth: 1,
  borderColor: colors.borderLight,
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primarySurface,
  },
  header: {
    width: "100%",
    backgroundColor: colors.primaryDark,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
    alignItems: "center",
  },
  headerInner: {
    width: "100%",
    gap: spacing.xs,
  },
  headerNav: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
    gap: spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.textOnDark,
  },
  headerBtn: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerBtnPressed: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
  },
  avatarInitials: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.textOnDark,
    letterSpacing: 0.5,
  },
  identityBlock: {
    width: "100%",
    alignItems: "flex-start",
    gap: 2,
    paddingRight: 48,
  },
  identityError: {
    gap: spacing.xs,
    paddingBottom: spacing.xs,
  },
  identityErrorText: {
    fontSize: typography.size.sm,
    color: "rgba(255,255,255,0.85)",
  },
  name: {
    fontSize: typography.size.md,
    color: colors.textOnDark,
    fontWeight: typography.weight.bold,
  },
  email: {
    fontSize: typography.size.xs,
    color: "rgba(255,255,255,0.75)",
    maxWidth: "100%",
  },
  rolePill: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    marginTop: 2,
  },
  roleText: {
    fontSize: typography.size.xs,
    color: colors.textOnDark,
    fontWeight: typography.weight.bold,
  },
  retryBtn: {
    minHeight: touch.minHeight,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
  },
  retryBtnPressed: {
    opacity: 0.7,
  },
  retryBtnText: {
    fontSize: typography.size.base,
    color: colors.textOnDark,
    fontWeight: typography.weight.semibold,
    textDecorationLine: "underline",
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
  statsCard: {
    width: "100%",
    borderRadius: radii.xxl,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...cardBorder,
  },
  statsTitle: {
    fontSize: typography.size.lg,
    color: colors.textPrimary,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.sm,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  statCard: {
    width: "47%",
    flexGrow: 1,
    minWidth: "47%",
    maxWidth: "48%",
    borderRadius: radii.xl,
    backgroundColor: colors.neutral50,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    ...cardBorder,
  },
  statCardFull: {
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
    alignItems: "center",
  },
  statIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  statTextRow: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  statTextRowCentered: {
    justifyContent: "center",
  },
  statCount: {
    fontSize: typography.size.xxl,
    color: colors.textPrimary,
    fontWeight: typography.weight.bold,
    lineHeight: typography.size.xxl,
  },
  statLabel: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
    fontWeight: typography.weight.medium,
    lineHeight: typography.size.sm,
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
    minHeight: touch.minHeight,
    paddingVertical: spacing.sm,
  },
  menuRowPressed: {
    backgroundColor: colors.primarySurface,
  },
  menuRowLeft: {
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
  },
  menuLabel: {
    fontSize: typography.size.base,
    color: colors.textPrimary,
    fontWeight: typography.weight.semibold,
  },
  menuLabelDestructive: {
    color: colors.error600,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderLight,
    marginLeft: spacing.lg + 36 + spacing.md,
  },
});
