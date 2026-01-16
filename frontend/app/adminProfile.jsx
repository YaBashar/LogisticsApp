import React from 'react'
import { View, Text } from 'react-native'
import { font } from '../styles/font';

export default function CustomerProfile() {
    return (
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "start", alignItems: "center", backgroundColor: "white" }}>
            <Text style={[font, { marginTop: 100, fontSize: 24, color: "#004F3B", marginHorizontal: 10 }]}>Admin Dashboard</Text>
        </View>
    )
}