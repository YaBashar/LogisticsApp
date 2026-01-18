import { View, Text, TextInput, Image, Pressable } from 'react-native'
import { useState, useRef } from 'react';
import { router } from 'expo-router';
import { font } from '../../styles/font';
import  NumericalCodeEntry from '../../components/NumericalCodeEntry';
import axios from '../../services/axios'


export default function VerifyEmail() {
    // Call verifyEmail endpoint
    // If successful go to login page.
    
    const [code, setCode] = useState(['', '', '', '', '', '']);

    const handleVerify = async () => {
        const verificationCode = code.join('');
        console.log('Verification Code:', verificationCode);
        try {
            const response = await axios.post('/auth/verify-email', { verificationCode });
            alert('Email Verified Successfully! You can now log in.');
            router.push('/login');
        } catch (error) {
            console.log('Verification Error:', error);
            alert('Verification Failed. Please check the code and try again.', verificationCode);
        }
    }

    const handleResend = async () => {
        router.push('/resendVerification');
    }

    return (
        <View style={{ flex: 1, flexDirection: "column", alignItems: "center", backgroundColor: "white" }}>
                
            <Image source={require("../assets/images/Key.png")} style={{ width: 100, height: 100, marginTop: 100, marginBottom: 10 }} />
            
            <Text style={[font, { fontSize: 25, color: "#004F3B", marginTop: 10, marginHorizontal: 10, textAlign: "center" }]}>Verify Account</Text>
            <Text style={[font, { fontSize: 20, color: "#004F3B", width: 250, marginHorizontal: 10, textAlign: "center" }]}>Enter the code sent to your email to verify</Text>


            <NumericalCodeEntry code={code} setCode={setCode} />

            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 15, marginTop: 30}}>
                <Pressable onPress={handleVerify} style={{backgroundColor: '#A4F4CF', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 15, width: 250}}>
                    <Text style={[font, {color: '#004F3B', textAlign: 'center', fontSize: 20}]}>Verify Email</Text>
                </Pressable>
    
                <Pressable onPress={handleResend} style={{backgroundColor: '#F5F5F4', paddingVertical: 10, paddingHorizontal: 10, borderColor:'#004F3B', borderWidth: 1, borderRadius: 15, width: 250}}>
                    <Text style={[font, {color: '#004F3B', textAlign: 'center', fontSize: 20}]}>Resend Code</Text>
                </Pressable>
            </View>
        </View>
    )
}