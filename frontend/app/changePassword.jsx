import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "../hooks/useAuth";
import { axiosPrivate } from "../services/axios";
import { PasswordInput } from "../components/inputs/PasswordInput";
import { ScreenHeader } from "../components/ScreenHeader";
import { colors, spacing, typography, radii, touch } from "../constants/theme";

export function ChangePassword() {
  const { logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const passwordsMatch = newPassword === confirmPassword;
  const canSubmit =
    currentPassword.trim().length > 0 &&
    newPassword.trim().length >= 8 &&
    confirmPassword.trim().length >= 8 &&
    passwordsMatch &&
    !submitting;

  const clearError = () => setErrorMessage("");

  const handleSubmit = async () => {
    if (submitting) return;

    if (!currentPassword.trim()) {
      setErrorMessage("Enter your current password.");
      return;
    }
    if (newPassword.trim().length < 8) {
      setErrorMessage("New password must be at least 8 characters.");
      return;
    }
    if (!passwordsMatch) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    try {
      await axiosPrivate.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      await logout();
      Alert.alert(
        "Password updated",
        "Your password has been changed. Sign in again with your new password.",
        [{ text: "OK", onPress: () => router.replace("/auth/login") }]
      );
    } catch (error) {
      const msg =
        error?.response?.data?.error || error?.message || "Could not change password. Try again.";
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const showMismatch = confirmPassword.length > 0 && newPassword.length > 0 && !passwordsMatch;

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <ScreenHeader title="Change password" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.lead}>
            Enter your current password, then choose a new one. You will be signed out on all
            devices after updating.
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Current password</Text>
            <PasswordInput
              password={currentPassword}
              setPassword={(value) => {
                setCurrentPassword(value);
                clearError();
              }}
              placeholder="Current password"
              accessibilityLabel="Current password"
              returnKeyType="next"
              onSubmitEditing={() => newPasswordRef.current?.focus()}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>New password</Text>
            <PasswordInput
              ref={newPasswordRef}
              password={newPassword}
              setPassword={(value) => {
                setNewPassword(value);
                clearError();
              }}
              placeholder="New password"
              accessibilityLabel="New password"
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Confirm new password</Text>
            <PasswordInput
              ref={confirmPasswordRef}
              password={confirmPassword}
              setPassword={(value) => {
                setConfirmPassword(value);
                clearError();
              }}
              placeholder="Confirm new password"
              accessibilityLabel="Confirm new password"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            {showMismatch ? (
              <Text style={styles.hintError} accessibilityLiveRegion="polite">
                Passwords do not match
              </Text>
            ) : null}
          </View>

          {!!errorMessage && (
            <View style={styles.errorBox} accessibilityLiveRegion="polite">
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              pressed && styles.btnPressed,
              !canSubmit && styles.btnDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            accessibilityRole="button"
            accessibilityLabel="Update password"
            accessibilityState={{ busy: submitting, disabled: !canSubmit }}
          >
            {submitting ? (
              <ActivityIndicator color={colors.textOnDark} />
            ) : (
              <Text style={styles.submitBtnText}>Update password</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primarySurface,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  lead: {
    fontSize: typography.size.lg,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.relaxed,
    marginBottom: spacing.xxl,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  hintError: {
    marginTop: spacing.sm,
    fontSize: typography.size.sm,
    color: colors.error,
  },
  errorBox: {
    marginBottom: spacing.lg,
    backgroundColor: colors.errorBg,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.size.base,
    lineHeight: typography.lineHeight.tight,
  },
  submitBtn: {
    height: touch.buttonHeight,
    backgroundColor: colors.primaryCTA,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  btnPressed: {
    opacity: 0.88,
  },
  btnDisabled: {
    opacity: 0.45,
  },
  submitBtnText: {
    color: colors.textOnDark,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
});
