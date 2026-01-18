import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native'
import { useState } from 'react'
import axios from '../../services/axios'
import { router } from 'expo-router'
import { font } from '../../styles/font';


export default function RequestResetPassword() {

    const [email, setEmail] = useState('')
    
    const handleSubmit = async() => {
        // Call resend verification endpoint
        try {
            await axios.post('/auth/request-reset-password', { email });
            console.log('Email Sent')
            router.push('/auth/verifyResetCode', { email: email });
        } catch (error) {
            console.log(error);
        }
    }
    
    return (

        
        <View style={{ flex: 1, flexDirection: "column", alignItems: "center", backgroundColor: "white" }}>
            <Text style={[font, { marginTop: 100, fontSize: 25, color: "#004F3B", marginHorizontal: 10, textAlign: "center" }]}>Forgot Password</Text>
            <Text style={[font, { fontSize: 20, color: "#004F3B", width: 250, marginHorizontal: 10, marginBottom: 20, textAlign: "center" }]}>You will recieve a 6 digit code to reset your password</Text>
            
            
            <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="Enter your Email"></TextInput>
        
            <Pressable onPress={handleSubmit} style={{backgroundColor: '#A4F4CF', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 15, width: 250, marginTop: 25}}>
                <Text style={[font, {color: '004F3B', textAlign: 'center', fontSize: 20}]}>Reset Password</Text>
            </Pressable>

        </View>
          
    )
}

const styles = StyleSheet.create({
    input: { width: 300, height: 60, borderColor:'#004F3B', borderWidth: 2, borderRadius: 10, paddingHorizontal: 10 }
})