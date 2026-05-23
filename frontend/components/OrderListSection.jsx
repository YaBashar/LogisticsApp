import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { axiosPrivate } from "@/services/axios";
import { refreshUnreadNotifications } from "@/hooks/useUnreadNotifications";
import ShipmentCard from "../components/shipmentCard";
import { colors, spacing, typography, radii, shadows, touch } from "@/constants/theme";

const PAGE_LIMIT = 10;

export function OrdersListSection({ endpoint, emptyMessage, showRefreshControl, showNewOrderCta }) {
  const { width } = useWindowDimensions();
  const contentMaxWidth = Math.min(420, width - 32);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const fetchShipments = useCallback(
    async (pageNum, append = true) => {
      setLoading(true);
      setFetchError(false);
      try {
        const res = await axiosPrivate.get(`${endpoint}?page=${pageNum}&limit=${PAGE_LIMIT}`);
        const result = res.data.result;
        if (!result || result.length === 0) {
          setHasMore(false);
        } else {
          setShipments((prev) => (append ? [...prev, ...result] : result));
        }
        refreshUnreadNotifications();
      } catch (_error) {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  useEffect(() => {
    fetchShipments(1, false);
  }, [fetchShipments]);

  useEffect(() => {
    if (page > 1) {
      fetchShipments(page, true);
    }
  }, [page, fetchShipments]);

  const loadMore = () => {
    if (loading || !hasMore) return;
    setPage((prev) => prev + 1);
  };

  const onRefresh = async () => {
    if (!showRefreshControl) return;
    setRefreshing(true);
    setShipments([]);
    setPage(1);
    setHasMore(true);
    await fetchShipments(1, false);
    setRefreshing(false);
  };

  const handleRetry = () => {
    setFetchError(false);
    fetchShipments(page, page > 1);
  };

  if (loading && page === 1 && shipments.length === 0 && !fetchError) {
    return (
      <View style={styles.screen}>
        <View style={styles.centerWrap}>
          <ActivityIndicator size="large" color={colors.primaryDeep} />
          <Text style={styles.loadingText}>Loading orders…</Text>
        </View>
      </View>
    );
  }

  if (fetchError && shipments.length === 0) {
    return (
      <View style={styles.screen}>
        <View style={[styles.errorState, { width: contentMaxWidth }]}>
          <Text style={styles.errorTitle}>Couldn&apos;t load orders</Text>
          <Text style={styles.errorDesc}>Check your connection and try again.</Text>
          <Pressable
            onPress={handleRetry}
            style={({ pressed }) => [styles.retryButton, pressed && styles.retryPressed]}
            accessibilityRole="button"
            accessibilityLabel="Retry loading orders"
          >
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.content, { width: contentMaxWidth }]}>
        <View style={styles.listCard}>
          {shipments.length === 0 && !loading ? (
            <View style={styles.emptyState}>
              <Image
                source={require("../assets/images/idleBox.png")}
                style={styles.emptyImage}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              />
              <Text style={styles.emptyText}>{emptyMessage}</Text>
              {showNewOrderCta ? (
                <Pressable
                  onPress={() => router.push("/newOrder")}
                  style={({ pressed }) => [styles.emptyCtaButton, pressed && styles.buttonPressed]}
                  accessibilityRole="button"
                  accessibilityLabel="Request new order"
                >
                  <Text style={styles.emptyCtaText}>Request New Order</Text>
                </Pressable>
              ) : null}
            </View>
          ) : (
            <FlatList
              data={shipments}
              renderItem={({ item }) => <ShipmentCard shipment={item} />}
              keyExtractor={(item) => item._id}
              onEndReached={loadMore}
              onEndReachedThreshold={0.2}
              ListFooterComponent={
                loading && shipments.length > 0 ? (
                  <ActivityIndicator
                    size="large"
                    color={colors.primary}
                    style={styles.footerLoader}
                  />
                ) : null
              }
              refreshControl={
                showRefreshControl ? (
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={colors.primary}
                    colors={[colors.primary]}
                  />
                ) : undefined
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContentContainer}
            />
          )}
        </View>
      </View>

      {showNewOrderCta && shipments.length > 0 ? (
        <Pressable
          onPress={() => router.push("/newOrder")}
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          accessibilityRole="button"
          accessibilityLabel="Request new order"
        >
          <Text style={styles.fabText}>+ New Order</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.backgroundAlt,
    alignItems: "center",
    paddingHorizontal: spacing.base,
    paddingTop: 4,
    paddingBottom: spacing.base,
  },
  content: {
    flex: 1,
    alignSelf: "center",
  },
  centerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textMuted,
    fontSize: typography.size.base,
  },
  listCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    overflow: "hidden",
    ...shadows.elevated,
  },
  listContentContainer: {
    paddingBottom: 0,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginHorizontal: spacing.base,
  },
  footerLoader: {
    marginVertical: spacing.base,
  },
  emptyState: {
    backgroundColor: colors.background,
    borderRadius: radii.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.base,
    alignItems: "center",
    margin: spacing.xs,
  },
  emptyImage: {
    width: 160,
    height: 160,
    borderRadius: radii.xl,
  },
  emptyText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    textAlign: "center",
    marginTop: spacing.base,
    paddingHorizontal: spacing.base,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.relaxed,
  },
  emptyCtaButton: {
    marginTop: spacing.base,
    height: touch.buttonHeight,
    backgroundColor: colors.primaryCTA,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.subtle,
  },
  emptyCtaText: {
    color: colors.textOnDark,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  errorState: {
    alignSelf: "center",
    marginTop: spacing.xxl,
    backgroundColor: colors.errorBg,
    borderRadius: radii.xxl,
    padding: spacing.xl,
    alignItems: "center",
    ...shadows.subtle,
  },
  errorTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    textAlign: "center",
  },
  errorDesc: {
    marginTop: spacing.sm,
    fontSize: typography.size.md,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: typography.lineHeight.base,
  },
  retryButton: {
    marginTop: spacing.base,
    height: touch.buttonHeight,
    backgroundColor: colors.error,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  retryPressed: {
    opacity: 0.85,
  },
  retryText: {
    color: colors.textOnDark,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: colors.primaryCTA,
    borderRadius: radii.pill,
    paddingVertical: 12,
    paddingHorizontal: spacing.base,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.elevated,
  },
  fabPressed: {
    opacity: 0.88,
  },
  fabText: {
    color: colors.textOnDark,
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.2,
  },
});
