import axios from "../../services/axios";
import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";
import { router, useLocalSearchParams } from "expo-router";
import { PasswordInput } from "../../components/inputs/PasswordInput";
import { colors, spacing, typography, radii, touch, shadows } from "../../constants/theme";

export default function Login() {
  const params = useLocalSearchParams();
  const [email, setEmail] = useState(typeof params.email === "string" ? params.email : "");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const passwordRef = useRef(null);
  const isEmailValid = /\S+@\S+\.\S+/.test(email.trim());
  const canSubmit = isEmailValid && password.trim().length > 0 && !isSubmitting;

  useEffect(() => {
    if (params.accountDeleted === "1") {
      Alert.alert(
        "Session ended",
        "Your account was deactivated. Sign in again to reactivate it within 30 days."
      );
    }
  }, [params.accountDeleted]);

  const handleReactivate = async () => {
    if (!canSubmit) {
      setErrorMessage("Enter a valid email and password.");
      return;
    }
    try {
      setErrorMessage("");
      setIsSubmitting(true);
      const response = await axios.post("/auth/reactivate", {
        email: email.trim(),
        password,
      });
      const { accessToken, refreshToken } = response.data;
      await login(accessToken, refreshToken);
      router.replace("/profile");
    } catch (error) {
      const msg =
        error?.response?.data?.error || "Reactivation failed. Check your password and try again.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const promptReactivate = () => {
    Alert.alert(
      "Account deactivated",
      "This account was deleted. You can restore it within 30 days using the same email and password.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reactivate account", onPress: () => handleReactivate() },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      setErrorMessage("Enter a valid email and password.");
      return;
    }
    try {
      setErrorMessage("");
      setIsSubmitting(true);
      const response = await axios.post("/auth/login", { email: email.trim(), password });
      const { accessToken, refreshToken } = response.data;
      await login(accessToken, refreshToken);
      router.replace("/profile");
    } catch (error) {
      const code = error?.response?.data?.code;
      if (code === "ACCOUNT_SOFT_DELETED") {
        promptReactivate();
      } else {
        setErrorMessage("Login failed. Please check your credentials and try again.");
      }
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to continue tracking your shipments.</Text>

            <View style={styles.formArea}>
              <TextInput
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

              <Pressable
                onPress={() => router.push("/auth/requestResetPassword")}
                style={({ pressed }) => [styles.forgotPressable, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel="Forgot your password"
                hitSlop={8}
              >
                <Text style={styles.linkText}>Forgot your password?</Text>
              </Pressable>
            </View>

            {!!errorMessage && (
              <View style={styles.errorBox} accessibilityLiveRegion="polite">
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            <View style={styles.footer}>
              <Pressable
                onPress={handleSubmit}
                disabled={!canSubmit}
                style={({ pressed }) => [
                  styles.button,
                  !canSubmit && styles.buttonDisabled,
                  pressed && canSubmit && styles.buttonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={isSubmitting ? "Logging in" : "Login"}
                accessibilityState={{ disabled: !canSubmit, busy: isSubmitting }}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.textOnDark} />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </Pressable>

              <Pressable
                onPress={() => router.push("/auth/register")}
                style={({ pressed }) => [styles.switchPressable, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel="Don't have an account? Sign up"
              >
                <Text style={styles.switchText}>Don&apos;t have an account? </Text>
                <Text style={styles.switchAction}>Sign Up</Text>
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
    textAlign: "center",
    color: colors.primaryCTA,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.base,
  },
  formArea: {
    width: "100%",
    gap: spacing.sm,
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
  forgotPressable: {
    alignSelf: "flex-start",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    marginTop: spacing.xs,
  },
  pressed: {
    opacity: 0.7,
  },
  linkText: {
    color: colors.primaryCTA,
    fontSize: typography.size.md,
    textDecorationLine: "underline",
    fontWeight: typography.weight.semibold,
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
  footer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: spacing.base,
    gap: spacing.sm,
  },
  button: {
    height: touch.buttonHeight,
    backgroundColor: colors.primaryCTA,
    borderRadius: radii.xl,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
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
  switchPressable: {
    flexDirection: "row",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    alignItems: "center",
    minHeight: touch.minHeight,
    justifyContent: "center",
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
