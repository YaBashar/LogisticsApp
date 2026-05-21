import usePushNotifs from "../hooks/usePushNotifs";
import { useState } from "react";
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAuth from "@/hooks/useAuth";
import { AuthenticatedScreenHeader } from "../components/AuthenticatedScreenHeader";
import { OrdersListSection } from "../components/OrderListSection";
import { colors, spacing, typography, radii, touch, shadows } from "../constants/theme";

export default function Profile() {
  usePushNotifs();

  const { role } = useAuth();
  const isAdmin = role === "admin";
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentMaxWidth = Math.min(420, width - 32);

  const tabs = isAdmin ? ["Active"] : ["Active", "Completed"];
  const [activeTab, setActiveTab] = useState("Active");

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <AuthenticatedScreenHeader variant="hero" />

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
  tabsWrap: {
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255,255,255,0.65)",
    marginTop: spacing.md,
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  tabPill: {
    flex: 1,
    minHeight: touch.tabHeight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  tabPillActive: {
    backgroundColor: colors.primaryCTA,
    ...shadows.card,
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
