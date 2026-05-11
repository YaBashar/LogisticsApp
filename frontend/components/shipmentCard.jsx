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
import PackageTimeline from "./PackageTimeline";
import { axiosPrivate } from "../services/axios";

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
    <>
      <TouchableOpacity key={shipment._id} activeOpacity={0.7}>
        <View style={[styles.card, { width: cardWidth }]}>
          {/* Main Card Content */}
          <View style={styles.cardInner}>
            {/* Header Row */}
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={[font, styles.orderNumber]}>#{shipment.orderNumber}</Text>
                <Text style={[font, styles.title]}>{shipment.itemDescription}</Text>

                <View style={styles.metaRow}>
                  <Text style={[font, styles.metaText]}>⚖️ {shipment.weight} kg</Text>
                  <Text style={[font, styles.metaText]}>
                    📦{" "}
                    {shipment.packageType.charAt(0).toUpperCase() + shipment.packageType.slice(1)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Route Display */}
            <View style={styles.routeWrap}>
              <Text style={[font, styles.routeLabel]}>📌 Origin</Text>
              <Text style={[font, styles.routeValue]}>{shipment.origin}</Text>
              <Text style={[font, styles.routeLabel]}>📌 Destination</Text>
              <Text style={[font, styles.routeValue]}>{shipment.destination}</Text>
            </View>

            {/*Package TimeLine*/}
            <PackageTimeline status={currentStatus} />

            {role === "admin" && (
              <Pressable
                onPress={handleUpdateStatus}
                disabled={updating}
                style={({ pressed }) => [
                  styles.adminButton,
                  { opacity: pressed || updating ? 0.92 : 1 },
                ]}
              >
                <Text style={[font, styles.adminButtonText]}>Update Status</Text>
              </Pressable>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </>
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
    padding: 12,
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
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
    letterSpacing: 0.1,
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
  routeWrap: {
    marginTop: 10,
    padding: 10,
    borderRadius: 14,
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.14)",
  },
  routeLabel: {
    fontSize: 10,
    color: "#0F172A",
    marginTop: 2,
  },
  routeValue: {
    fontSize: 10,
    color: "#475569",
    marginLeft: 2,
    marginBottom: 6,
  },
  adminButton: {
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: "#0B6B4B",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  adminButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
