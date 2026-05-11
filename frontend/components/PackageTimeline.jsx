import { View, Text, StyleSheet } from "react-native";

export default function PackageTimeline({ status }) {
  const states = ["Pending", "Picked", "Shipped", "Delivered", "Received"];
  const icons = ["🕛", "🛻", "✈️", "🚚", "✅"];

  const currentStatusIndex = states.findIndex(
    (state) => state.toLowerCase() === status.toLowerCase()
  );

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
});
