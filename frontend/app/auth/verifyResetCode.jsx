import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import NumericalCodeInput from "../../components/inputs/NumericalCodeInput";
import axios from "../../services/axios";
import { colors, spacing, typography, radii, touch, shadows } from "../../constants/theme";

export default function VerifyResetCode() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
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
      router.push({ pathname: "/auth/resetPassword", params: { resetCode } });
    } catch (_error) {
      setErrorMessage("Verification failed. Please check the code and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (isResending) return;
    try {
      setIsResending(true);
      await axios.post("/auth/resend-reset-code", { email });
      Alert.alert("Code resent", "A new reset code has been sent to your email.");
    } catch (_error) {
      Alert.alert("Error", "Failed to resend reset code. Please try again later.");
    } finally {
      setIsResending(false);
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
            <Image
              source={require("../../assets/images/Key.png")}
              style={styles.image}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            />

            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter the code sent to your email to reset password.
            </Text>

            <NumericalCodeInput code={code} setCode={setCode} />

            {!!errorMessage && (
              <View style={styles.errorBox} accessibilityLiveRegion="polite">
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            <View style={styles.actionArea}>
              <Pressable
                onPress={handleVerify}
                disabled={!canVerify}
                style={({ pressed }) => [
                  styles.verifyButton,
                  !canVerify && styles.buttonDisabled,
                  pressed && canVerify && styles.buttonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={isSubmitting ? "Verifying" : "Verify Code"}
                accessibilityState={{ disabled: !canVerify, busy: isSubmitting }}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.textOnDark} />
                ) : (
                  <Text style={styles.buttonText}>Verify Code</Text>
                )}
              </Pressable>

              <Pressable
                onPress={handleResend}
                disabled={isResending}
                style={({ pressed }) => [
                  styles.resendButton,
                  isResending && styles.buttonDisabled,
                  pressed && !isResending && styles.resendPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Resend reset code"
                accessibilityState={{ busy: isResending }}
              >
                {isResending ? (
                  <ActivityIndicator color={colors.primaryDark} />
                ) : (
                  <Text style={styles.resendText}>Resend Code</Text>
                )}
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
    alignItems: "center",
    ...shadows.elevated,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: spacing.md,
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
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    width: "100%",
    lineHeight: typography.lineHeight.base,
  },
  errorBox: {
    marginTop: spacing.md,
    backgroundColor: colors.errorBg,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    width: "100%",
  },
  errorText: {
    color: colors.error,
    textAlign: "center",
    fontSize: typography.size.base,
    lineHeight: typography.lineHeight.tight,
  },
  actionArea: {
    width: "100%",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  verifyButton: {
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
  resendButton: {
    height: touch.buttonHeight,
    backgroundColor: colors.secondarySurface,
    borderRadius: radii.xl,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.subtle,
  },
  resendPressed: {
    opacity: 0.75,
  },
  resendText: {
    color: colors.secondaryDark,
    textAlign: "center",
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
});
