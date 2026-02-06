import * as React from "react";
import { View, Pressable, Text, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { font } from "../styles/font";
import { router } from "expo-router";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={[font, styles.title]}>Shipping App</Text>
        <Text style={[font, { fontSize: 16, color: "#007A55", textAlign: "center" }]}>
          Track your packages with ease
        </Text>
      </View>

      <Image
        source={require("../assets/images/LandingImage.png")}
        style={{
          width: "75%",
          height: "50%",
          borderRadius: 20,
        }}
      />

      <View style={{ width: "100%", flexDirection: "column", alignItems: "center", gap: 15 }}>
        <Pressable onPress={() => router.push("auth/register")} style={styles.buttonLight}>
          <Text style={[font, { color: "#004F3B", textAlign: "center", fontSize: 20 }]}>
            Create account
          </Text>
        </Pressable>

        <Pressable onPress={() => router.push("auth/login")} style={styles.buttonDark}>
          <Text style={[font, { color: "004F3B", textAlign: "center", fontSize: 20 }]}>Login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: "80%",
    marginTop: 50,
  },

  title: {
    fontSize: 45,
    fontFamily: "Inter-Bold",
    color: "#004F3B",
  },

  buttonLight: {
    backgroundColor: "#A4F4CF",
    padding: 10,
    borderRadius: 15,
    width: "50%",
  },

  buttonDark: {
    backgroundColor: "#F5F5F4",
    padding: 10,
    borderColor: "#004F3B",
    borderWidth: 1,
    borderRadius: 15,
    width: "50%",
  },
});
