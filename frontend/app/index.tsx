import * as React from "react";
import { View, Pressable, Text, Image} from "react-native";
import { font } from '../styles/font';
import { router } from "expo-router";

export default function Index() {
  return (
    <View style={{flex: 1, flexDirection:'column', justifyContent:'flex-start', alignItems:'center'}}>
        <Text style={[font, {fontSize: 45, fontFamily: "Inter-SemiBold", marginTop: 100, color: '#004F3B'}]}>Shipping App</Text>
        <Text style={[font, {fontSize: 16, color: '#007A55'}]}>Track your packages with ease</Text>
        <Image source={require('../assets/images/LandingImage.png')} style={{width: 250, height: 250, borderRadius: 20, marginVertical: 25}} />

        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 15, marginTop: 20}}>
          <Pressable onPress={() => router.push('auth/register')} style={{backgroundColor: '#A4F4CF', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 15, width: 250}}>
            <Text style={[font, {color: '004F3B', textAlign: 'center', fontSize: 20}]}>Create account</Text>
          </Pressable>

          <Pressable onPress={() => router.push('auth/login')} style={{backgroundColor: '#F5F5F4', paddingVertical: 10, paddingHorizontal: 10, borderColor:'#004F3B', borderWidth: 1, borderRadius: 15, width: 250}}>
            <Text style={[font, {color: '004F3B', textAlign: 'center', fontSize: 20}]}>Login</Text>
          </Pressable>
        </View>
    </View>
  )};

