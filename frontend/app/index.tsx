import { View, Text, Pressable, Image } from "react-native";
import { router } from "expo-router";

export default function Index() {
  return (
    <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-start", alignItems: "center", backgroundColor: "white" }}>
      <Text style={{ fontSize: 50, color: "black", marginTop: 100, marginHorizontal: 10, fontFamily: "System" }}>Shipping App</Text>
      <Image source={require("../assets/images/Picture2.png")} style={{ width: 250, height: 250, marginVertical: 25 }} />
      
      <View style={{flexDirection: "column", gap: 10}}>
        <Pressable 
          onPress={() => router.push('/login')} 
          style={({ pressed }) => ({
            paddingHorizontal: 10, 
            paddingVertical: 12, 
            backgroundColor: pressed ? "#87CEEB" : "lightblue",  // Slightly darker when pressed
            borderRadius: 10,
            opacity: pressed ? 0.7 : 1  // Optional: also add fade effect
          })}>
            <Text style={{ fontSize: 25, textAlign: "center" }}>Create Account</Text>
        </Pressable>

        <Pressable 
          style={({ pressed }) => ({
            paddingHorizontal: 10, 
            paddingVertical: 12, 
            backgroundColor: pressed ? "#87CEEB" : "lightblue",  // Slightly darker when pressed
            borderRadius: 10,
            opacity: pressed ? 0.7 : 1  // Optional: also add fade effect
          })}>
          <Text style={{ fontSize:25, textAlign: "center" }}>Login</Text>
        </Pressable>      
      </View>
    </View>
  );
}