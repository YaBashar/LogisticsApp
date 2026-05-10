import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { font } from "../../styles/font";
import NumericalCodeInput from "../../components/inputs/NumericalCodeInput";

import axios from "../../services/axios";

export default function VerifyResetCode() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { email } = useLocalSearchParams();
  const joinedCode = code.join("");
  const canVerify = /^\d{6}$/.test(joinedCode) && !isSubmitting;

  const handleVerify = async () => {
    if (!canVerify) {
      setErrorMessage("Enter the 6-digit reset code.");
      return;
    }
    try {
      setErrorMessage("");
      setIsSubmitting(true);
      const resetCode = joinedCode;
      await axios.post("/auth/verify-reset-code", { resetCode });
      alert("Email Verified Successfully! You can now reset your password.");
      router.push({
        pathname: "/auth/resetPassword",
        params: { resetCode },
      });
    } catch (error) {
      console.log("Verification Error:", error);
      setErrorMessage("Verification failed. Please check the code and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      await axios.post("/auth/resend-reset-code", { email });
      alert("Reset code resent to your email.");
    } catch (error) {
      console.log("Resend Error:", error);
      alert("Failed to resend reset code. Please try again later.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Image source={require("../../assets/images/Key.png")} style={styles.image} />

            <Text style={[font, styles.title]}>Forgot Password</Text>
            <Text style={[font, styles.subtitle]}>
              Enter the code sent to your email to reset password.
            </Text>

            <NumericalCodeInput code={code} setCode={setCode} />
            {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

            <View style={styles.actionArea}>
              <Pressable
                onPress={handleVerify}
                style={[styles.verifyButton, !canVerify && styles.buttonDisabled]}
              >
                <Text style={[font, styles.buttonText]}>
                  {isSubmitting ? "Verifying..." : "Verify Code"}
                </Text>
              </Pressable>

              <Pressable onPress={handleResend} style={styles.resendButton}>
                <Text style={[font, styles.resendText]}>Resend Code</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  card: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#BFE9D6",
    paddingHorizontal: 18,
    paddingVertical: 22,
    alignItems: "center",
  },
  image: {
    width: 84,
    height: 84,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    color: "#065F46",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#0E9F6E",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 8,
    width: "100%",
  },
  actionArea: {
    width: "100%",
    gap: 10,
    marginTop: 18,
  },
  verifyButton: {
    backgroundColor: "#0E9F6E",
    paddingVertical: 14,
    borderRadius: 16,
    width: "100%",
  },
  resendButton: {
    backgroundColor: "#F8FFFC",
    paddingVertical: 14,
    borderColor: "#0E9F6E",
    borderWidth: 1,
    borderRadius: 16,
    width: "100%",
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 19,
  },
  resendText: {
    color: "#065F46",
    textAlign: "center",
    fontSize: 19,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  errorText: {
    color: "#B42318",
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    width: "100%",
  },
});
