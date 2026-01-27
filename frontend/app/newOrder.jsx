import {useState} from 'react'
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { font } from '../styles/font';
import AddressInput from '../components/inputs/AddressInput';
import PackageTypeInput from '../components/inputs/PackageTypeInput';
import { router } from 'expo-router';
import ItemInfoInput from '../components/inputs/ItemInfoInput';
import ContactInput from '../components/inputs/ContactInput';

export default function NewOrder() {

    const [itemDescription, setItemDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [packageType, setPackageType] = useState('');
    const [weight, setWeight] = useState('');
    const [senderEmail, setSenderEmail] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [senderPhone, setSenderPhone] = useState('');
    const [recipientPhone, setRecipientPhone] = useState('');

	// State for new parameters

    const axiosPrivate = useAxiosPrivate();

    const handleSubmitNewOrder = async () => { 
      try {
        const quantityInt = parseInt(quantity, 10);
        const weightInt = parseInt(weight, 10);
        console.log(packageType);

        const res = await axiosPrivate.post(
          '/shipments-customer/', 
          { 
            packageType,
            itemDescription, 
            quantity: quantityInt,
            weight: weightInt,
            destination, 
            origin,
            senderEmail,
            senderPhone,
            recipientEmail,
            recipientPhone
          }
        );
        alert('Successfully Created New Order', res.data.result);
        router.push('/customerProfile')

        // Clear Form fields
        setItemDescription('');
        setQuantity('');
        setWeight('');
        setOrigin('');
        setDestination('');
        setPackageType('');

        setRecipientEmail('');
        setSenderEmail('');
        setRecipientPhone('');
        setSenderPhone('');

      } catch (error) {
        console.error(error);
        alert('Failed To Create Order', error.response.data.message);
      }
    }
    
    return (
      <KeyboardAvoidingView
        style={{ backgroundColor: 'white' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ alignItems: 'center' }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[font, { marginTop: 50, fontSize: 32, color: "#004F3B", marginHorizontal: 10 }]}>
            New Booking
          </Text>

          <PackageTypeInput 
            packageType={packageType} 
            setPackageType={setPackageType}
          />

          {/* Delivery Details */}
          <View style={{height: 130, backgroundColor: '#E7E5E4', borderRadius: 10}}>
            <Text style={[font, {paddingLeft: 10, paddingTop: 10}]}>Details</Text>
              
            <AddressInput 
              value={origin}
              onChangeText={setOrigin}
              style={styles.mediumInput}
              placeholder="Pickup From"
              placeholderTextColor="#A6A09B"
            />
            
            <AddressInput 
              value={destination}
              onChangeText={setDestination}
              style={styles.mediumInput}
              placeholder="Deliver To"
              placeholderTextColor="#A6A09B"
            />		
          </View>

          <ItemInfoInput
            itemDescription={itemDescription}
            setItemDescription={setItemDescription}
            quantity={quantity}
            setQuantity={setQuantity}
            weight={weight}
            setWeight={setWeight}
          />

          <ContactInput
            senderEmail={senderEmail}
            setSenderEmail={setSenderEmail}
            senderPhone={senderPhone}
            setSenderPhone={setSenderPhone}
            recipientEmail={recipientEmail}
            setRecipientEmail={setRecipientEmail}
            recipientPhone={recipientPhone}
            setRecipientPhone={setRecipientPhone}
          />
        
          <Pressable 
            onPress={handleSubmitNewOrder} 
            style={{
              marginTop: 15, 
              backgroundColor: '#A4F4CF', 
              paddingVertical: 10, 
              paddingHorizontal: 10, 
              borderRadius: 15, 
              width: 250
            }}
          >
            <Text style={[font, {color: '#004F3B', textAlign: 'center', fontSize: 20}]}>
              Book Now
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
  input: { width: 250, height: 45, borderColor:'#004F3B', borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 10 },
  mediumInput: {marginHorizontal: 10, width: 230, height: 40, borderColor:'#004F3B', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10 },
  halfInput: { width: 120, height: 50, borderColor:'#004F3B', borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 10 }
})