import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useState, useEffect } from "react";
import { axiosPrivate } from "@/services/axios";
import { font } from "../styles/font";
import { router } from "expo-router";
import ShipmentCard from "./shipmentCard";

export default function ActiveOrders() {
  const { width } = useWindowDimensions();
  const contentMaxWidth = Math.min(420, width - 32);
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
        const res = await axiosPrivate.get(`/shipments-customer/active?page=${page}&limit=2`);
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
    <View style={styles.screen}>
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#004F3B" />
          <Text style={[font, { marginTop: 10, color: "#666", fontSize: 14 }]}>
            Loading orders...
          </Text>
        </View>
      ) : (
        <View style={[styles.content, { width: contentMaxWidth }]}>
          <View style={styles.listCard}>
            {shipments.length === 0 && (
              <View style={styles.emptyState}>
                <Image source={require("../assets/images/idleBox.png")} style={styles.emptyImage} />
                <Text
                  style={[
                    font,
                    {
                      fontSize: 18,
                      textAlign: "center",
                      marginTop: 14,
                      paddingHorizontal: 18,
                      color: "#0F172A",
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
              ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={
                shipments.length === 0 ? undefined : styles.listContentContainer
              }
            />
          </View>

          <Pressable
            onPress={() => router.push("/newOrder")}
            style={({ pressed }) => [
              styles.primaryButton,
              { opacity: pressed ? 0.92 : 1 },
            ]}
          >
            <Text style={[font, styles.primaryButtonText]}>Request New Order</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#CFEFE1",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  content: {
    flex: 1,
    alignSelf: "center",
    paddingBottom: 22, // keeps CTA above Android bottom navigation area
  },
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(0,79,59,0.18)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  listContentContainer: {
    paddingBottom: 10,
  },
  emptyState: {
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    margin: 6,
  },
  emptyImage: {
    width: 164,
    height: 164,
    borderRadius: 18,
  },
  primaryButton: {
    marginTop: 14,
    marginBottom: 8,
    borderRadius: 18,
    backgroundColor: "#1E9E73",
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
