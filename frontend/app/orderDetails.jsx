import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { font } from "../styles/font";
import PackageTimeline from "../components/PackageTimeline";

export default function OrderDetails() {
  const { width } = useWindowDimensions();
  const contentMaxWidth = Math.min(420, width - 32);
  const { shipment } = useLocalSearchParams();

  let shipmentData = null;
  try {
    shipmentData = JSON.parse(typeof shipment === "string" ? shipment : "{}");
  } catch (_error) {
    shipmentData = null;
  }

  if (!shipmentData) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={[styles.card, { width: contentMaxWidth }]}>
          <Text style={[font, styles.errorTitle]}>Order details unavailable</Text>
          <Text style={[font, styles.errorText]}>Please go back and open the order again.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.card, { width: contentMaxWidth }]}>
          <Text style={[font, styles.orderNumber]}>Order #{shipmentData.orderNumber}</Text>
          <Text style={[font, styles.title]}>{shipmentData.itemDescription}</Text>

          <View style={styles.statusBadge}>
            <Text style={[font, styles.statusBadgeText]}>{shipmentData.status}</Text>
          </View>

          <View style={styles.metaGrid}>
            <Text style={[font, styles.metaLine]}>
              Package:{" "}
              {shipmentData.packageType?.charAt(0).toUpperCase() +
                shipmentData.packageType?.slice(1)}
            </Text>
            <Text style={[font, styles.metaLine]}>Weight: {shipmentData.weight} kg</Text>
            <Text style={[font, styles.metaLine]}>Quantity: {shipmentData.quantity}</Text>
          </View>

          <View style={styles.routeCard}>
            <Text style={[font, styles.routeLabel]}>Pickup From</Text>
            <Text style={[font, styles.routeValue]}>{shipmentData.origin}</Text>
            <Text style={[font, styles.routeLabel, { marginTop: 10 }]}>Deliver To</Text>
            <Text style={[font, styles.routeValue]}>{shipmentData.destination}</Text>
          </View>

          <Text style={[font, styles.timelineTitle]}>Shipment Timeline</Text>
          <PackageTimeline status={shipmentData.status} variant="detailed" />
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
  statusBadge: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "rgba(30, 158, 115, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(30, 158, 115, 0.25)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  statusBadgeText: {
    fontSize: 12,
    color: "#0B6B4B",
    fontWeight: "700",
  },
  metaGrid: {
    marginTop: 10,
    gap: 4,
  },
  metaLine: {
    fontSize: 13,
    color: "#334155",
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
