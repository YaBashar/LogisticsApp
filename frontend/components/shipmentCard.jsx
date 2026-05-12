import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Alert,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useState } from "react";
import { font } from "../styles/font";
import useAuth from "../hooks/useAuth";
import { axiosPrivate } from "../services/axios";
import { router } from "expo-router";

export default function ShipmentCard({ shipment }) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(420, width - 32);
  const { role } = useAuth();

  const states = ["Pending", "Picked", "Shipped", "Delivered", "Received"];
  const [currentStatus, setCurrentStatus] = useState(shipment.status);
  const [updating, setUpdating] = useState(false);

  // Update to show linear travel from origin to destination
  // Show update functionality for admin

  const handleUpdateStatus = () => {
    const currentIndex = states.indexOf(currentStatus);
    if (currentIndex === states.length - 1) {
      Alert.alert("Info", "Package is already Delivered");
    }

    const nextStatus = states[currentIndex + 1];
    Alert.alert("Update Status", `Update status from "${currentStatus}" to "${nextStatus}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Update",
        onPress: async () => {
          setUpdating(true);
          try {
            await axiosPrivate.put(`/shipments-admin/${shipment._id}/status`, {
              status: nextStatus,
            });
            setCurrentStatus(nextStatus);
            Alert.alert(
              "Success",
              "Status updated successfully \n Customer has been notified of update"
            );
          } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to update status");
          } finally {
            setUpdating(false);
          }
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      key={shipment._id}
      activeOpacity={0.78}
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
            <View style={{ flex: 1 }}>
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

          <View style={styles.actionsRow}>
            <Text style={[font, styles.viewDetailsText]}>Tap to view details and timeline</Text>
            {role === "admin" && (
              <Pressable
                onPress={handleUpdateStatus}
                disabled={updating}
                style={({ pressed }) => [
                  styles.adminButton,
                  { opacity: pressed || updating ? 0.9 : 1 },
                ]}
              >
                <Text style={[font, styles.adminButtonText]}>
                  {updating ? "Updating..." : "Next Status"}
                </Text>
              </Pressable>
            )}
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
    marginLeft: 10,
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
  actionsRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  viewDetailsText: {
    fontSize: 11,
    color: "#64748B",
    flex: 1,
  },
  adminButton: {
    borderRadius: 10,
    backgroundColor: "#0B6B4B",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  adminButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
