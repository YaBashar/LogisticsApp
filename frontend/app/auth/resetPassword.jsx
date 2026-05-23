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
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "../../services/axios";
import { PasswordInput } from "../../components/inputs/PasswordInput";
import { colors, spacing, typography, radii, touch, shadows } from "../../constants/theme";

export function ResetPassword() {
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
      await axios.post("/auth/reset-password", { resetCode, newPassword: password });
      Alert.alert("Password reset", "Your password has been updated. You can now log in.", [
        { text: "Log in", onPress: () => router.push("/auth/login") },
      ]);
    } catch (_error) {
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
            <Image
              source={require("../../assets/images/Key.png")}
              style={styles.image}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            />

            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter a strong new password and use it for your next login.
            </Text>

            <PasswordInput
              setPassword={(p) => {
                setPassword(p);
                setErrorMessage("");
              }}
              password={password}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />

            {!!errorMessage && (
              <View style={styles.errorBox} accessibilityLiveRegion="polite">
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            <View style={styles.actionArea}>
              <Pressable
                onPress={handleSubmit}
                disabled={!canSubmit}
                style={({ pressed }) => [
                  styles.button,
                  !canSubmit && styles.buttonDisabled,
                  pressed && canSubmit && styles.buttonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={isSubmitting ? "Resetting password" : "Reset Password"}
                accessibilityState={{ disabled: !canSubmit, busy: isSubmitting }}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.textOnDark} />
                ) : (
                  <Text style={styles.buttonText}>Reset Password</Text>
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
    marginBottom: spacing.lg,
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
    marginTop: spacing.base,
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
});
