import React from 'react'
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native'

export default function Login() {

    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");

    return(
            <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-start", alignItems: "center", backgroundColor: "white" }}>
                <Text style={{ fontSize: 30, color: "black", marginTop: 50, marginHorizontal: 10, fontFamily: "System" }}>Welcome Back</Text>
    
                <View style={{ flexDirection:"column", gap: 20, marginTop: 10}}>
                    <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="Enter your Email"></TextInput>
                    <TextInput value={password} onChangeText={setPassword} style={styles.input} secureTextEntry={true} placeholder="Enter your Password"></TextInput>
                </View>
               
                <Text style={{ fontSize: 12, color: "black", marginTop: 15, marginHorizontal: 10, fontFamily: "System", textAlign: "center" }}>By Continuing You agree to Terms and Policy</Text>
                
                <Pressable 
                    style={({ pressed }) => ({
                    paddingHorizontal: 10, 
                    paddingVertical: 12, 
                    backgroundColor: pressed ? "#87CEEB" : "lightblue",  
                    borderRadius: 10,
                    opacity: pressed ? 0.7 : 1  
                })}>
                    <Text>Login</Text>
                </Pressable>
                
            </View>
        )
}

const styles = StyleSheet.create({
    input: { width: 300, height: 60, borderWidth: 1, borderColor: "gray", borderRadius: 10 }
})