import { View, TextInput } from 'react-native'
import { useState } from 'react'
import axios from '../services/axios'
import { router } from 'expo-router'


export default function ResendVerification() {

    const [email, setEmail ] = useState('')
    
    const handleSubmit = async() => {
        // Call resend verification endpoint
        try {
            await axios.post('/auth/resend-verification', { email });
            console.log('Email Sent')
            router.push('/verifyEmail')
        } catch (error) {
            console.log(error);
        }
    }
    
    return (

        <>
        <View style={{ flexDirection:"column", gap: 20, marginTop: 10}}>
            <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="Enter your Email"></TextInput>
        </View>
        
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
        
        </>
          
    )
}