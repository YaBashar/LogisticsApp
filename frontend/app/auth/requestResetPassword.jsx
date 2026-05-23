import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import axios from "../../services/axios";
import { router } from "expo-router";
import { colors, spacing, typography, radii, touch, shadows } from "../../constants/theme";

export function RequestResetPassword() {
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
      await axios.post("/auth/forgot-password", { email: email.trim() });
      router.push({ pathname: "/auth/verifyResetCode", params: { email: email.trim() } });
    } catch (_error) {
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
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              We&apos;ll send a 6-digit code to reset your password.
            </Text>

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
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              accessibilityLabel="Email address"
            />

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
              accessibilityLabel={isSubmitting ? "Sending code" : "Reset Password"}
              accessibilityState={{ disabled: !canSubmit, busy: isSubmitting }}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.textOnDark} />
              ) : (
                <Text style={styles.buttonText}>Reset Password</Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backPressable, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text style={styles.backText}>← Back to Login</Text>
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
    textAlign: "center",
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
    lineHeight: typography.lineHeight.base,
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
  backPressable: {
    alignSelf: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.base,
    minHeight: touch.minHeight,
    justifyContent: "center",
  },
  backText: {
    fontSize: typography.size.lg,
    color: colors.secondary,
    fontWeight: typography.weight.semibold,
  },
});
