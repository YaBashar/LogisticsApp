import {useState} from 'react'
import { View, Text, Modal, StyleSheet, TextInput, Pressable } from 'react-native'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { font } from '../styles/font';

export default function NewOrderModal({ showModal, setShowModal, setRefreshTrigger }) {

    const [name, setName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [arriveBy, setArriveBy] = useState('');

    const axiosPrivate = useAxiosPrivate();

    const handleSubmitNewOrder = async () => {
        // Submit new order logic here
        
        try {
            const quantityInt = parseInt(quantity, 10);
            const res = await axiosPrivate.post('/shipments-customer/', { name, itemDescription, quantity: quantityInt, arriveBy, destination, origin })
            alert('Successfully Created New Order', res.data.result);
            setShowModal(false);
            setRefreshTrigger(prev => prev + 1);

            // Clear Form fields
            setName('');
            setItemDescription('');
            setQuantity('');
            setOrigin('');
            setDestination('');
            setArriveBy('');

        } catch (error) {
            console.error(error);
            alert('Failed To Create Order', error.response.data.message);
        }
    }
    
    return (
        <Modal visible={showModal} onRequestClose={() => setShowModal(false)} transparent>
                
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                <View style={{width: 300, height: 550, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#FFFFFF' }}>

                    <Pressable onPress={() => setShowModal(false)} style={{position: 'absolute',top: -5,right: 10, zIndex: 1,padding: 5}}>
                        <Text style={{fontSize: 24, fontWeight: 'bold', color: '#004F3B'}}>✕</Text>
                    </Pressable>

                    <View style ={{ flexDirection: 'column', gap: 10, marginTop: 15 }}>
                        <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Enter Order Name" placeholderTextColor="#A6A09B" ></TextInput>
                        <TextInput value={itemDescription} onChangeText={setItemDescription} style={styles.input} placeholder="Enter Item Description" placeholderTextColor="#A6A09B"></TextInput>
                        <TextInput keyboardType="numeric" value={quantity} onChangeText={setQuantity} style={styles.input} placeholder="Enter Quantity" placeholderTextColor="#A6A09B"></TextInput>
                        <TextInput value={origin} onChangeText={setOrigin} style={styles.input} placeholder="Enter Origin Country" placeholderTextColor="#A6A09B"></TextInput>
                        <TextInput value={destination} onChangeText={setDestination} style={styles.input} placeholder="Enter Destination Country" placeholderTextColor="#A6A09B"></TextInput>
                        <TextInput value={arriveBy} onChangeText={setArriveBy} style={styles.input} placeholder="Enter Arrive By Date" placeholderTextColor="#A6A09B"></TextInput>
                    </View>
                    

                    <Pressable  onPress={handleSubmitNewOrder} style={{marginTop: 20, backgroundColor: '#A4F4CF',  paddingVertical: 10, paddingHorizontal: 10, borderRadius: 15, width: 250}}>
                        <Text style={[font, {color: '#004F3B', textAlign: 'center', fontSize: 20}]}>Submit</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    input: { width: 250, height: 60, borderColor:'#004F3B', borderWidth: 2, borderRadius: 10, paddingHorizontal: 10 }
})