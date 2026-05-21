import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import useAuth from "@/hooks/useAuth";
import { axiosPrivate } from "@/services/axios";
import { AuthenticatedScreenHeader } from "../components/AuthenticatedScreenHeader";
import { colors, spacing, typography, radii, touch } from "../constants/theme";

export default function Settings() {
  const { logout } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = () => {
    if (deleting) return;
    const message =
      Platform.OS === "ios"
        ? "Your account will be deactivated. You can restore it within 30 days by logging in again. After 30 days it will be permanently removed."
        : "Your account will be deactivated. Restore within 30 days from login, or it will be permanently removed.";

    Alert.alert("Delete account?", message, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete account",
        style: "destructive",
        onPress: () => runDelete(),
      },
    ]);
  };

  const runDelete = async () => {
    setDeleting(true);
    try {
      await axiosPrivate.delete("/auth/delete-account");
      await logout();
      Alert.alert(
        "Account deleted",
        "You can restore your account within 30 days when you sign in.",
        [{ text: "OK", onPress: () => router.replace("/auth/login") }]
      );
    } catch (error) {
      const msg =
        error?.response?.data?.error || error?.message || "Could not delete account. Try again.";
      Alert.alert("Error", msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <AuthenticatedScreenHeader title="Settings" showSettings={false} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lead}>
          Manage your account. Deleting your account is reversible for 30 days.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.deleteBtn,
            pressed && styles.btnPressed,
            deleting && styles.btnDisabled,
          ]}
          onPress={confirmDelete}
          disabled={deleting}
          accessibilityRole="button"
          accessibilityLabel="Delete my account"
          accessibilityState={{ busy: deleting }}
        >
          {deleting ? (
            <ActivityIndicator color={colors.textOnDark} />
          ) : (
            <Text style={styles.deleteBtnText}>Delete my account</Text>
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.linkBack, pressed && styles.linkPressed]}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.linkBackText}>← Back</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primarySurface,
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
  deleteBtn: {
    height: touch.buttonHeight,
    backgroundColor: colors.error,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPressed: {
    opacity: 0.88,
  },
  btnDisabled: {
    opacity: 0.55,
  },
  deleteBtnText: {
    color: colors.textOnDark,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  linkBack: {
    alignSelf: "center",
    marginTop: spacing.xxl,
    minHeight: touch.minHeight,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    justifyContent: "center",
  },
  linkPressed: {
    opacity: 0.7,
  },
  linkBackText: {
    fontSize: typography.size.xl,
    color: colors.primaryCTA,
    fontWeight: typography.weight.semibold,
  },
});
