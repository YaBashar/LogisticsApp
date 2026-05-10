import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "../../services/axios";
import { router } from "expo-router";
import { font } from "../../styles/font";
import PasswordInput from "../../components/inputs/PasswordInput";

// Minor UI
// Show error when password doesnt match ruleset
// Show error when email is not valid

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEmailValid = /\S+@\S+\.\S+/.test(email.trim());
  const isPasswordValid = password.length >= 8;
  const canSubmit =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    isEmailValid &&
    isPasswordValid &&
    !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) {
      setErrorMessage("Fill all fields, use a valid email, and password of at least 8 characters.");
      return;
    }
    try {
      setErrorMessage("");
      setIsSubmitting(true);
      await axios.post("/auth/register", {
        firstName,
        lastName,
        password,
        email,
      });
      alert(`Signed Up Successfully, Please Verify Email to Continue`);
      router.push("/auth/verifyEmail");
    } catch (error) {
      console.log("Sign up error:", error);
      const backendMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Sign up failed. Please try again.";
      setErrorMessage(backendMessage);
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
            <Text style={[font, styles.title]}>Create your account</Text>
            <Text style={[font, styles.subtitle]}>Get started with secure shipment tracking.</Text>

            <View style={styles.form}>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                style={styles.input}
                placeholder="Enter your First name"
                placeholderTextColor="#A6A09B"
              ></TextInput>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                style={styles.input}
                placeholder="Enter your Last name"
                placeholderTextColor="#A6A09B"
              ></TextInput>
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholder="Enter your Email"
                placeholderTextColor="#A6A09B"
                keyboardType="email-address"
                autoCapitalize="none"
              ></TextInput>

              <PasswordInput setPassword={setPassword} password={password}></PasswordInput>
            </View>

            <Text style={styles.helperText}>By continuing, you agree to terms and policy.</Text>
            {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

            <Pressable
              onPress={handleSubmit}
              style={[styles.button, !canSubmit && styles.buttonDisabled]}
            >
              <Text style={[font, styles.buttonText]}>
                {isSubmitting ? "Creating account..." : "Create account"}
              </Text>
            </Pressable>

            <Pressable onPress={() => router.push("/auth/login")}>
              <Text style={[font, styles.switchText]}>Already Have an account?</Text>
              <Text style={[font, styles.switchAction]}>Login</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    color: "#065F46",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#0E9F6E",
    marginTop: 6,
    marginBottom: 18,
    textAlign: "center",
  },
  form: {
    gap: 14,
    width: "100%",
  },
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
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: "#0E9F6E",
    paddingVertical: 14,
    borderRadius: 16,
    width: "100%",
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
    marginTop: 10,
    fontSize: 14,
  },
  helperText: {
    fontSize: 12,
    color: "#065F46",
    marginTop: 14,
    textAlign: "center",
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
  switchText: {
    textAlign: "center",
    fontSize: 16,
    color: "#064E3B",
  },
  switchAction: {
    color: "#0E9F6E",
    textAlign: "center",
    fontSize: 18,
    textDecorationLine: "underline",
  },
});
