import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import axios from '../services/axios'
import useAuth from '../hooks/useAuth'
import { router } from 'expo-router';

export default function Register() {

    const[firstName, setFirstName] = useState("");
    const[lastName, setLastName] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");

    const { setUserId } = useAuth();

    const handleSubmit = async() => {
       
        try {
            const response = await axios.post('/auth/register', { firstName, lastName, password, email})
            setUserId(response.data.userId);
            alert(`Signed Up Successfully, Please Login to Continue`)
            router.push('/login');

        } catch (error) {
            alert('Sign Up Failed')
        }
    }

    return(
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-start", alignItems: "center", backgroundColor: "white" }}>
            <Text style={{ fontSize: 30, color: "black", marginTop: 50, marginHorizontal: 10, fontFamily: "System" }}>Welcome to App</Text>

            <View style={{ flexDirection:"column", gap: 20, marginTop: 10}}>
                <TextInput value={firstName} onChangeText={setFirstName} style={styles.input} placeholder="Enter your First name"></TextInput>
                <TextInput value={lastName} onChangeText={setLastName} style={styles.input} placeholder="Enter your Last name"></TextInput>
                <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="Enter your Email"></TextInput>
                <TextInput value={password} onChangeText={setPassword} style={styles.input} secureTextEntry={true} placeholder="Enter your Password"></TextInput>
            </View>
           
            <Text style={{ fontSize: 12, color: "black", marginTop: 15, marginHorizontal: 10, fontFamily: "System", textAlign: "center" }}>By Continuing You agree to Terms and Policy</Text>
            
            <Pressable 
                onPress={handleSubmit}
                style={({ pressed }) => ({
                paddingHorizontal: 10, 
                paddingVertical: 12, 
                backgroundColor: pressed ? "#87CEEB" : "lightblue",  
                borderRadius: 10,
                opacity: pressed ? 0.7 : 1  
            })}>
                <Text>Continue</Text>
            </Pressable>
            
        </View>
    )
}

const styles = StyleSheet.create({
    input: { width: 300, height: 60, borderWidth: 1, borderColor: "gray", borderRadius: 10 }
})