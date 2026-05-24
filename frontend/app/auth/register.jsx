import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "../../services/axios";
import { router } from "expo-router";
import { PasswordInput } from "../../components/inputs/PasswordInput";
import { colors, spacing, typography, radii, touch, shadows } from "../../constants/theme";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

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
      setErrorMessage(
        "Fill all fields, use a valid email, and a password of at least 8 characters."
      );
      return;
    }
    try {
      setErrorMessage("");
      setIsSubmitting(true);
      await axios.post("/auth/register", { firstName, lastName, password, email: email.trim() });
      Alert.alert("Account created", "Please verify your email to continue.", [
        { text: "OK", onPress: () => router.push("/auth/verifyEmail") },
      ]);
    } catch (error) {
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
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>Get started with secure shipment tracking.</Text>

            <View style={styles.form}>
              <TextInput
                value={firstName}
                onChangeText={(t) => {
                  setFirstName(t);
                  setErrorMessage("");
                }}
                style={styles.input}
                placeholder="First name"
                placeholderTextColor={colors.textPlaceholder}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current?.focus()}
                accessibilityLabel="First name"
              />
              <TextInput
                ref={lastNameRef}
                value={lastName}
                onChangeText={(t) => {
                  setLastName(t);
                  setErrorMessage("");
                }}
                style={styles.input}
                placeholder="Last name"
                placeholderTextColor={colors.textPlaceholder}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                accessibilityLabel="Last name"
              />
              <TextInput
                ref={emailRef}
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  setErrorMessage("");
                }}
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={colors.textPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                accessibilityLabel="Email address"
              />
              <PasswordInput
                ref={passwordRef}
                setPassword={(p) => {
                  setPassword(p);
                  setErrorMessage("");
                }}
                password={password}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
            </View>

            <Text style={styles.helperText}>By continuing, you agree to our terms and policy.</Text>

            {!!errorMessage && (
              <View style={styles.errorBox} accessibilityLiveRegion="polite">
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={({ pressed }) => [
                styles.button,
                !canSubmit && styles.buttonDisabled,
                pressed && canSubmit && styles.buttonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={isSubmitting ? "Creating account" : "Create account"}
              accessibilityState={{ disabled: !canSubmit, busy: isSubmitting }}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.textOnDark} />
              ) : (
                <Text style={styles.buttonText}>Create account</Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => router.push("/auth/login")}
              style={({ pressed }) => [styles.switchPressable, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Already have an account? Login"
            >
              <Text style={styles.switchText}>Already have an account? </Text>
              <Text style={styles.switchAction}>Login</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primarySurface,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  card: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xl,
    ...shadows.elevated,
  },
  title: {
    fontSize: typography.size.display,
    fontWeight: typography.weight.bold,
    color: colors.primaryDark,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.size.md,
    color: colors.primaryCTA,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    textAlign: "center",
    lineHeight: typography.lineHeight.base,
  },
  form: {
    gap: spacing.md,
    width: "100%",
  },
  input: {
    width: "100%",
    height: touch.inputHeight,
    borderColor: colors.borderMedium,
    borderWidth: 1,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.base,
    backgroundColor: colors.neutral50,
    fontSize: typography.size.lg,
    color: colors.textPrimary,
  },
  helperText: {
    fontSize: typography.size.sm,
    color: colors.primaryDark,
    marginTop: spacing.base,
    textAlign: "center",
    lineHeight: typography.lineHeight.tight,
  },
  errorBox: {
    marginTop: spacing.md,
    backgroundColor: colors.errorBg,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  errorText: {
    color: colors.error,
    textAlign: "center",
    fontSize: typography.size.base,
    lineHeight: typography.lineHeight.tight,
  },
  button: {
    height: touch.buttonHeight,
    backgroundColor: colors.primaryCTA,
    borderRadius: radii.xl,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.base,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonText: {
    color: colors.textOnDark,
    textAlign: "center",
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  pressed: {
    opacity: 0.7,
  },
  switchPressable: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    alignItems: "center",
    minHeight: touch.minHeight,
    marginTop: spacing.xs,
  },
  switchText: {
    textAlign: "center",
    fontSize: typography.size.lg,
    color: colors.primaryDark,
  },
  switchAction: {
    color: colors.secondaryCTA,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    textDecorationLine: "underline",
  },
});
