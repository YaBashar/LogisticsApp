import { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function PasswordInput({ setPassword, password }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      <TextInput
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry={!showPassword}
        placeholder="Enter your Password"
        placeholderTextColor="#A6A09B"
      ></TextInput>

      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.toggleButton}>
        <Text>{showPassword ? "🔓" : "🔒"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 60,
    borderColor: "#004F3B",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  toggleButton: {
    position: "absolute",
    right: 10,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});
