import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { axiosPrivate } from "@/services/axios";
import { ShipmentStatus, STATES_ORDERED } from "@/components/PackageTimeline";

export function coerceShipmentStatus(raw) {
  if (typeof raw !== "string") {
    return ShipmentStatus.Pending;
  }
  const allowed = Object.values(ShipmentStatus);
  return allowed.includes(raw) ? raw : ShipmentStatus.Pending;
}

export default function useAdvanceShipmentStatus(shipmentId, initialStatus) {
  const [status, setStatus] = useState(() => coerceShipmentStatus(initialStatus));
  const [updating, setUpdating] = useState(false);

  const currentIndex = STATES_ORDERED.indexOf(status);
  const isFinal = currentIndex === STATES_ORDERED.length - 1;
  const canAdvance = currentIndex >= 0 && !isFinal;

  const advanceStatus = useCallback(() => {
    if (!canAdvance) {
      Alert.alert("Info", "Shipment is already at the final status.");
      return;
    }

    const nextStatus = STATES_ORDERED[currentIndex + 1];

    Alert.alert("Update Status", `Update status from "${status}" to "${nextStatus}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Update",
        onPress: async () => {
          setUpdating(true);
          try {
            await axiosPrivate.put(`/shipments-admin/${shipmentId}/status`, {
              status: nextStatus,
            });
            setStatus(nextStatus);
            Alert.alert(
              "Success",
              "Status updated successfully.\nCustomer has been notified of the update."
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
  }, [canAdvance, currentIndex, shipmentId, status]);

  return { status, updating, canAdvance, advanceStatus, setStatus };
}
