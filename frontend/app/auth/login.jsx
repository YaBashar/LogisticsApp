import axios from '@/services/axios';
import React from 'react'
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native'
import useAuth from '@/hooks/useAuth';
import { router } from 'expo-router';
import { font } from '../../styles/font';
import { jwtDecode } from 'jwt-decode';
import PasswordInput from './passwordInput';

export default function Login() {

    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const {persistSetAccessToken, persistSetUserRole} = useAuth()

    const handleSubmit = async () => {
        try {
            const response = await axios.post('/auth/login', {email, password});
            await persistSetAccessToken(response.data.token);
            const decoded = jwtDecode(response.data.token);
            await persistSetUserRole(decoded.role);
            router.push('/profile')
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-start", alignItems: "center", backgroundColor: "white" }}>
            <Text style={[font, { fontSize: 24, color: "#004F3B", marginTop: 70, marginHorizontal: 10 }]}>Welcome Back</Text>

            <View style={{ flexDirection:"column", gap: 20, marginTop: 10}}>
                <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="Enter your Email" placeholderTextColor="#A6A09B"></TextInput>
                <PasswordInput setPassword={setPassword} password={password}></PasswordInput>
            </View>
            
            <Pressable>
                <Text onPress={() => router.push('/auth/requestResetPassword')} style={[font, {marginTop: 10, color: '004F3B', textAlign: 'left', width: 300, fontSize: 16}]}>Forgot your password?</Text>
            </Pressable>
            
            <Pressable onPress={handleSubmit} style={{marginTop: 25, marginBottom:50, backgroundColor: '#A4F4CF',  paddingVertical: 10, paddingHorizontal: 10, borderRadius: 15, width: 250}}>
                <Text style={[font, {color: '004F3B', textAlign: 'center', fontSize: 20}]}>Login</Text>
            </Pressable>

            <Pressable onPress={() => router.push('/auth/register')}>
                <Text style={[font, {textAlign: 'center', fontSize: 20}]}>Don't Have an account?</Text>
                <Text style={[font, {color: '#004F3B', textAlign: 'center', fontSize: 20, textDecorationLine: 'underline'}]}>Sign Up</Text>
            </Pressable>
            
        </View>
    )
}

const styles = StyleSheet.create({
    input: { width: 300, height: 60, borderColor:'#004F3B', borderWidth: 2, borderRadius: 10, paddingHorizontal: 10 }
})