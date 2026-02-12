import axios from "@/services/axios";
import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "@/hooks/useAuth";
import { router } from "expo-router";
import { font } from "../../styles/font";
import PasswordInput from "../../components/inputs/PasswordInput";

// Minor UI
// Show error when password or email is wrong

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/auth/login", { email, password });
      const { accessToken, refreshToken } = response.data;
      console.log("AccessToken", accessToken);
      console.log("RefreshTOken", refreshToken);

      login(accessToken, refreshToken);

      router.push("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[font, styles.title]}> Welcome Back </Text>

      <View style={styles.outerView}>
        <View style={styles.innerView}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="Enter your Email"
            placeholderTextColor="#A6A09B"
          ></TextInput>
          <PasswordInput setPassword={setPassword} password={password}></PasswordInput>

          <Pressable>
            <Text
              onPress={() => router.push("/auth/requestResetPassword")}
              style={[
                font,
                {
                  color: "#004F3B",
                  textAlign: "left",
                  fontSize: 16,
                  marginLeft: 10,
                  marginBottom: 30,
                  marginTop: 10,
                  textDecorationLine: "underline",
                },
              ]}
            >
              Forgot your password?
            </Text>
          </Pressable>
        </View>

        <View style={{ width: "100%", flexDirection: "column", alignItems: "center" }}>
          <Pressable onPress={handleSubmit} style={styles.button}>
            <Text style={[font, { color: "004F3B", textAlign: "center", fontSize: 20 }]}>
              Login
            </Text>
          </Pressable>

          <Pressable onPress={() => router.push("/auth/register")}>
            <Text style={[font, { textAlign: "center", fontSize: 20 }]}>
              {" "}
              Dont Have an account?
            </Text>
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
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 20,
    marginBottom: 15,
    width: "100%",
    height: "30%",
    borderColor: "#004F3B",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
  },

  title: {
    fontSize: 24,
    color: "#004F3B",
    marginHorizontal: 10,
    marginTop: 50,
  },

  button: {
    marginBottom: 30,
    marginTop: 20,
    backgroundColor: "#A4F4CF",
    padding: 10,
    borderRadius: 15,
    width: "80%",
  },

  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
  },

  outerView: {
    flexDirection: "column",
    width: "90%",
    height: "100%",
    justifyContent: "flex-start",
  },

  innerView: {
    width: "100%",
    height: "30%",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
});
