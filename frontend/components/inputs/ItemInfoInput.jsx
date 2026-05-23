import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors, spacing, typography, radii } from "../../constants/theme";

export function ItemInfoInput({
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

      <View>
        <Text style={styles.dimensionsLabel}>Dimensions (m)</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: "row",
    gap: 6,
  },
  dimensionsLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 4,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: colors.borderMedium,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.neutral50,
    fontSize: typography.size.base,
    color: colors.textPrimary,
  },
  halfInput: {
    flex: 1,
    height: 40,
    borderColor: colors.borderMedium,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.neutral50,
    fontSize: typography.size.base,
    color: colors.textPrimary,
  },
  thirdInput: {
    flex: 1,
    height: 40,
    borderColor: colors.borderMedium,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.neutral50,
    fontSize: typography.size.base,
    color: colors.textPrimary,
    textAlign: "center",
  },
});
