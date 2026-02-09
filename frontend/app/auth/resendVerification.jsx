import { View, TextInput, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import axios from "../../services/axios";
import { router } from "expo-router";
import { font } from "../../styles/font";

export default function ResendVerification() {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    // Call resend verification endpoint
    try {
      await axios.post("/auth/resend-verification", { email });
      console.log("Email Sent");
      router.push("/auth/verifyEmail");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={[
          font,
          {
            marginTop: 100,
            fontSize: 25,
            color: "#004F3B",
            marginHorizontal: 10,
            textAlign: "center",
          },
        ]}
      >
        Verify Account
      </Text>
      <Text
        style={[
          font,
          {
            fontSize: 20,
            color: "#004F3B",
            width: 250,
            marginHorizontal: 10,
            marginBottom: 20,
            textAlign: "center",
          },
        ]}
      >
        Enter the email that you used for signup
      </Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder="Enter your Email"
      ></TextInput>

      <Pressable onPress={handleSubmit} style={styles.button}>
        <Text style={[font, { color: "004F3B", textAlign: "center", fontSize: 20 }]}>
          Resend Code
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "90%",
    height: 60,
    borderColor: "#004F3B",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
  },

  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
  },

  button: {
    backgroundColor: "#A4F4CF",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    width: "85%",
    marginTop: 25,
  },
});
