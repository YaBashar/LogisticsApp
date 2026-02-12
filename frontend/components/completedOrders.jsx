import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { font } from "../styles/font";
import { axiosPrivate } from '../services/axios';
import ShipmentCard from "./shipmentCard";

export default function CompletedOrders() {
  const [shipments, setShipments] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);


  useEffect(() => {
    let isCancelled = false;

    const fetchActiveShipments = async () => {
      if (!hasMore) return;
      if (loading) return;
      setLoading(true);

      try {
        const res = await axiosPrivate.get(
          `/shipments-customer/completed?page=${page}&limit=3`
        );
        const result = res.data.result;

        if (isCancelled) return;

        if (!result || result.length === 0) {
          setHasMore(false);
        } else {
          setShipments((prev) => [...prev, ...result]);
        }
      } catch (error) {
        if (!isCancelled) console.error(error);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchActiveShipments();
    return () => {
      isCancelled = true;
    };
  }, [page]);

  const loadMore = () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setPage((prev) => prev + 1);
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#004F3B" />
          <Text style={[font, { marginTop: 10, color: "#666", fontSize: 14 }]}>
            Loading orders...
          </Text>
        </View>
      ) : (
        <View
          style={{
            height: 480,
            width: 300,
            backgroundColor: "#ECFDF5",
            borderRadius: 10,
            justifyContent: "flex-start",
            alignItems: "center",
            borderWidth: 2,
            borderColor: "#004F3B",
          }}
        >
          {shipments.length === 0 && (
            <View
              style={{
                marginTop: 20,
                height: 440,
                width: 275,
                backgroundColor: "#F3F3F4",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20,
              }}
            >
              <Image
                source={require("../assets/images/idleBox.png")}
                style={{ width: 200, height: 200, borderRadius: 20 }}
              />
              <Text
                style={[
                  font,
                  {
                    fontSize: 24,
                    textAlign: "center",
                    marginTop: 20,
                    padding: 30,
                  },
                ]}
              >
                Your Completed Orders will show up here
              </Text>
            </View>
          )}

          <FlatList
            data={shipments}
            renderItem={(item) => {
              <ShipmentCard shipment={item} />;
            }}
            keyExtractor={(item) => item._id}
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              loading ? <ActivityIndicator size="large" /> : null
            }
          />
        </View>
      )}
    </View>
  );
}
