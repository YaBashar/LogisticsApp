import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "../../services/axios";
import useAuth from "../../hooks/useAuth";
import { router } from "expo-router";
import { font } from "../../styles/font";
import PasswordInput from "../../components/inputs/PasswordInput";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { persistSetUserId } = useAuth();

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/auth/register", {
        firstName,
        lastName,
        password,
        email,
      });
      await persistSetUserId(response.data.userId);
      alert(`Signed Up Successfully, Please Verify Email to Continue`);
      router.push("/auth/verifyEmail");
    } catch (error) {
      alert("Sign Up Failed", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={[
          font,
          {
            fontSize: 24,
            color: "#004F3B",
            marginTop: 70,
            marginHorizontal: 10,
          },
        ]}
      >
        Welcome to App
      </Text>

      <View style={{ flexDirection: "column", gap: 20, marginTop: 10, width: "85%" }}>
        <TextInput
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          placeholder="Enter your First name"
          placeholderTextColor="#A6A09B"
        ></TextInput>
        <TextInput
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
          placeholder="Enter your Last name"
          placeholderTextColor="#A6A09B"
        ></TextInput>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="Enter your Email"
          placeholderTextColor="#A6A09B"
        ></TextInput>

        <PasswordInput setPassword={setPassword} password={password}></PasswordInput>
      </View>

      <Text
        style={{
          fontSize: 12,
          color: "black",
          marginTop: 15,
          marginHorizontal: 10,
          fontFamily: "System",
          textAlign: "center",
        }}
      >
        By Continuing You agree to Terms and Policy
      </Text>

      <Pressable onPress={handleSubmit} style={styles.button}>
        <Text style={[font, { color: "#004F3B", textAlign: "center", fontSize: 20 }]}>
          Create account
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push("/auth/login")}>
        <Text style={[font, { textAlign: "center", fontSize: 20 }]}>Already Have an account?</Text>
        <Text
          style={[
            font,
            {
              color: "#004F3B",
              textAlign: "center",
              fontSize: 20,
              textDecorationLine: "underline",
            },
          ]}
        >
          Login
        </Text>
      </Pressable>
    </SafeAreaView>
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

  button: {
    marginTop: 15,
    marginBottom: 50,
    backgroundColor: "#A4F4CF",
    padding: 10,
    borderRadius: 15,
    width: "65%",
  },

  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
  },
});
