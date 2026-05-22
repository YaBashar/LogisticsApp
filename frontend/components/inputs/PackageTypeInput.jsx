import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, spacing, typography, radii, touch, shadows } from "@/constants/theme";

const PACKAGE_TYPES = ["pallet", "crate", "box"];

export default function PackageTypeInput({ packageType, setPackageType }) {
  return (
    <View style={styles.container}>
      {PACKAGE_TYPES.map((type) => {
        const isSelected = packageType === type;
        return (
          <Pressable
            key={type}
            onPress={() => setPackageType(type)}
            style={({ pressed }) => [
              styles.typeButton,
              isSelected ? styles.typeButtonSelected : styles.typeButtonIdle,
              pressed && styles.typeButtonPressed,
            ]}
            accessibilityRole="radio"
            accessibilityLabel={type}
            accessibilityState={{ checked: isSelected }}
          >
            <Text style={[styles.typeLabel, isSelected && styles.typeLabelSelected]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "center",
  },
  typeButton: {
    flex: 1,
    minHeight: touch.minHeight,
    paddingVertical: 6,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  typeButtonIdle: {
    backgroundColor: colors.neutral100,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  typeButtonSelected: {
    backgroundColor: colors.primarySurface,
    borderWidth: 2,
    borderColor: colors.primaryCTA,
    ...shadows.subtle,
  },
  typeButtonPressed: {
    opacity: 0.75,
  },
  typeLabel: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.textSecondary,
    textAlign: "center",
  },
  typeLabelSelected: {
    color: colors.primaryDeep,
    fontWeight: typography.weight.bold,
  },
});
