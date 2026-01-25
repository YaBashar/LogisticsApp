
import { View, Text, Image, Pressable, TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { font } from '../styles/font';
import { router } from 'expo-router';
import ShipmentCard from './shipmentCard';

export default function ActiveOrders() {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
      const fetchActiveShipments = async () => {
        try {
          setLoading(true)
          const res = await axiosPrivate.get('/shipments-customer/active');
          console.log(res.data.result);
          setShipments(res.data.result);
        } catch (error) {
            console.error(error);
        } finally {
          setLoading(false)
        }
      }
      fetchActiveShipments();
    }, [axiosPrivate])
    
    

    return (
      
      <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-start", alignItems: "center", backgroundColor: "white" }}>

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#004F3B" />
            <Text style={[font, { marginTop: 10, color: '#666', fontSize: 14 }]}>
              Loading orders...
            </Text>
          </View>
        ) : (

          <>
            <View style={{ height: 475, width: 300, backgroundColor: '#ECFDF5', borderRadius: 10,  justifyContent: 'flex-start', alignItems: 'center', borderWidth: 2, borderColor: '#004F3B' }}>
              {shipments.length === 0 && ( 
                <View style={{height: 300, width: '90%', backgroundColor:"#F3F3F4", justifyContent: 'center', alignItems: 'center', borderRadius: 20}}>
                  <Image source={require('../assets/images/idleBox.png')} style={{width: 200, height: 200, borderRadius: 20}} />
                  <Text style ={[font, {fontSize: 24, textAlign: 'center', marginTop: 20, padding: 30}]}>No Orders Yet, Your orders will show up here</Text>
                </View>
              )}

              <ShipmentCard 
                shipments={shipments}
                expandedOrder={expandedOrder}
                setExpandedOrder={setExpandedOrder}
              /> 
              
            </View>

            <Pressable 
            onPress={() => router.push('/newOrder')} 
            style={{marginTop: 20, marginBottom:50, backgroundColor: '#A4F4CF',  paddingVertical: 10, paddingHorizontal: 10, borderRadius: 15, width: 250}}>
                <Text style={[font, {color: '004F3B', textAlign: 'center', fontSize: 20}]}>Request New Order</Text>
            </Pressable>
          </>
        )}

        
      </View>
    )

}