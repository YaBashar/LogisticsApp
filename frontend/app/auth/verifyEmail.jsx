import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { router } from "expo-router";
import { font } from "../../styles/font";
import NumericalCodeInput from "../../components/inputs/NumericalCodeInput";
import axios from "../../services/axios";

export default function VerifyEmail() {
  // Call verifyEmail endpoint
  // If successful go to login page.

  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const handleVerify = async () => {
    const verificationCode = code.join("");
    console.log("Verification Code:", verificationCode);
    try {
      await axios.post("/auth/verify-email", { verificationCode });
      alert("Email Verified Successfully! You can now log in.");
      router.push("/auth/login");
    } catch (error) {
      console.log("Verification Error:", error);
      alert("Verification Failed. Please check the code and try again.", verificationCode);
    }
  };

  const handleResend = async () => {
    router.push("/auth/resendVerification");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/Key.png")}
        style={{ width: 100, height: 100, marginTop: 100, marginBottom: 10 }}
      />

      <Text
        style={[
          font,
          {
            fontSize: 25,
            color: "#004F3B",
            marginTop: 10,
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
            textAlign: "center",
          },
        ]}
      >
        Enter the code sent to your email to verify
      </Text>

      <NumericalCodeInput code={code} setCode={setCode} />

      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 15,
          marginTop: 30,
        }}
      >
        <Pressable onPress={handleVerify} style={styles.button}>
          <Text style={[font, { color: "#004F3B", textAlign: "center", fontSize: 20 }]}>
            Verify Email
          </Text>
        </Pressable>

        <Pressable onPress={handleResend} style={styles.resendButton}>
          <Text style={[font, { color: "#004F3B", textAlign: "center", fontSize: 20 }]}>
            Resend Code
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  },

  resendButton: {
    backgroundColor: "#F5F5F4",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: "#004F3B",
    borderWidth: 1,
    borderRadius: 15,
    width: "85%",
  },
});
