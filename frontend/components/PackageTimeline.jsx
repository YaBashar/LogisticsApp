import { View, Text } from "react-native";

export default function PackageTimeline() {
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
        {/* Step 1 - Pending */}
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#F59E0B",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#FFF", fontSize: 16 }}>⏱</Text>
          </View>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: "#111827",
              marginTop: 6,
            }}
          >
            Pending
          </Text>
        </View>

        {/* Connector 1 */}
        <View
          style={{
            flex: 1,
            height: 2,
            backgroundColor: "#F59E0B",
            marginHorizontal: 4,
          }}
        />

        {/* Step 2 - Picked */}
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#E5E7EB",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text style={{ color: "#FFF", fontSize: 16 }}>📦</Text>
          </View>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: "#111827",
              marginTop: 6,
            }}
          >
            Picked
          </Text>
        </View>

        {/* Connector 2 */}
        <View
          style={{
            flex: 1,
            height: 2,
            backgroundColor: "#E5E7EB",
            marginHorizontal: 4,
          }}
        />

        {/* Step 3 - Packed */}
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#E5E7EB",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#9CA3AF", fontSize: 16 }}>📦</Text>
          </View>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: "#9CA3AF",
              marginTop: 6,
            }}
          >
            Packed
          </Text>
        </View>

        {/* Connector 3 */}
        <View
          style={{
            flex: 1,
            height: 2,
            backgroundColor: "#E5E7EB",
            marginHorizontal: 4,
          }}
        />

        {/* Step 4 - Shipped */}
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#E5E7EB",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#9CA3AF", fontSize: 16 }}>🚚</Text>
          </View>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: "#9CA3AF",
              marginTop: 6,
            }}
          >
            Shipped
          </Text>
        </View>

        {/* Connector 4 */}
        <View
          style={{
            flex: 1,
            height: 2,
            backgroundColor: "#E5E7EB",
            marginHorizontal: 4,
          }}
        />

        {/* Step 5 - Delivered */}
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#E5E7EB",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#9CA3AF", fontSize: 16 }}>✓</Text>
          </View>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: "#9CA3AF",
              marginTop: 6,
            }}
          >
            Done
          </Text>
        </View>
      </View>
    </View>
  );
}
