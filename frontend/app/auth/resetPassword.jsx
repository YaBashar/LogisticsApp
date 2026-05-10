import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { font } from "../../styles/font";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "../../services/axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetCode } = useLocalSearchParams();
  const canSubmit = password.trim().length >= 8 && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }
    try {
      setErrorMessage("");
      setIsSubmitting(true);
      await axios.post("/auth/reset-password", {
        resetCode,
        newPassword: password,
      });
      alert("Password Reset Successfully! You can now log in.");
      router.push("/auth/login");
    } catch (error) {
      console.log("Verification Error:", error);
      setErrorMessage("Password reset failed. Please try again.");
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
            <Image source={require("../../assets/images/Key.png")} style={styles.image} />

            <Text style={[font, styles.title]}>Reset Password</Text>
            <Text style={[font, styles.subtitle]}>
              Enter a strong new password and use it for your next login.
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry={true}
              placeholder="Enter your new password"
              placeholderTextColor="#A6A09B"
              autoCapitalize="none"
            ></TextInput>
            {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

            <View style={styles.actionArea}>
              <Pressable
                onPress={handleSubmit}
                style={[styles.button, !canSubmit && styles.buttonDisabled]}
              >
                <Text style={[font, styles.buttonText]}>
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </Text>
              </Pressable>
            </View>
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
  button: {
    backgroundColor: "#0E9F6E",
    paddingVertical: 14,
    borderRadius: 16,
    width: "100%",
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
    marginBottom: 18,
    width: "100%",
  },
  actionArea: {
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
    width: "100%",
  },
});
