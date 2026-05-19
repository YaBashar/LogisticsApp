import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { font } from "../styles/font";
import { router } from "expo-router";
import { coerceShipmentStatus } from "../hooks/useAdvanceShipmentStatus";

export default function ShipmentCard({ shipment }) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(420, width - 32);
  const currentStatus = coerceShipmentStatus(shipment.status);

  return (
    <TouchableOpacity
      key={shipment._id}
      activeOpacity={0.78}
      accessibilityRole="button"
      accessibilityHint="Opens order details and shipment timeline"
      onPress={() =>
        router.push({
          pathname: "/orderDetails",
          params: { shipment: JSON.stringify({ ...shipment, status: currentStatus }) },
        })
      }
    >
      <View style={[styles.card, { width: cardWidth }]}>
        <View style={styles.cardInner}>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={[font, styles.orderNumber]}>#{shipment.orderNumber}</Text>
              <Text numberOfLines={1} style={[font, styles.title]}>
                {shipment.itemDescription}
              </Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={[font, styles.statusText]}>{currentStatus}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={[font, styles.metaText]}>⚖️ {shipment.weight} kg</Text>
            <Text style={[font, styles.metaText]}>
              📦 {shipment.packageType.charAt(0).toUpperCase() + shipment.packageType.slice(1)}
            </Text>
          </View>

          <View style={styles.routeCompact}>
            <Text numberOfLines={1} style={[font, styles.routeLine]}>
              {shipment.origin}
            </Text>
            <Text style={[font, styles.routeArrow]}>→</Text>
            <Text numberOfLines={1} style={[font, styles.routeLine]}>
              {shipment.destination}
            </Text>
          </View>

          <View style={styles.footerRow}>
            <Text style={[font, styles.viewDetailsText]}>View details & timeline</Text>
            <View style={styles.chevronBadge}>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.96)",
    marginTop: 10,
    alignSelf: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.10)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 3,
  },
  cardInner: {
    padding: 11,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerText: {
    flex: 1,
    paddingRight: 10,
  },
  orderNumber: {
    fontSize: 10,
    color: "#64748B",
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  statusPill: {
    backgroundColor: "rgba(30, 158, 115, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(30, 158, 115, 0.25)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    color: "#0B6B4B",
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 14,
    rowGap: 6,
    alignItems: "center",
    marginTop: 8,
  },
  metaText: {
    fontSize: 11,
    color: "#475569",
  },
  routeCompact: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.14)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  routeLine: {
    flex: 1,
    fontSize: 11,
    color: "#334155",
  },
  routeArrow: {
    marginHorizontal: 8,
    color: "#0E9F6E",
    fontSize: 14,
    fontWeight: "700",
  },
  footerRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(15, 23, 42, 0.06)",
    paddingTop: 10,
  },
  viewDetailsText: {
    fontSize: 11,
    color: "#0B6B4B",
    fontWeight: "600",
    flex: 1,
  },
  chevronBadge: {
    width: 26,
    height: 26,
    borderRadius: 999,
    backgroundColor: "rgba(30, 158, 115, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  chevron: {
    fontSize: 20,
    lineHeight: 22,
    color: "#0B6B4B",
    fontWeight: "700",
    marginTop: -1,
  },
});
