import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, spacing, typography, radii, touch } from "@/constants/theme";

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
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  typeButtonIdle: {
    backgroundColor: "#E7E5E4",
  },
  typeButtonSelected: {
    backgroundColor: "#A4F4CF",
    borderWidth: 2,
    borderColor: colors.primaryDeep,
  },
  typeButtonPressed: {
    opacity: 0.75,
  },
  typeLabel: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    textAlign: "center",
  },
  typeLabelSelected: {
    color: colors.primaryDeep,
    fontWeight: typography.weight.bold,
  },
});
