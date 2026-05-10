import React, { useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";

const NumericalCodeInput = ({ code, setCode }) => {
  const inputRefs = useRef([]);

  const handleChangeText = (text, index) => {
    // Only allow numbers
    if (text && !/^\d+$/.test(text)) return;
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace - go to previous input
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          style={styles.input}
          value={digit}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          ref={(ref) => (inputRefs.current[index] = ref)}
          keyboardType="numeric"
          maxLength={1}
          selectTextOnFocus
        ></TextInput>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "space-between",
    width: "100%",
  },
  input: {
    height: 52,
    width: "14.5%",
    minWidth: 42,
    borderColor: "#0E9F6E",
    borderWidth: 1.5,
    paddingHorizontal: 6,
    fontSize: 20,
    borderRadius: 12,
    textAlign: "center",
    backgroundColor: "#F8FFFC",
    color: "#064E3B",
    fontWeight: "700",
  },
});

export default NumericalCodeInput;
