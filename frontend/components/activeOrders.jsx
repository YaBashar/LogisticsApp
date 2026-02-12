import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useState, useEffect } from "react";
import axiosPrivate from "@/services/axios";
import { font } from "../styles/font";
import { router } from "expo-router";
import ShipmentCard from "./shipmentCard";

export default function ActiveOrders() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const fetchActiveShipments = async () => {
      if (!hasMore) return;
      if (isCancelled) return;
      setLoading(true);
      try {
        const res = await axiosPrivate.get(
          `/shipments-customer/active?page=${page}&limit=2`
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
  }, [page, hasMore]);

  const loadMore = () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setPage((prev) => prev + 1);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setShipments([]);
    setPage(1);
    setHasMore(true);
    // The useEffect will re-fetch
    setRefreshing(false);
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
        <>
          <View
            style={{
              height: 485,
              width: 320,
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
                  marginVertical: 10,
                  height: 465,
                  width: "90%",
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
                  No Orders Yet, Your orders will show up here
                </Text>
              </View>
            )}

            <FlatList
              data={shipments}
              renderItem={({ item }) => <ShipmentCard shipment={item} />}
              keyExtractor={(item) => item._id}
              onEndReached={loadMore}
              onEndReachedThreshold={0.1}
              ListFooterComponent={
                loading ? <ActivityIndicator size="large" /> : null
              }
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </View>

          <Pressable
            onPress={() => router.push("/newOrder")}
            style={{
              marginTop: 20,
              marginBottom: 50,
              backgroundColor: "#A4F4CF",
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderRadius: 15,
              width: 250,
            }}
          >
            <Text
              style={[
                font,
                { color: "004F3B", textAlign: "center", fontSize: 20 },
              ]}
            >
              Request New Order
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
