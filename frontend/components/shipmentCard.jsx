import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { useState } from "react";
import { font } from "../styles/font";
import useAuth from "../hooks/useAuth";
import PackageTimeline from "./PackageTimeline";

export default function ShipmentCard({ shipment }) {
  const { role } = useAuth();
  const states = ["Pending", "Picked", "Packed", "Shipped", "Delivered"];
  const [timeLine, setTimeline] = useState("Pending");

  // Update to show linear travel from origin to destination
  // Show update functionality for admin

  return (
    <>
      <TouchableOpacity key={shipment._id} activeOpacity={0.7}>
        <View
          style={{
            width: 275,
            backgroundColor: "white",
            marginTop: 10,
            marginHorizontal: 10,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#E5E5E5",
            overflow: "hidden",
          }}
        >
          {/* Main Card Content */}
          <View style={{ padding: 10 }}>
            {/* Header Row */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "flex-start",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    font,
                    { fontSize: 10, color: "#666", marginBottom: 4 },
                  ]}
                >
                  #{shipment.orderNumber}
                </Text>
                <Text
                  style={[
                    font,
                    {
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#1F2937",
                      marginBottom: 2,
                    },
                  ]}
                >
                  {shipment.itemDescription}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 24,
                  }}
                >
                  <Text style={[font, { fontSize: 11, color: "#666" }]}>
                    ⚖️ {shipment.weight} kg
                  </Text>
                  <Text style={[font, { fontSize: 11, color: "#666" }]}>
                    📦{" "}
                    {shipment.packageType.charAt(0).toUpperCase() +
                      shipment.packageType.slice(1)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Route Display */}
            <View style={{ flexDirection: "column", marginTop: 8 }}>
              <Text style={[font, { fontSize: 10 }]}>📌 Origin</Text>
              <Text
                style={[font, { fontSize: 10, color: "#666", marginLeft: 4 }]}
              >
                {shipment.origin}
              </Text>
              <Text style={[font, { fontSize: 10 }]}>📌 Destination</Text>
              <Text style={[font, { fontSize: 10, color: "#666" }]}>
                {shipment.destination}
              </Text>
            </View>

            {/*Package TimeLine*/}
            <PackageTimeline />

            {role === "admin" && (
              <Pressable>
                <Text
                  style={{
                    textAlign: "center",
                    padding: 10,
                    backgroundColor: "#004F3B",
                    color: "white",
                  }}
                >
                  Update Status
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}
