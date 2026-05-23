import { forwardRef, useState } from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import { colors, spacing, typography, radii, touch } from "../../constants/theme";

export const PasswordInput = forwardRef(function PasswordInput(
  {
    setPassword,
    password,
    returnKeyType = "done",
    onSubmitEditing,
    placeholder = "Password",
    accessibilityLabel = "Password",
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.wrapper}>
      <TextInput
        ref={ref}
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={placeholder}
        placeholderTextColor={colors.textPlaceholder}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        accessibilityLabel={accessibilityLabel}
      />
      <Pressable
        onPress={() => setShowPassword((v) => !v)}
        style={styles.toggleButton}
        accessibilityRole="button"
        accessibilityLabel={showPassword ? "Hide password" : "Show password"}
        hitSlop={8}
      >
        <Text style={styles.toggleText}>{showPassword ? "Hide" : "Show"}</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  input: {
    width: "100%",
    height: touch.inputHeight,
    borderColor: colors.primary,
    borderWidth: 1.5,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.base,
    paddingRight: 64,
    backgroundColor: colors.primarySurface,
    fontSize: typography.size.lg,
    color: colors.textPrimary,
  },
  toggleButton: {
    position: "absolute",
    right: spacing.md,
    height: touch.inputHeight,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    minWidth: touch.minHeight,
  },
  toggleText: {
    color: colors.primaryCTA,
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
});
