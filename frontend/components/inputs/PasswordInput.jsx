import { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function PasswordInput({ setPassword, password }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.wrapper}>
      <TextInput
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        placeholder="Enter your Password"
        placeholderTextColor="#A6A09B"
      ></TextInput>

      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.toggleButton}>
        <Text style={styles.toggleText}>{showPassword ? "Hide" : "Show"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  input: {
    width: "100%",
    height: 56,
    borderColor: "#0E9F6E",
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: "#F8FFFC",
  },
  toggleButton: {
    position: "absolute",
    right: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  toggleText: {
    color: "#0E9F6E",
    fontSize: 13,
    fontWeight: "600",
  },
});
