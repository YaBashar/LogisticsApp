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
import { router } from "expo-router";
import { font } from "../../styles/font";
import NumericalCodeInput from "../../components/inputs/NumericalCodeInput";
import axios from "../../services/axios";

export default function VerifyEmail() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const joinedCode = code.join("");
  const canSubmit = /^\d{6}$/.test(joinedCode) && !isSubmitting;

  const handleVerify = async () => {
    if (!canSubmit) {
      setErrorMessage("Enter the 6-digit verification code.");
      return;
    }
    try {
      setErrorMessage("");
      setIsSubmitting(true);
      const verificationCode = joinedCode;
      await axios.post("/auth/verify-email", { verificationCode });
      alert("Email Verified Successfully! You can now log in.");
      router.push("/auth/login");
    } catch (error) {
      console.log("Verification Error:", error);
      setErrorMessage("Verification failed. Please check the code and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    router.push("/auth/resendVerification");
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

            <Text style={[font, styles.title]}>Verify Account</Text>
            <Text style={[font, styles.subtitle]}>
              Enter the code sent to your email to verify.
            </Text>

            <NumericalCodeInput code={code} setCode={setCode} />
            {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

            <View style={styles.actionArea}>
              <Pressable
                onPress={handleVerify}
                style={[styles.button, !canSubmit && styles.buttonDisabled]}
              >
                <Text style={[font, styles.buttonText]}>
                  {isSubmitting ? "Verifying..." : "Verify Email"}
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
  button: {
    backgroundColor: "#0E9F6E",
    paddingVertical: 14,
    borderRadius: 16,
    width: "100%",
  },
  resendButton: {
    backgroundColor: "#F8FFFC",
    paddingVertical: 14,
    borderColor: "#0E9F6E",
    borderWidth: 2,
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
