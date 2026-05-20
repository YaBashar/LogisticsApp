import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { font } from "../styles/font";
import { PackageTimeline } from "../components/PackageTimeline";
import { coerceShipmentStatus } from "@/constants/shipmentStatus";
import useAuth from "@/hooks/useAuth";

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
        <View style={[styles.card, { width: contentMaxWidth }]}>
          <Text style={[font, styles.errorTitle]}>Order details unavailable</Text>
          <Text style={[font, styles.errorText]}>Please go back and open the order again.</Text>
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
              <Text style={[font, styles.orderNumber]}>Order #{shipmentData.orderNumber}</Text>
              <Text style={[font, styles.title]}>{shipmentData.itemDescription}</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={[font, styles.statusPillText]}>{displayStatus}</Text>
            </View>
          </View>

          <Text style={[font, styles.metaCompact]}>
            <Text style={styles.metaLabel}>Package: </Text>
            {packageLabel}
            <Text style={styles.metaDivider}> · </Text>
            <Text style={styles.metaLabel}>Weight: </Text>
            {shipmentData.weight} kg
            <Text style={styles.metaDivider}> · </Text>
            <Text style={styles.metaLabel}>Quantity: </Text>
            {shipmentData.quantity ?? "—"}
          </Text>

          <View style={styles.routeCard}>
            <Text style={[font, styles.routeLabel]}>Pickup From</Text>
            <Text style={[font, styles.routeValue]}>{shipmentData.origin}</Text>
            <Text style={[font, styles.routeLabel, { marginTop: 10 }]}>Deliver To</Text>
            <Text style={[font, styles.routeValue]}>{shipmentData.destination}</Text>
          </View>

          {isAdmin ? (
            <View style={styles.contactCard}>
              <Text style={[font, styles.routeLabel]}>Sender Contact</Text>
              <Text style={[font, styles.routeValue]}>
                {shipmentData.senderEmail || "—"} {shipmentData.senderPhone || "—"}
              </Text>
              <Text style={[font, styles.routeLabel, { marginTop: 10 }]}>Recipient Contact</Text>
              <Text style={[font, styles.routeValue]}>
                {shipmentData.recipientEmail || "—"} {shipmentData.recipientPhone || "—"}
              </Text>
            </View>
          ) : null}

          <Text style={[font, styles.timelineTitle]}>Shipment Timeline</Text>
          <PackageTimeline
            status={displayStatus}
            variant="detailed"
            shipment={shipmentData}
            onStatusChange={setDisplayStatus}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#CFEFE1",
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.10)",
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerText: {
    flex: 1,
    paddingRight: 12,
  },
  orderNumber: {
    fontSize: 11,
    color: "#64748B",
  },
  title: {
    fontSize: 20,
    color: "#0F172A",
    marginTop: 2,
    fontWeight: "700",
  },
  statusPill: {
    backgroundColor: "rgba(30, 158, 115, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(30, 158, 115, 0.25)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  statusPillText: {
    fontSize: 12,
    color: "#0B6B4B",
    fontWeight: "700",
  },
  metaCompact: {
    marginTop: 10,
    fontSize: 13,
    color: "#334155",
    lineHeight: 20,
  },
  metaLabel: {
    fontWeight: "700",
    color: "#0F172A",
  },
  metaDivider: {
    color: "#94A3B8",
    fontWeight: "400",
  },
  routeCard: {
    marginTop: 12,
    borderRadius: 14,
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.14)",
    padding: 12,
  },
  routeLabel: {
    fontSize: 11,
    color: "#0F172A",
    fontWeight: "700",
  },
  routeValue: {
    marginTop: 4,
    fontSize: 12,
    color: "#475569",
  },
  contactCard: {
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: "rgba(15, 23, 42, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.10)",
    padding: 12,
  },
  timelineTitle: {
    marginTop: 14,
    marginBottom: 2,
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "700",
  },
  errorTitle: {
    fontSize: 18,
    color: "#0F172A",
    textAlign: "center",
    fontWeight: "700",
  },
  errorText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
  },
});
