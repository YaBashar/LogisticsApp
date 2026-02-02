import { View, Text } from "react-native";

export default function PackageTimeline({ status }) {
  const states = ["Pending", "Picked", "Shipped", "Delivered", "Received"];
  const icons = ["🕛", "🛻", "✈️", "🚚", "✅"];

  const currentStatusIndex = states.findIndex(
    (state) => state.toLowerCase() === status.toLowerCase()
  );

  return (
    <View style={{ padding: 10, backgroundColor: "#F9FAFB" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        {states.map((state, index) => {
          const isCompleted = index <= currentStatusIndex;

          return (
            <View key={index} style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: isCompleted ? "#10B981" : "#E5E7EB",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "#FFF", fontSize: 16 }}>
                  {icons[index]}
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "600",
                  color: "#111827",
                  marginTop: 6,
                }}
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
