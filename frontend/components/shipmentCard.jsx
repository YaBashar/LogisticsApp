import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { coerceShipmentStatus } from "../constants/shipmentStatus";
import { colors, spacing, typography, radii } from "../constants/theme";

export function ShipmentCard({ shipment }) {
  const currentStatus = coerceShipmentStatus(shipment.status);

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/orderDetails",
          params: { shipment: JSON.stringify({ ...shipment, status: currentStatus }) },
        })
      }
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`Order ${shipment.orderNumber}: ${shipment.itemDescription}`}
      accessibilityHint="Opens order details and shipment timeline"
    >
      <View style={styles.cardInner}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.orderNumber}>#{shipment.orderNumber}</Text>
            <Text numberOfLines={1} style={styles.title}>
              {shipment.itemDescription}
            </Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{currentStatus}</Text>
          </View>
        </View>

        <View style={styles.routeCompact}>
          <Text numberOfLines={1} style={styles.routeLine}>
            {shipment.origin}
          </Text>
          <Text style={styles.routeArrow}>→</Text>
          <Text numberOfLines={1} style={styles.routeLine}>
            {shipment.destination}
          </Text>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.viewDetailsText}>View details & timeline</Text>
          <View style={styles.chevronBadge}>
            <Text style={styles.chevron}>›</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.sm,
    marginTop: 6,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    overflow: "hidden",
  },
  cardPressed: {
    opacity: 0.88,
  },
  cardInner: {
    padding: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerText: {
    flex: 1,
    paddingRight: spacing.md,
  },
  orderNumber: {
    fontSize: typography.size.sm,
    color: colors.textDisabled,
    marginBottom: spacing.xs,
    fontWeight: typography.weight.medium,
  },
  title: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    letterSpacing: 0.1,
    lineHeight: typography.lineHeight.base,
  },
  statusPill: {
    backgroundColor: colors.primaryLight,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    flexShrink: 0,
  },
  statusText: {
    fontSize: typography.size.sm,
    color: colors.primaryMid,
    fontWeight: typography.weight.bold,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: spacing.base,
    rowGap: spacing.xs,
    alignItems: "center",
    marginTop: 0,
  },
  metaText: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
  },
  routeCompact: {
    marginTop: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: "rgba(16,185,129,0.08)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.14)",
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  routeLine: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.tight,
  },
  routeArrow: {
    marginHorizontal: spacing.sm,
    color: colors.primaryCTA,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  footerRow: {
    marginTop: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderLight,
    paddingTop: 4,
  },
  viewDetailsText: {
    fontSize: typography.size.sm,
    color: colors.primaryMid,
    fontWeight: typography.weight.semibold,
    flex: 1,
  },
  chevronBadge: {
    width: 28,
    height: 28,
    borderRadius: radii.pill,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  chevron: {
    fontSize: 20,
    lineHeight: 24,
    color: colors.primaryMid,
    fontWeight: typography.weight.bold,
  },
});
