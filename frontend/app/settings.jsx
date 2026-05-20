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
import { font } from "../styles/font";
import useAuth from "@/hooks/useAuth";
import { axiosPrivate } from "@/services/axios";
import { AuthenticatedScreenHeader } from "../components/AuthenticatedScreenHeader";

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
        <Text style={[font, styles.lead]}>
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
        >
          {deleting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[font, styles.deleteBtnText]}>Delete my account</Text>
          )}
        </Pressable>

        <Pressable style={styles.linkBack} onPress={() => router.back()}>
          <Text style={[font, styles.linkBackText]}>← Back</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  lead: {
    fontSize: 16,
    color: "#334155",
    lineHeight: 24,
    marginBottom: 28,
  },
  deleteBtn: {
    backgroundColor: "#B42318",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  btnPressed: {
    opacity: 0.9,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  deleteBtnText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  linkBack: {
    marginTop: 28,
    alignSelf: "center",
  },
  linkBackText: {
    fontSize: 17,
    color: "#0E9F6E",
    fontWeight: "600",
  },
});
