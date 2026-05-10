import axios from "@/services/axios";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "@/hooks/useAuth";
import { router } from "expo-router";
import { font } from "../../styles/font";
import PasswordInput from "../../components/inputs/PasswordInput";

// Minor UI
// Show error when password or email is wrong

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const isEmailValid = /\S+@\S+\.\S+/.test(email.trim());
  const canSubmit = isEmailValid && password.trim().length > 0 && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) {
      setErrorMessage("Enter a valid email and password.");
      return;
    }
    try {
      setErrorMessage("");
      setIsSubmitting(true);
      const response = await axios.post("/auth/login", { email, password });
      const { accessToken, refreshToken } = response.data;
      login(accessToken, refreshToken);
      router.push("/profile");
    } catch (error) {
      console.log("Login error:", error);
      setErrorMessage("Login failed. Please check your credentials and try again.");
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
            <Text style={[font, styles.title]}>Welcome Back</Text>
            <Text style={[font, styles.subtitle]}>Login to continue tracking your shipments.</Text>
            <View style={styles.formArea}>
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

              <Pressable>
                <Text
                  onPress={() => router.push("/auth/requestResetPassword")}
                  style={[font, styles.linkText]}
                >
                  Forgot your password?
                </Text>
              </Pressable>
            </View>
            {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

            <View style={styles.footer}>
              <Pressable
                onPress={handleSubmit}
                style={[styles.button, !canSubmit && styles.buttonDisabled]}
              >
                <Text style={[font, styles.buttonText]}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </Text>
              </Pressable>

              <Pressable onPress={() => router.push("/auth/register")}>
                <Text style={[font, styles.switchText]}>Dont Have an account?</Text>
                <Text style={[font, styles.switchAction]}>Sign Up</Text>
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
    marginTop: 10,
    marginBottom: 12,
    width: "100%",
    height: 56,
    borderColor: "#0E9F6E",
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: "#F8FFFC",
  },
  title: {
    fontSize: 30,
    color: "#065F46",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#0E9F6E",
    marginTop: 6,
    marginBottom: 18,
    fontSize: 15,
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
    borderWidth: 1,
    borderColor: "#BFE9D6",
    paddingHorizontal: 18,
    paddingVertical: 22,
  },
  formArea: {
    width: "100%",
  },
  linkText: {
    color: "#0E9F6E",
    textAlign: "left",
    fontSize: 15,
    marginLeft: 6,
    marginBottom: 14,
    marginTop: 8,
    textDecorationLine: "underline",
  },
  footer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 2,
  },
  button: {
    marginBottom: 20,
    marginTop: 4,
    backgroundColor: "#0E9F6E",
    paddingVertical: 14,
    borderRadius: 16,
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 19,
  },
  errorText: {
    color: "#B42318",
    textAlign: "center",
    marginTop: 2,
    marginBottom: 2,
    fontSize: 14,
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
