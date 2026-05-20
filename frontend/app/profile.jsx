import usePushNotifs from "../hooks/usePushNotifs";
import { useState } from "react";
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import useAuth from "@/hooks/useAuth";
import { font } from "../styles/font";
import { AuthenticatedScreenHeader } from "../components/AuthenticatedScreenHeader";
import { OrdersListSection } from "../components/OrderListSection";

export default function Profile() {
  usePushNotifs();

  const { role } = useAuth();
  const isAdmin = role === "admin";
  const { width } = useWindowDimensions();
  const contentMaxWidth = Math.min(420, width - 32);

  const tabs = isAdmin ? ["Active"] : ["Active", "Completed"];
  const [activeTab, setActiveTab] = useState("Active");

  return (
    <View style={styles.screen}>
      <AuthenticatedScreenHeader title="My Orders" variant="hero" />

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
                { opacity: pressed ? 0.92 : 1 },
              ]}
            >
              <Text style={[font, styles.tabText, isActive ? styles.tabTextActive : null]}>
                {tab} Orders
              </Text>
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
              : "No Orders Yet, Your orders will show up here"
          }
          showRefreshControl
          showNewOrderCta={!isAdmin}
        />
      ) : null}

      {activeTab === "Completed" && !isAdmin && (
        <OrdersListSection
          key="completed-orders"
          endpoint="/shipments-customer/completed"
          emptyMessage="Your Completed Orders will show up here"
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
    backgroundColor: "#CFEFE1",
    alignItems: "center",
  },
  tabsWrap: {
    flexDirection: "row",
    gap: 10,
    padding: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.65)",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    marginTop: 10,
    marginBottom: 10,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  tabPillActive: {
    backgroundColor: "#1E9E73",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 3,
  },
  tabPillInactive: {
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  tabText: {
    fontSize: 13,
    letterSpacing: 0.2,
    color: "#0F172A",
    fontWeight: "700",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
});
