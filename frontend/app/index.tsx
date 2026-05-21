import { useEffect } from "react";
import {
  View,
  Pressable,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  type ImageStyle,
  type TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import useAuth from "../hooks/useAuth";
import { colors, spacing, typography, radii, touch, shadows } from "../constants/theme";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace("/profile");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title} accessibilityRole="header">
          Shipping App
        </Text>
        <Text style={styles.subtitle}>Track your packages with ease</Text>
      </View>

      <View
        style={styles.imageCard}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Image
          source={require("../assets/images/LandingImage.png")}
          style={styles.image as ImageStyle}
          resizeMode="cover"
        />
      </View>

      <View style={styles.actionArea}>
        <Pressable
          onPress={() => router.push("auth/register")}
          style={({ pressed }) => [styles.buttonPrimary, pressed && styles.buttonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Create account"
        >
          <Text style={styles.buttonPrimaryText}>Create account</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("auth/login")}
          style={({ pressed }) => [styles.buttonOutline, pressed && styles.buttonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Login"
        >
          <Text style={styles.buttonOutlineText}>Login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primarySurface,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.primarySurface,
  },
  hero: {
    alignItems: "center",
    marginTop: spacing.base,
  },
  title: {
    fontSize: typography.size.hero,
    fontWeight: typography.weight.bold as TextStyle["fontWeight"],
    color: colors.primaryDark,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typography.size.lg,
    color: colors.primaryCTA,
    textAlign: "center",
    marginTop: spacing.sm,
    lineHeight: typography.lineHeight.base,
  },
  imageCard: {
    width: "100%",
    flex: 1,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radii.card + 4,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    ...shadows.float,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  actionArea: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    gap: spacing.md,
  },
  buttonPrimary: {
    height: touch.buttonHeight,
    backgroundColor: colors.primaryCTA,
    borderRadius: radii.xl,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonOutline: {
    height: touch.buttonHeight,
    backgroundColor: colors.secondarySurface,
    borderRadius: radii.xl,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.subtle,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonPrimaryText: {
    color: colors.textOnDark,
    textAlign: "center",
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold as TextStyle["fontWeight"],
  },
  buttonOutlineText: {
    color: colors.secondaryDark,
    textAlign: "center",
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold as TextStyle["fontWeight"],
  },
});
