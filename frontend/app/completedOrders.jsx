
import { View, Text, Image, Pressable } from 'react-native';
import { useState, useCallback } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { font } from '../styles/font';

export default function CompletedOrders() {
    const [shipments, setShipments] = useState([]);
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
            
            <View style={{ height: 450, width: '90%', backgroundColor: '#ECFDF5', borderRadius: 10,  justifyContent: 'flex-start', alignItems: 'center', borderWidth: 2, borderColor: '#004F3B' }}>
                {shipments.length === 0 && ( 
                    <View style={{height: '90%', width: '90%', backgroundColor:"#F3F3F4", justifyContent: 'center', alignItems: 'center', borderRadius: 20}}>
                        <Image source={require('../assets/images/idleBox.png')} style={{width: 200, height: 200, borderRadius: 20}} />
                        <Text style ={[font, {fontSize: 24, textAlign: 'center', marginTop: 20, padding: 30}]}>No Orders Yet, Your orders will show up here</Text>
                    </View>
                )}

                {shipments.map((shipment) => {
                    return (
                        <View style={{height: '30%', width: '90%', backgroundColor:"#FFFFFF", marginTop: 10, justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: 20, paddingTop: 10, borderRadius: 20}} key = {shipment._id}>
                            <Text style={[font,{fontSize: 18, fontWeight: 'bold'}]}>Order Number: {shipment.orderNumber}</Text>

                            <Text style={[font]}>📦Item: {shipment.itemDescription}</Text>
                            <Text style={[font]}>📍Deliver To: {shipment.destination}</Text>
                            <Text style={[font]}>⌚Status: Completed</Text>
                        </View>
                    )
                })}
            </View>
        </View>
    )

}