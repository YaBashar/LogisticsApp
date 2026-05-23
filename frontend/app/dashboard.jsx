import { usePushNotifs } from "../hooks/usePushNotifs";
import { useState } from "react";
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import { ScreenHeader } from "../components/ScreenHeader";
import { OrdersListSection } from "../components/OrderListSection";
import { colors, spacing, typography, radii, touch } from "../constants/theme";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  usePushNotifs();

  const { role } = useAuth();
  const isAdmin = role === "admin";
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentMaxWidth = Math.min(420, width - 32);

  const tabs = isAdmin ? ["Active"] : ["Active", "Completed"];
  const [activeTab, setActiveTab] = useState("Active");

  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : "Welcome back";

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <ScreenHeader
        left={
          <Pressable
            style={({ pressed }) => [styles.heroLeft, pressed && styles.pressed]}
            onPress={() => router.push("/profile")}
            accessibilityRole="button"
            accessibilityLabel="View profile"
          >
            <View style={styles.avatar}>
              <Ionicons name="person" size={20} color={colors.primaryDark} />
            </View>
            <View style={styles.greetingBlock}>
              <Text style={styles.greetingText} numberOfLines={1}>
                {getGreeting()}, <Text style={styles.roleText}>{displayRole}</Text>
              </Text>
            </View>
          </Pressable>
        }
      />

      {/* ── Tab switcher ──────────────────────────────────── */}
      <View style={[styles.tabsWrap, { width: contentMaxWidth }]}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={({ pressed }) => [
                styles.tabPill,
                isActive ? styles.tabPillActive : styles.tabPillInactive,
                pressed && !isActive && styles.tabPillPressed,
              ]}
              accessibilityRole="tab"
              accessibilityLabel={`${tab} orders`}
              accessibilityState={{ selected: isActive }}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab} Orders</Text>
            </Pressable>
          );
        })}
      </View>

      {/* ── Orders list ───────────────────────────────────── */}
      {activeTab === "Active" && role ? (
        <OrdersListSection
          key={`active-orders-${role}`}
          endpoint={isAdmin ? "/shipments-admin/active" : "/shipments-customer/active"}
          emptyMessage={
            isAdmin
              ? "No orders yet. New customer orders will show up here."
              : "No orders yet. Your orders will show up here."
          }
          showRefreshControl
          showNewOrderCta={!isAdmin}
        />
      ) : null}

      {activeTab === "Completed" && !isAdmin && (
        <OrdersListSection
          key="completed-orders"
          endpoint="/shipments-customer/completed"
          emptyMessage="Your completed orders will show up here."
          showRefreshControl={false}
          showNewOrderCta={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    alignItems: "center",
  },

  heroLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
    minWidth: 0,
  },
  pressed: {
    opacity: 0.75,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  greetingBlock: {
    flex: 1,
    minWidth: 0,
  },
  greetingText: {
    fontSize: typography.size.sm,
    color: "rgba(255,255,255,0.75)",
    fontWeight: typography.weight.regular,
  },
  roleText: {
    fontSize: typography.size.lg,
    color: colors.textOnDark,
    fontWeight: typography.weight.bold,
  },

  // ── Tabs ──────────────────────────────────────────────────
  tabsWrap: {
    flexDirection: "row",
    gap: spacing.xs,
    paddingTop: 8,
    paddingBottom: 4,
    paddingHorizontal: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255,255,255,0.65)",
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  tabPill: {
    flex: 1,
    minHeight: touch.tabHeight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  tabPillActive: {
    backgroundColor: colors.primaryCTA,
  },
  tabPillInactive: {
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  tabPillPressed: {
    opacity: 0.75,
  },
  tabText: {
    fontSize: typography.size.base,
    letterSpacing: 0.2,
    color: colors.textPrimary,
    fontWeight: typography.weight.bold,
  },
  tabTextActive: {
    color: colors.textOnDark,
  },
});
