import { useEffect } from "react";
import { View, Pressable, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { font } from "../styles/font";
import { router } from "expo-router";
import useAuth from "../hooks/useAuth";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace("/profile");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007A55"></ActivityIndicator>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={[font, styles.title]}>Shipping App</Text>
        <Text style={[font, styles.subtitle]}>Track your packages with ease</Text>
      </View>

      <View style={styles.imageCard}>
        <Image source={require("../assets/images/LandingImage.png")} style={styles.image} />
      </View>

      <View style={styles.actionArea}>
        <Pressable onPress={() => router.push("auth/register")} style={styles.buttonLight}>
          <Text style={[font, styles.primaryButtonText]}>Create account</Text>
        </Pressable>

        <Pressable onPress={() => router.push("auth/login")} style={styles.buttonDark}>
          <Text style={[font, styles.secondaryButtonText]}>Login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
  },
  hero: {
    alignItems: "center",
    marginTop: 16,
  },
  title: {
    fontSize: 40,
    fontFamily: "Inter-Bold",
    color: "#065F46",
  },
  subtitle: {
    fontSize: 16,
    color: "#0E9F6E",
    textAlign: "center",
    marginTop: 8,
  },
  imageCard: {
    width: "100%",
    flex: 1,
    marginTop: 22,
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#BFE9D6",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  actionArea: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  buttonLight: {
    backgroundColor: "#0E9F6E",
    paddingVertical: 14,
    borderRadius: 16,
    width: "100%",
  },
  buttonDark: {
    backgroundColor: "#F8FFFC",
    paddingVertical: 14,
    borderColor: "#0E9F6E",
    borderWidth: 1,
    borderRadius: 16,
    width: "100%",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 19,
  },
  secondaryButtonText: {
    color: "#065F46",
    textAlign: "center",
    fontSize: 19,
  },
});
