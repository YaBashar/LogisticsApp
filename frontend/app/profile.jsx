import { View, Text } from 'react-native'
import useAuth from '@/hooks/useAuth';
import { font } from '../styles/font';  

export default function Profile() {
    const { role } = useAuth();

    return(
        <>
            { role === 'admin' ? (
                <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
                    <Text style={[font, { fontSize: 24, color: "#004F3B", marginHorizontal: 10 }]}>Admin Profile</Text>
                </View>
                )    
            : (
                <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
                    <Text style={[font, { fontSize: 24, color: "#004F3B", marginHorizontal: 10 }]}>User Profile</Text>
                </View>
            )}
        </>
    )
}