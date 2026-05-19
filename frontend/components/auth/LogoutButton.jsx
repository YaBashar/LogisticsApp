import { Pressable, Text, StyleSheet, Alert, View } from "react-native";
import { router } from "expo-router";
import useAuth from "@/hooks/useAuth";
import { axiosPrivate } from "@/services/axios";
import { font } from "../../styles/font";

export default function LogoutButton() {
  const { logout, role } = useAuth();

  const handleLogout = () => {
    Alert.alert("Log out", "You will need to sign in again to continue.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            await axiosPrivate.post("/auth/logout");
          } catch (error) {
            console.warn("Logout request failed:", error?.message);
          } finally {
            await logout();
            router.replace("/auth/login");
          }
        },
      },
    ]);
  };

  return (
    <Pressable
      onPress={handleLogout}
      accessibilityRole="button"
      accessibilityLabel="Log out"
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      {role ? (
        <View style={styles.rolePill}>
          <Text style={[font, styles.roleText]}>{role}</Text>
        </View>
      ) : null}
      <Text style={[font, styles.label]}>Log out</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.12)",
  },
  buttonPressed: {
    opacity: 0.88,
  },
  rolePill: {
    backgroundColor: "rgba(30, 158, 115, 0.14)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  roleText: {
    fontSize: 11,
    color: "#0B6B4B",
    fontWeight: "700",
    textTransform: "capitalize",
  },
  label: {
    fontSize: 13,
    color: "#B42318",
    fontWeight: "700",
  },
});
