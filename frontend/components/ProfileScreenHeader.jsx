import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAuth from "@/hooks/useAuth";
import { font } from "../styles/font";
import LogoutButton from "./auth/LogoutButton";

export function ProfileScreenHeader({ title, subtitle }) {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentWidth = Math.min(420, width - 32);
  const resolvedSubtitle = subtitle ?? (isAdmin ? "Active Orders" : undefined);

  return (
    <View
      style={[
        styles.wrap,
        {
          width: contentWidth,
          paddingTop: insets.top + 8,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.textBlock}>
          <Text style={[font, styles.title]}>{title}</Text>
          {resolvedSubtitle ? (
            <Text style={[font, styles.subtitle]}>{resolvedSubtitle}</Text>
          ) : null}
        </View>
        <LogoutButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: "center",
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  textBlock: {
    flex: 1,
    paddingRight: 4,
  },
  title: {
    fontSize: 26,
    color: "#0B6B4B",
    letterSpacing: 0.2,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 16,
    color: "#0E9F6E",
    fontWeight: "600",
  },
});
