import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { axiosPrivate } from "@/services/axios";
import useAuth from "@/hooks/useAuth";
import ScreenHeader from "../components/ScreenHeader";
import { setUnreadNotifications } from "@/hooks/useUnreadNotifications";
import { coerceShipmentStatus } from "@/constants/shipmentStatus";
import { colors, spacing, typography, radii, shadows } from "../constants/theme";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function iconForType(type) {
  switch (type) {
    case "NewShipment":
      return { name: "cube-outline", color: colors.secondary, bg: colors.secondarySurface };
    case "StatusUpdate":
      return { name: "sync-outline", color: colors.success600, bg: colors.successBg };
    default:
      return { name: "notifications-outline", color: colors.textMuted, bg: colors.neutral100 };
  }
}

function NotificationCard({ item, onPress }) {
  const icon = iconForType(item.type);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        !item.read && styles.cardUnread,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item.message}
    >
      <View style={[styles.iconWrap, { backgroundColor: icon.bg }]}>
        <Ionicons name={icon.name} size={22} color={icon.color} />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardMessage}>{item.message}</Text>
        {item.orderNumber != null && (
          <Text style={styles.cardOrderNumber}>Order #{item.orderNumber}</Text>
        )}
        <Text style={styles.cardTime}>{timeAgo(item.createdAt)}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </Pressable>
  );
}

async function findShipmentById(shipmentId, isAdmin) {
  const endpoints = isAdmin
    ? ["/shipments-admin/active"]
    : ["/shipments-customer/active", "/shipments-customer/completed"];

  for (const endpoint of endpoints) {
    let page = 1;

    while (true) {
      const res = await axiosPrivate.get(`${endpoint}?page=${page}&limit=50`);
      const result = res.data.result ?? [];
      const found = result.find((s) => s._id === shipmentId);
      if (found) return found;
      if (result.length < 50) break;
      page += 1;
    }
  }

  return null;
}

export default function Notifications() {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const { width } = useWindowDimensions();
  const contentMaxWidth = Math.min(420, width - 32);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [navigatingId, setNavigatingId] = useState(null);

  const hasUnread = notifications.some((n) => !n.read);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axiosPrivate.get("/notifications");
      const list = res.data.notifications ?? [];
      setNotifications(list);
      setUnreadNotifications(list.some((n) => !n.read));
    } catch (_error) {
      // Keep prior list on failure
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  async function markAllRead() {
    try {
      await axiosPrivate.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadNotifications(false);
    } catch (_error) {
      // Non-blocking
    }
  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchNotifications();
    }, [fetchNotifications])
  );

  function onRefresh() {
    setRefreshing(true);
    fetchNotifications();
  }

  async function handleNotificationPress(item) {
    if (navigatingId) return;

    setNavigatingId(item.id);
    try {
      const shipment = await findShipmentById(item.shipmentId, isAdmin);
      if (!shipment) return;

      router.push({
        pathname: "/orderDetails",
        params: {
          shipment: JSON.stringify({
            ...shipment,
            status: coerceShipmentStatus(shipment.status),
          }),
        },
      });
    } finally {
      setNavigatingId(null);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScreenHeader title="Notifications" />

      {hasUnread ? (
        <View style={[styles.toolbar, { maxWidth: contentMaxWidth }]}>
          <Pressable
            onPress={markAllRead}
            style={({ pressed }) => [styles.markAllBtn, pressed && styles.markAllBtnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Mark all notifications as read"
          >
            <Text style={styles.markAllText}>Mark all read</Text>
          </Pressable>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primaryCTA} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={[
            styles.listContent,
            { maxWidth: contentMaxWidth },
            notifications.length === 0 && styles.emptyContent,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primaryCTA}
              colors={[colors.primaryCTA]}
            />
          }
          renderItem={({ item }) => (
            <NotificationCard item={item} onPress={() => handleNotificationPress(item)} />
          )}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Ionicons name="notifications-off-outline" size={48} color={colors.textPlaceholder} />
              <Text style={styles.emptyText}>No notifications yet</Text>
              <Text style={styles.emptySubtext}>
                Shipment updates and new orders will appear here.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  toolbar: {
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  markAllBtn: {
    minHeight: 36,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
  },
  markAllBtnPressed: {
    opacity: 0.75,
  },
  markAllText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.brand200,
  },
  list: {
    flex: 1,
  },
  listContent: {
    width: "100%",
    alignSelf: "center",
    padding: spacing.base,
    gap: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  emptyContent: {
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    fontSize: typography.size.lg,
    color: colors.textPrimary,
    fontWeight: typography.weight.semibold,
  },
  emptySubtext: {
    fontSize: typography.size.base,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: typography.lineHeight.base,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.subtle,
  },
  cardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  cardPressed: {
    opacity: 0.88,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardBody: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  cardMessage: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.tight,
  },
  cardOrderNumber: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.primaryMid,
  },
  cardTime: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    fontWeight: typography.weight.medium,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    flexShrink: 0,
  },
});
