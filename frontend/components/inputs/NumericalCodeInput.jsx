import React, { useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { colors, spacing, typography, radii } from "@/constants/theme";

const NumericalCodeInput = ({ code, setCode }) => {
  const inputRefs = useRef([]);

  const handleChangeText = (text, index) => {
    if (text && !/^\d+$/.test(text)) return;
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          style={[styles.input, digit ? styles.inputFilled : null]}
          value={digit}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          ref={(ref) => (inputRefs.current[index] = ref)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          accessibilityLabel={`Digit ${index + 1} of 6`}
        />
      ))}
    </View>
  );
};

export default NumericalCodeInput;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: spacing.md,
    justifyContent: "space-between",
    width: "100%",
    gap: spacing.xs,
  },
  input: {
    flex: 1,
    height: 56,
    minWidth: 40,
    borderColor: colors.primary,
    borderWidth: 1.5,
    fontSize: typography.size.xxl,
    borderRadius: radii.md,
    textAlign: "center",
    backgroundColor: colors.primarySurface,
    color: colors.primaryDark,
    fontWeight: typography.weight.bold,
  },
  inputFilled: {
    borderColor: colors.primaryDark,
    borderWidth: 2,
    backgroundColor: "rgba(14,159,110,0.08)",
  },
});
