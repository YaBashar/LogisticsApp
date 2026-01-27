import { View, Text, Image } from 'react-native'
import { font } from '../styles/font';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

export default function CustomerProfile() {

    const [shipments, setShipments] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchActiveShipments = async () => {
            try {
                const res = await axiosPrivate.get('/shipments-admin/active');
                console.log(res.data.result);
                setShipments(res.data.result);
            } catch (error) {
                console.error(error);
            }
        }
        fetchActiveShipments();
    }, [])

    return (
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-start", alignItems: "center", backgroundColor: "white" }}>
            <Text style={[font, { marginTop: 50, fontSize: 32, color: "#004F3B", marginHorizontal: 10 }]}>My Orders</Text>
            <Text style={[font, { marginVertical: 10, fontSize: 24, color: "#004F3B" }]}>Active Orders</Text>
            
            <View style={{ height: 450, width: '90%', backgroundColor: '#ECFDF5', borderRadius: 10,  justifyContent: 'flex-start', alignItems: 'center', borderWidth: 2, borderColor: '#004F3B' }}>
                {shipments.length === 0 && ( 
                    <View style={{height: '90%', width: '90%', backgroundColor:"#F3F3F4", justifyContent: 'center', alignItems: 'center', borderRadius: 20}}>
                        <Image source={require('../assets/images/idleBox.png')} style={{width: 200, height: 200, borderRadius: 20}} />
                        <Text style ={[font, {fontSize: 22, textAlign: 'center', marginTop: 20, padding: 20}]}>No Orders Yet, Your Customer Orders will show up here</Text>
                    </View>
                )}

                
                {shipments.map((shipment) => {
                    return (
                        <View style={{height: '30%', width: '90%', backgroundColor:"#FFFFFF", marginTop: 10, justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: 20, paddingTop: 10, borderRadius: 20}} key = {shipment._id}>
                            <Text>Item: {shipment.itemDescription}</Text>
                            <Text>Quantity: {shipment.quantity}</Text>
                            <Text>Destination: {shipment.destination}</Text>
                            <Text>Arrive By: {shipment.arriveBy}</Text>
                            <Text>Status: Pending </Text>
                            <Text>Orderd By: {shipment.userId.name}</Text>
                        </View>
                    )
                })}
            </View>
        </View>
    )
}