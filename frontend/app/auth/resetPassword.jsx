import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { font } from "../../styles/font";

import axios from "../../services/axios";

export default function ResetPassword() {
  // Call verifyEmail endpoint
  // If successful go to login page.

  const [password, setPassword] = useState("");
  const { resetCode } = useLocalSearchParams();

  const handleSubmit = async () => {
    console.log("Reset Code:", resetCode);
    try {
      await axios.post("/auth/reset-password", {
        resetCode,
        newPassword: password,
      });
      alert("Password Reset Successfully! You can now log in.");
      router.push("/auth/login");
    } catch (error) {
      console.log("Verification Error:", error);
      alert(
        "Verification Failed. Please check the code and try again.",
        resetCode
      );
    }
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Image
        source={require("../../assets/images/Key.png")}
        style={{ width: 100, height: 100, marginTop: 100, marginBottom: 10 }}
      />

      <Text
        style={[
          font,
          {
            fontSize: 25,
            color: "#004F3B",
            marginTop: 10,
            marginHorizontal: 10,
            textAlign: "center",
          },
        ]}
      >
        Reset Password
      </Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry={true}
        placeholder="Enter your new password"
      ></TextInput>

      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 15,
          marginTop: 30,
        }}
      >
        <Pressable
          onPress={handleSubmit}
          style={{
            backgroundColor: "#A4F4CF",
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderRadius: 15,
            width: 250,
          }}
        >
          <Text
            style={[
              font,
              { color: "#004F3B", textAlign: "center", fontSize: 20 },
            ]}
          >
            Reset Password
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: 300,
    height: 60,
    borderColor: "#004F3B",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
});
