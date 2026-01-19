import { useEffect, useState } from 'react'
import { View, Text, Pressable, Image } from 'react-native'
import { font } from '../styles/font';

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import NewOrderModal from './newOrderModal';

export default function CustomerProfile() {
    const axiosPrivate = useAxiosPrivate();

    const [shipments, setShipments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);


    useEffect(() => {
        const fetchActiveShipments = async () => {
            try {
                const res = await axiosPrivate.get('/shipments-customer/active');
                console.log(res.data.result);
                setShipments(res.data.result);
            } catch (error) {
                console.error(error);
            }
        }
        fetchActiveShipments();
    }, [refreshTrigger])

    
    return (
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-start", alignItems: "center", backgroundColor: "white" }}>
            <Text style={[font, { marginTop: 50, fontSize: 32, color: "#004F3B", marginHorizontal: 10 }]}>My Orders</Text>
            <Text style={[font, { marginVertical: 10, fontSize: 24, color: "#004F3B" }]}>Active Orders</Text>
            
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
                            <Text style={[font]}>⌚Status: Pending</Text>
                        </View>
                    )
                })}
            </View>

            <NewOrderModal 
                showModal={showModal}
                setShowModal={setShowModal}
                setRefreshTrigger={setRefreshTrigger}
            ></NewOrderModal>
        
            <Pressable onPress={() => setShowModal(true)} style={{marginTop: 20, marginBottom:50, backgroundColor: '#A4F4CF',  paddingVertical: 10, paddingHorizontal: 10, borderRadius: 15, width: 250}}>
                <Text style={[font, {color: '004F3B', textAlign: 'center', fontSize: 20}]}>Request New Order</Text>
            </Pressable>
        </View>
    )
}
