import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { font } from "../styles/font";
import useAuth from "@/hooks/useAuth";
import LogoutButton from "./auth/LogoutButton";

/**
 * App header: role pill, logout, and settings in one actions pill.
 * @param {"toolbar" | "hero"} [variant="toolbar"] — hero = profile-style large title + subtitle
 */
export function AuthenticatedScreenHeader({
  title,
  subtitle,
  variant = "toolbar",
  showSettings = true,
}) {
  const insets = useSafeAreaInsets();
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(420, width - 32);
  const resolvedSubtitle = subtitle ?? (isAdmin ? "Active Orders" : undefined);

  const actions = <LogoutButton showSettings={showSettings} />;

  if (variant === "hero") {
    return (
      <View
        style={[
          styles.heroWrap,
          {
            width: contentWidth,
            paddingTop: insets.top + 8,
          },
        ]}
      >
        <View style={styles.heroRow}>
          <View style={styles.heroTextBlock}>
            <Text style={[font, styles.heroTitle]} numberOfLines={1}>
              {title}
            </Text>
            {resolvedSubtitle ? (
              <Text style={[font, styles.heroSubtitle]} numberOfLines={1}>
                {resolvedSubtitle}
              </Text>
            ) : null}
          </View>
          <View style={styles.heroActions}>{actions}</View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.toolbarWrap, { paddingTop: insets.top + 8 }]}>
      <View style={styles.toolbarTitleWrap}>
        <Text style={[font, styles.toolbarTitle]} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={styles.toolbarActions}>{actions}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbarWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 79, 59, 0.12)",
    minHeight: 48,
  },
  toolbarTitleWrap: {
    flex: 1,
    minWidth: 0,
  },
  toolbarTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#004F3B",
  },
  toolbarActions: {
    flexShrink: 0,
  },
  heroWrap: {
    alignSelf: "center",
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  heroTextBlock: {
    flex: 1,
    minWidth: 0,
    paddingRight: 4,
  },
  heroTitle: {
    fontSize: 22,
    color: "#0B6B4B",
    letterSpacing: 0.2,
    fontWeight: "700",
  },
  heroSubtitle: {
    marginTop: 4,
    fontSize: 16,
    color: "#0E9F6E",
    fontWeight: "600",
  },
  heroActions: {
    flexShrink: 0,
  },
});
