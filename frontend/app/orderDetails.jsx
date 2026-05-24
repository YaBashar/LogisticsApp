import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { PackageTimeline } from "../components/PackageTimeline";
import { coerceShipmentStatus } from "../constants/shipmentStatus";
import { useAuth } from "../hooks/useAuth";
import { colors, spacing, typography, radii, shadows, touch } from "../constants/theme";

function formatPackageType(packageType) {
  if (!packageType) return "—";
  return packageType.charAt(0).toUpperCase() + packageType.slice(1);
}

export default function OrderDetails() {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const { width } = useWindowDimensions();
  const contentMaxWidth = Math.min(420, width - 32);
  const { shipment } = useLocalSearchParams();

  let shipmentData = null;
  try {
    shipmentData = JSON.parse(typeof shipment === "string" ? shipment : "{}");
  } catch (_error) {
    shipmentData = null;
  }

  const [displayStatus, setDisplayStatus] = useState(() =>
    coerceShipmentStatus(shipmentData?.status)
  );

  if (!shipmentData?._id) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={[styles.errorCard, { width: contentMaxWidth }]}>
          <Text style={styles.errorTitle}>Order details unavailable</Text>
          <Text style={styles.errorDesc}>Please go back and open the order again.</Text>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.backPressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backButtonText}>← Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const packageLabel = formatPackageType(shipmentData.packageType);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.card, { width: contentMaxWidth }]}>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.orderNumber}>Order #{shipmentData.orderNumber}</Text>
              <Text style={styles.title} numberOfLines={2}>
                {shipmentData.itemDescription}
              </Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>{displayStatus}</Text>
            </View>
          </View>

          <Text style={styles.metaCompact}>
            <Text style={styles.metaLabel}>Package: </Text>
            {packageLabel}
            <Text style={styles.metaDivider}> · </Text>
            <Text style={styles.metaLabel}>Weight: </Text>
            {shipmentData.weight} kg
            <Text style={styles.metaDivider}> · </Text>
            <Text style={styles.metaLabel}>Qty: </Text>
            {shipmentData.quantity ?? "—"}
          </Text>

          <View style={styles.routeCard}>
            <Text style={styles.routeLabel}>Pickup from</Text>
            <Text style={styles.routeValue}>{shipmentData.origin}</Text>
            <Text style={[styles.routeLabel, { marginTop: spacing.md }]}>Deliver to</Text>
            <Text style={styles.routeValue}>{shipmentData.destination}</Text>
          </View>

          {isAdmin ? (
            <View style={styles.contactCard}>
              <Text style={styles.routeLabel}>Sender contact</Text>
              <Text style={styles.routeValue}>
                {shipmentData.senderEmail || "—"}
                {"  "}
                {shipmentData.senderPhone || ""}
              </Text>
              <Text style={[styles.routeLabel, { marginTop: spacing.md }]}>Recipient contact</Text>
              <Text style={styles.routeValue}>
                {shipmentData.recipientEmail || "—"}
                {"  "}
                {shipmentData.recipientPhone || ""}
              </Text>
            </View>
          ) : null}

          <Text style={styles.timelineTitle}>Shipment Timeline</Text>
          <PackageTimeline
            status={displayStatus}
            variant="detailed"
            shipment={shipmentData}
            onStatusChange={setDisplayStatus}
          />

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backLink, pressed && styles.backPressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back to orders"
          >
            <Text style={styles.backLinkText}>← Back to orders</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    padding: spacing.base,
    ...shadows.elevated,
  },
  errorCard: {
    alignSelf: "center",
    marginTop: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    padding: spacing.xl,
    alignItems: "center",
    ...shadows.float,
  },
  errorTitle: {
    fontSize: typography.size.xl,
    color: colors.textPrimary,
    textAlign: "center",
    fontWeight: typography.weight.bold,
  },
  errorDesc: {
    fontSize: typography.size.md,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.sm,
    lineHeight: typography.lineHeight.base,
  },
  backButton: {
    marginTop: spacing.base,
    height: touch.buttonHeight,
    backgroundColor: colors.primaryCTA,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  backPressed: {
    opacity: 0.8,
  },
  backButtonText: {
    color: colors.textOnDark,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
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
    fontWeight: typography.weight.medium,
  },
  title: {
    fontSize: typography.size.xxl,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    fontWeight: typography.weight.bold,
    lineHeight: typography.lineHeight.relaxed,
  },
  statusPill: {
    backgroundColor: colors.primaryLight,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: "flex-start",
  },
  statusPillText: {
    fontSize: typography.size.sm,
    color: colors.primaryMid,
    fontWeight: typography.weight.bold,
  },
  metaCompact: {
    marginTop: spacing.md,
    fontSize: typography.size.base,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.base,
  },
  metaLabel: {
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  metaDivider: {
    color: colors.textDisabled,
    fontWeight: typography.weight.regular,
  },
  routeCard: {
    marginTop: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.primarySurface,
    padding: spacing.md,
  },
  routeLabel: {
    fontSize: typography.size.sm,
    color: colors.textPrimary,
    fontWeight: typography.weight.bold,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  routeValue: {
    marginTop: spacing.xs,
    fontSize: typography.size.base,
    color: colors.textMuted,
    lineHeight: typography.lineHeight.base,
  },
  contactCard: {
    marginTop: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.secondarySurface,
    padding: spacing.md,
  },
  timelineTitle: {
    marginTop: spacing.base,
    marginBottom: spacing.xs,
    fontSize: typography.size.base,
    color: colors.textPrimary,
    fontWeight: typography.weight.bold,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  backLink: {
    alignSelf: "center",
    marginTop: spacing.xl,
    minHeight: touch.minHeight,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    justifyContent: "center",
  },
  backLinkText: {
    fontSize: typography.size.lg,
    color: colors.primaryCTA,
    fontWeight: typography.weight.semibold,
  },
});
