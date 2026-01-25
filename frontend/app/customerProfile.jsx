import { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { font } from '../styles/font';
import ActiveOrders from './activeOrders';
import CompletedOrders from './completedOrders';

export default function CustomerProfile() {
    
    const tabs = ['Active', 'Completed'];
    const [activeTab, setActiveTab] = useState('Active');

    return (
    <> 
      <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-start", alignItems: "center", backgroundColor: "white" }}>
        <Text style={[font, { marginTop: 35, fontSize: 32, color: "#004F3B", marginHorizontal: 10 }]}>My Orders</Text>

        <View style={{flexDirection: 'row', gap: 10}}>
            {tabs.map((tab) => {
              return (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)} 
                  style={({ pressed }) => [
                    {
                      marginTop: 5,
                      marginBottom: 10, 
                      padding: 10,
                      borderRadius: 5, 
                      borderWidth: 1, 
                      borderColor: "#004F3B",
                      backgroundColor: activeTab === tab ? '#A4F4CF' : 'white',  // ← Active state
                      opacity: pressed ? 0.7 : 1  // ← Pressed feedback
                    }
                  ]}
                >
                  <Text style={[font]}>{tab} Orders</Text>
                </Pressable>
              )
            })} 
          </View>

        { activeTab === 'Completed' && <CompletedOrders/> }
        { activeTab === 'Active' && <ActiveOrders/>}

      </View>
    </>    
    )
}
