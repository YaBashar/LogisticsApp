import { View, TextInput, StyleSheet } from "react-native";
import { colors, spacing, typography, radii, touch } from "@/constants/theme";

export default function ItemInfoInput({
  itemDescription,
  setItemDescription,
  quantity,
  setQuantity,
  weight,
  setWeight,
  height,
  setHeight,
  width,
  setWidth,
  length,
  setLength,
}) {
  return (
    <View style={styles.container}>
      <TextInput
        value={itemDescription}
        onChangeText={setItemDescription}
        style={styles.input}
        placeholder="Item description"
        placeholderTextColor={colors.textPlaceholder}
        returnKeyType="next"
        accessibilityLabel="Item description"
      />

      <View style={styles.row}>
        <TextInput
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
          style={styles.halfInput}
          placeholder="Quantity"
          placeholderTextColor={colors.textPlaceholder}
          returnKeyType="next"
          accessibilityLabel="Quantity"
        />
        <TextInput
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
          style={styles.halfInput}
          placeholder="Weight (kg)"
          placeholderTextColor={colors.textPlaceholder}
          returnKeyType="next"
          accessibilityLabel="Weight in kilograms"
        />
      </View>

      <View style={styles.row}>
        <TextInput
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
          style={styles.thirdInput}
          placeholder="H (m)"
          placeholderTextColor={colors.textPlaceholder}
          returnKeyType="next"
          accessibilityLabel="Height in metres"
        />
        <TextInput
          keyboardType="numeric"
          value={width}
          onChangeText={setWidth}
          style={styles.thirdInput}
          placeholder="W (m)"
          placeholderTextColor={colors.textPlaceholder}
          returnKeyType="next"
          accessibilityLabel="Width in metres"
        />
        <TextInput
          keyboardType="numeric"
          value={length}
          onChangeText={setLength}
          style={styles.thirdInput}
          placeholder="L (m)"
          placeholderTextColor={colors.textPlaceholder}
          returnKeyType="done"
          accessibilityLabel="Length in metres"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  input: {
    width: "100%",
    height: touch.inputHeight,
    borderColor: colors.primaryDeep,
    borderWidth: 1.5,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primarySurface,
    fontSize: typography.size.base,
    color: colors.textPrimary,
  },
  halfInput: {
    flex: 1,
    height: touch.inputHeight,
    borderColor: colors.primaryDeep,
    borderWidth: 1.5,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primarySurface,
    fontSize: typography.size.base,
    color: colors.textPrimary,
  },
  thirdInput: {
    flex: 1,
    height: touch.inputHeight,
    borderColor: colors.primaryDeep,
    borderWidth: 1.5,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.primarySurface,
    fontSize: typography.size.base,
    color: colors.textPrimary,
    textAlign: "center",
  },
});
