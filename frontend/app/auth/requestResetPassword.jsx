import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import axios from "../../services/axios";
import { router } from "expo-router";
import { font } from "../../styles/font";

export default function RequestResetPassword() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit = /\S+@\S+\.\S+/.test(email.trim()) && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) {
      setErrorMessage("Enter a valid email address.");
      return;
    }
    try {
      setErrorMessage("");
      setIsSubmitting(true);
      await axios.post("/auth/forgot-password", { email });
      router.push({
        pathname: "/auth/verifyResetCode",
        params: { email },
      });
    } catch (error) {
      console.log("Request reset error:", error);
      setErrorMessage("Could not send reset code. Please try again.");
    } finally {
      setIsSubmitting(false);
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
            <Text style={[font, styles.title]}>Forgot Password</Text>
            <Text style={[font, styles.subtitle]}>
              You will receive a 6 digit code to reset your password.
            </Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Enter your Email"
              placeholderTextColor="#A6A09B"
              keyboardType="email-address"
              autoCapitalize="none"
            ></TextInput>

            {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
            <Pressable
              onPress={handleSubmit}
              style={[styles.button, !canSubmit && styles.buttonDisabled]}
            >
              <Text style={[font, styles.buttonText]}>
                {isSubmitting ? "Sending code..." : "Reset Password"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 56,
    borderColor: "#0E9F6E",
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: "#F8FFFC",
  },
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
    borderWidth: 2,
    borderColor: "#BFE9D6",
    paddingHorizontal: 18,
    paddingVertical: 22,
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
    marginBottom: 18,
    marginTop: 6,
  },
  button: {
    backgroundColor: "#0E9F6E",
    paddingVertical: 14,
    borderRadius: 16,
    width: "100%",
    marginTop: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 19,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  errorText: {
    color: "#B42318",
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
  },
});
