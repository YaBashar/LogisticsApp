import { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { axiosPrivate } from "@/services/axios";
import { font } from "../styles/font";
import ShipmentCard from "../components/shipmentCard";

const PAGE_LIMIT = 3;

export function OrdersListSection({ endpoint, emptyMessage, showRefreshControl, showNewOrderCta }) {
  const { width } = useWindowDimensions();
  const contentMaxWidth = Math.min(420, width - 32);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const fetchShipments = async () => {
      if (!hasMore) return;
      if (isCancelled) return;
      setLoading(true);
      try {
        const res = await axiosPrivate.get(`${endpoint}?page=${page}&limit=${PAGE_LIMIT}`);
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

    fetchShipments();
    return () => {
      isCancelled = true;
    };
  }, [page, hasMore, endpoint]);

  const loadMore = () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setPage((prev) => prev + 1);
  };

  const onRefresh = async () => {
    if (!showRefreshControl) return;
    setRefreshing(true);
    setShipments([]);
    setPage(1);
    setHasMore(true);
    setRefreshing(false);
  };

  return (
    <View style={orderListStyles.screen}>
      {loading && page === 1 && shipments.length === 0 ? (
        <View style={orderListStyles.loadingWrap}>
          <ActivityIndicator size="large" color="#004F3B" />
          <Text style={[font, orderListStyles.loadingText]}>Loading orders...</Text>
        </View>
      ) : (
        <View style={[orderListStyles.content, { width: contentMaxWidth }]}>
          <View style={orderListStyles.listCard}>
            {shipments.length === 0 && !loading ? (
              <View style={orderListStyles.emptyState}>
                <Image
                  source={require("../assets/images/idleBox.png")}
                  style={orderListStyles.emptyImage}
                />
                <Text style={[font, orderListStyles.emptyText]}>{emptyMessage}</Text>
              </View>
            ) : null}

            <FlatList
              data={shipments}
              renderItem={({ item }) => <ShipmentCard shipment={item} />}
              keyExtractor={(item) => item._id}
              onEndReached={loadMore}
              onEndReachedThreshold={0.1}
              ListFooterComponent={
                loading && shipments.length > 0 ? <ActivityIndicator size="large" /> : null
              }
              refreshControl={
                showRefreshControl ? (
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                ) : undefined
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={
                shipments.length === 0 ? undefined : orderListStyles.listContentContainer
              }
            />
          </View>

          {showNewOrderCta ? (
            <Pressable
              onPress={() => router.push("/newOrder")}
              style={({ pressed }) => [
                orderListStyles.primaryButton,
                { opacity: pressed ? 0.92 : 1 },
              ]}
            >
              <Text style={[font, orderListStyles.primaryButtonText]}>Request New Order</Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </View>
  );
}

const orderListStyles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    backgroundColor: "#CFEFE1",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  content: {
    flex: 1,
    alignSelf: "center",
    paddingBottom: 22,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
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
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 14,
    paddingHorizontal: 18,
    color: "#0F172A",
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
