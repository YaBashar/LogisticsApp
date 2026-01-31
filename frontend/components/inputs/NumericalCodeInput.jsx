import React, { useRef } from "react";
import { View, TextInput } from "react-native";

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
    <View style={{ flexDirection: "row", gap: 5, marginTop: 10 }}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          style={{
            height: 50,
            width: 50,
            borderColor: "#004F3B",
            borderWidth: 2,
            marginTop: 20,
            paddingHorizontal: 10,
            fontSize: 18,
            borderRadius: 10,
            textAlign: "center",
          }}
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

export default NumericalCodeInput;
