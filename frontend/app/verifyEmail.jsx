import { View, Text, TextInput, Image, Pressable } from 'react-native'
import { useState, useRef } from 'react';
import { router } from 'expo-router';
import axios from '../services/axios'


export default function VerifyEmail() {
    // Call verifyEmail endpoint
    // If successful go to login page.
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);

    const handleChangeText = (text, index) => {
        // Only allow numbers
        if (text && !/^\d+$/.test(text)) return;
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);
        // Auto-focus next input
        if (text && index < 5) {
        inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e, index) => {
        // Handle backspace - go to previous input
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        }
    };

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
        <View View style={{ flex: 1, flexDirection: "column", alignItems: "center", backgroundColor: "white" }}>
                
            <Image source={require("../assets/images/Key.png")} style={{ width: 100, height: 100, marginTop: 100 }} />
            
            <Text style={{ fontSize: 25, color: "black", marginTop: 10, marginHorizontal: 10, fontFamily: "System", textAlign: "center" }}>Verify Account</Text>
            <Text style={{ fontSize: 20, color: "black", width: 250, marginTop: 10, marginHorizontal: 10, fontFamily: "System", textAlign: "center" }}>Enter the code sent to your email to verify</Text>


            <View style = {{flexDirection: "row", gap: 5, marginTop: 20 }}>
                {code.map((digit, index) => (
                <TextInput 
                    key={index}
                    style={{ height: 50, width:50, borderColor: 'gray', borderWidth: 1, marginTop: 20, paddingHorizontal: 10, fontSize: 18, borderRadius: 10, textAlign: "center" }}
                    value={digit} 
                    onChangeText={(text) => handleChangeText(text, index)} 
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    keyboardType='numeric' 
                    maxLength={1}
                    selectTextOnFocus
                >
                </TextInput>
                ))}
            </View>

            <Pressable 
                onPress={handleVerify}
                style={({ pressed }) => ({
                paddingHorizontal: 10, 
                paddingVertical: 12, 
                backgroundColor: pressed ? "#87CEEB" : "lightblue",  
                borderRadius: 10,
                opacity: pressed ? 0.7 : 1  
            })}>
                <Text>Verify</Text>
            </Pressable>

            <Pressable 
                onPress={handleResend}
                style={({ pressed }) => ({
                paddingHorizontal: 10, 
                paddingVertical: 12, 
                backgroundColor: pressed ? "#87CEEB" : "lightblue",  
                borderRadius: 10,
                opacity: pressed ? 0.7 : 1  
            })}>
                <Text>Resend Code</Text>
            </Pressable>
        </View>
    )
}