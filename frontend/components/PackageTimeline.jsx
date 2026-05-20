import { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import useAuth from "@/hooks/useAuth";
import useAdvanceShipmentStatus from "@/hooks/useAdvanceShipmentStatus";
import { ShipmentStatus, STATES_ORDERED } from "@/constants/shipmentStatus";
import { font } from "../styles/font";

/** Maps each status step to Shipment date fields (matches shipmentsModel). */
const STEP_DATE_KEY = {
  [ShipmentStatus.Pending]: "dateSubmitted",
  [ShipmentStatus.Picked]: "datePicked",
  [ShipmentStatus.Shipped]: "dateShipped",
  [ShipmentStatus.Delivered]: "dateDelivered",
  [ShipmentStatus.Received]: "dateReceived",
};

function parseShipmentDate(value) {
  if (value == null || value === "") return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatCompletedStepDateTime(value) {
  const d = parseShipmentDate(value);
  if (!d) return null;
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function PackageTimeline({
  status: statusProp,
  variant = "compact",
  shipment,
  onStatusChange,
}) {
  const { role } = useAuth();
  const isAdminDetailed = role === "admin" && variant === "detailed" && Boolean(shipment?._id);

  const {
    status: managedStatus,
    updating,
    canAdvance,
    advanceStatus,
  } = useAdvanceShipmentStatus(shipment?._id ?? "", statusProp);

  const status = isAdminDetailed ? managedStatus : statusProp;

  useEffect(() => {
    if (isAdminDetailed && onStatusChange) {
      onStatusChange(managedStatus);
    }
  }, [isAdminDetailed, managedStatus, onStatusChange]);

  const icons = ["🕛", "🛻", "✈️", "🚚", "✅"];
  const stepHelp = {
    [ShipmentStatus.Pending]: "Order is confirmed and waiting for pickup.",
    [ShipmentStatus.Picked]: "Courier has picked up the package.",
    [ShipmentStatus.Shipped]: "Package is currently in transit.",
    [ShipmentStatus.Delivered]: "Package reached destination address.",
    [ShipmentStatus.Received]: "Recipient confirmed package receipt.",
  };

  const currentStatusIndex = STATES_ORDERED.findIndex(
    (state) => state.toLowerCase() === String(status).toLowerCase()
  );
  /** Unknown status falls back to treating timeline as at Pending (matches detailed branch). */
  const activeIndex = currentStatusIndex >= 0 ? currentStatusIndex : 0;

  if (variant === "detailed") {
    return (
      <View style={styles.detailedWrap}>
        {STATES_ORDERED.map((state, index) => {
          const isCompleted = index <= activeIndex;
          const isCurrent = index === activeIndex;
          const dateKey = STEP_DATE_KEY[state];
          const rawDate = shipment?.[dateKey];
          const completedAt =
            isCompleted && rawDate != null ? formatCompletedStepDateTime(rawDate) : null;

          const isPastCompleted = index < activeIndex;

          return (
            <View
              key={state}
              style={[
                styles.detailRow,
                isPastCompleted && styles.detailRowCompleted,
                isCurrent && styles.detailRowCurrent,
              ]}
            >
              <View style={styles.detailRail}>
                <View
                  style={[
                    styles.detailDot,
                    isCompleted ? styles.dotOn : styles.dotOff,
                    isCurrent && styles.detailDotCurrent,
                    isPastCompleted && styles.detailDotCompleted,
                  ]}
                >
                  <Text style={styles.detailIcon}>{icons[index]}</Text>
                </View>
                {index !== STATES_ORDERED.length - 1 && (
                  <View
                    style={[
                      styles.detailConnector,
                      isCompleted ? styles.connectorOn : styles.connectorOff,
                    ]}
                  />
                )}
              </View>

              <View style={styles.detailTextWrap}>
                <Text
                  style={[
                    styles.detailTitle,
                    isPastCompleted && styles.detailTitleCompleted,
                    isCurrent && styles.detailTitleCurrent,
                    !isCompleted && styles.detailTitleUpcoming,
                  ]}
                >
                  {state}
                </Text>
                <Text
                  style={[
                    styles.detailSubtitle,
                    isPastCompleted && styles.detailSubtitleCompleted,
                    !isCompleted && !isCurrent && styles.detailSubtitleUpcoming,
                  ]}
                >
                  {stepHelp[state]}
                </Text>
                {completedAt ? (
                  <Text
                    style={[
                      styles.detailCompletedAt,
                      isPastCompleted && styles.detailCompletedAtEmphasis,
                    ]}
                  >
                    {completedAt}
                  </Text>
                ) : null}
              </View>
            </View>
          );
        })}

        {isAdminDetailed ? (
          <Pressable
            onPress={advanceStatus}
            disabled={updating || !canAdvance}
            style={({ pressed }) => [
              styles.updateButton,
              (!canAdvance || updating) && styles.updateButtonDisabled,
              pressed && canAdvance && !updating && styles.updateButtonPressed,
            ]}
          >
            <Text style={[font, styles.updateButtonText]}>
              {updating
                ? "Updating..."
                : canAdvance
                  ? "Update to Next Status"
                  : "Shipment Complete"}
            </Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {STATES_ORDERED.map((state, index) => {
          const isCompleted = index <= activeIndex;
          const isCurrent = index === activeIndex;

          return (
            <View key={index} style={styles.step}>
              <View style={styles.stepTop}>
                {index !== 0 && (
                  <View
                    style={[
                      styles.connector,
                      isCompleted ? styles.connectorOn : styles.connectorOff,
                    ]}
                  />
                )}
                <View
                  style={[
                    styles.dot,
                    isCompleted ? styles.dotOn : styles.dotOff,
                    isCurrent ? styles.dotCurrent : null,
                  ]}
                >
                  <Text style={styles.icon}>{icons[index]}</Text>
                </View>
                {index !== STATES_ORDERED.length - 1 && (
                  <View
                    style={[
                      styles.connector,
                      index < activeIndex ? styles.connectorOn : styles.connectorOff,
                    ]}
                  />
                )}
              </View>
              <Text
                numberOfLines={1}
                style={[styles.label, isCompleted ? styles.labelOn : styles.labelOff]}
              >
                {state}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 10,
    padding: 10,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  step: {
    flex: 1,
    alignItems: "center",
    minWidth: 0,
  },
  stepTop: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  connector: {
    flex: 1,
    height: 2,
    borderRadius: 999,
    marginHorizontal: 4,
  },
  connectorOn: {
    backgroundColor: "rgba(30, 158, 115, 0.65)",
  },
  connectorOff: {
    backgroundColor: "rgba(148, 163, 184, 0.45)",
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  dotOn: {
    backgroundColor: "#1E9E73",
    borderColor: "rgba(30, 158, 115, 0.35)",
  },
  dotOff: {
    backgroundColor: "#E2E8F0",
    borderColor: "rgba(148, 163, 184, 0.55)",
  },
  dotCurrent: {
    transform: [{ scale: 1.04 }],
  },
  icon: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  label: {
    marginTop: 8,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
  labelOn: {
    color: "#0F172A",
  },
  labelOff: {
    color: "#64748B",
  },
  detailedWrap: {
    marginTop: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 58,
    borderRadius: 10,
    paddingRight: 4,
  },
  detailRowCompleted: {
    backgroundColor: "rgba(30, 158, 115, 0.06)",
  },
  detailRowCurrent: {
    backgroundColor: "rgba(30, 158, 115, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(30, 158, 115, 0.18)",
  },
  detailRail: {
    width: 30,
    alignItems: "center",
  },
  detailDot: {
    width: 24,
    height: 24,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  detailDotCompleted: {
    width: 26,
    height: 26,
    backgroundColor: "#15803D",
    borderColor: "rgba(21, 128, 61, 0.4)",
  },
  detailDotCurrent: {
    width: 28,
    height: 28,
    borderWidth: 2.5,
    borderColor: "#0B6B4B",
    shadowColor: "#1E9E73",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  detailIcon: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  detailConnector: {
    width: 2,
    flex: 1,
    marginTop: 4,
    borderRadius: 999,
  },
  detailTextWrap: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 12,
  },
  detailTitle: {
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "700",
  },
  detailTitleCompleted: {
    color: "#0B6B4B",
    fontWeight: "800",
  },
  detailTitleCurrent: {
    color: "#065F46",
    fontWeight: "800",
  },
  detailTitleUpcoming: {
    color: "#94A3B8",
    fontWeight: "600",
  },
  detailSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#64748B",
  },
  detailSubtitleCompleted: {
    color: "#475569",
  },
  detailSubtitleUpcoming: {
    color: "#94A3B8",
  },
  detailCompletedAt: {
    marginTop: 6,
    fontSize: 12,
    color: "#334155",
    fontWeight: "600",
  },
  detailCompletedAtEmphasis: {
    color: "#0B6B4B",
    fontWeight: "700",
  },
  updateButton: {
    marginTop: 14,
    borderRadius: 14,
    backgroundColor: "#0B6B4B",
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  updateButtonPressed: {
    opacity: 0.9,
  },
  updateButtonDisabled: {
    backgroundColor: "#94A3B8",
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
