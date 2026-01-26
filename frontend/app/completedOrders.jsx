
import { View, Text, Image, Pressable } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { font } from '../styles/font';
import ShipmentCard from './shipmentCard';

export default function CompletedOrders() {
    const [shipments, setShipments] = useState([]);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const axiosPrivate = useAxiosPrivate();

    // Change to get OutGoingShipments
    useFocusEffect(
        useCallback(() => {
            const fetchActiveShipments = async () => {
                try {
                    const res = await axiosPrivate.get('/shipments-customer/completed');
                    console.log(res.data.result);
                    setShipments(res.data.result);
                } catch (error) {
                    console.error(error);
                }
            }
            fetchActiveShipments();
        }, [axiosPrivate])
    )

    return (
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-start", alignItems: "center", backgroundColor: "white" }}>
            
            <View style={{ height: 480, width: 300, backgroundColor: '#ECFDF5', borderRadius: 10,  justifyContent: 'flex-start', alignItems: 'center', borderWidth: 2, borderColor: '#004F3B' }}>
                {shipments.length === 0 && ( 
                    <View style={{marginTop: 20, height: 440, width: 275, backgroundColor:"#F3F3F4", justifyContent: 'center', alignItems: 'center', borderRadius: 20}}>
                        <Image source={require('../assets/images/idleBox.png')} style={{width: 200, height: 200, borderRadius: 20}} />
                        <Text style ={[font, {fontSize: 24, textAlign: 'center', marginTop: 20, padding: 30}]}>Your Completed Orders will show up here</Text>
                    </View>
                )}

                { shipments.map((shipment) => {
                    <ShipmentCard
                        shipment={shipment}
                        expandedOrder={expandedOrder}
                        setExpandedOrder={setExpandedOrder}
                    ></ShipmentCard>
                })}
            </View>
        </View>
    )

}