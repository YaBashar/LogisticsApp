import { View, Text, StyleSheet } from "react-native";

export default function PackageTimeline({ status, variant = "compact" }) {
  const states = ["Pending", "Picked", "Shipped", "Delivered", "Received"];
  const icons = ["🕛", "🛻", "✈️", "🚚", "✅"];
  const stepHelp = {
    Pending: "Order is confirmed and waiting for pickup.",
    Picked: "Courier has picked up the package.",
    Shipped: "Package is currently in transit.",
    Delivered: "Package reached destination address.",
    Received: "Recipient confirmed package receipt.",
  };

  const currentStatusIndex = states.findIndex(
    (state) => state.toLowerCase() === status.toLowerCase()
  );
  const activeIndex = currentStatusIndex >= 0 ? currentStatusIndex : 0;

  if (variant === "detailed") {
    return (
      <View style={styles.detailedWrap}>
        {states.map((state, index) => {
          const isCompleted = index <= activeIndex;
          const isCurrent = index === activeIndex;
          return (
            <View key={state} style={styles.detailRow}>
              <View style={styles.detailRail}>
                <View style={[styles.detailDot, isCompleted ? styles.dotOn : styles.dotOff]}>
                  <Text style={styles.detailIcon}>{icons[index]}</Text>
                </View>
                {index !== states.length - 1 && (
                  <View
                    style={[
                      styles.detailConnector,
                      isCompleted ? styles.connectorOn : styles.connectorOff,
                    ]}
                  />
                )}
              </View>

              <View style={styles.detailTextWrap}>
                <Text style={[styles.detailTitle, isCurrent ? styles.detailTitleCurrent : null]}>
                  {state}
                </Text>
                <Text style={styles.detailSubtitle}>{stepHelp[state]}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {states.map((state, index) => {
          const isCompleted = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;

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
                {index !== states.length - 1 && (
                  <View
                    style={[
                      styles.connector,
                      index < currentStatusIndex ? styles.connectorOn : styles.connectorOff,
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
  detailTitleCurrent: {
    color: "#0B6B4B",
  },
  detailSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#64748B",
  },
});
