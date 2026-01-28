import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native'
import { font } from '../styles/font';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import ShipmentCard from './shipmentCard';

export default function CustomerProfile() {

    const [shipments, setShipments] = useState([]);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isCancelled = false;

        const fetchActiveShipments = async () => {
            if (!hasMore) return;
            if (isCancelled) return;

            setLoading(true);
            try {
                const res = await axiosPrivate.get('/shipments-admin/active');
                const result = res.data.result;

                if (isCancelled) return;

                if (!result || result.length === 0) {
                    setHasMore(false);
                } else {
                    setShipments(prev=> [...prev, ...result]);
                }

            } catch (error) {
                if(!isCancelled) console.error(error);
            } finally {
                if (!isCancelled) setLoading(false);
            }
        }
        fetchActiveShipments();

        return (() =>  {
            isCancelled = true;
        });
    }, [page])

    const loadMore = () => {
        if (!hasMore) return;
        setLoading(true);
        setPage(prev => prev + 1);
    }

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

            
                <FlatList
                    data={shipments}
                    renderItem={({item}) => (
                        <ShipmentCard
                            shipment={item}
                            expandedOrder={expandedOrder}
                            setExpandedOrder={setExpandedOrder}
                        />          
                    )}

                    keyExtractor={(item) => item._id}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={loading ? <ActivityIndicator size="large"/> : null}
                />
            
            </View>
        </View>
    )
}