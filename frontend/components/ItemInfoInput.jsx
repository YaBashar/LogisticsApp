import { View, Text, TextInput, StyleSheet } from 'react-native'
import { font } from '../styles/font';

export default function ItemInfoInput({itemDescription, setItemDescription, quantity, setQuantity, weight, setWeight}) {
    return(
        <View>
            <Text style={[font]}>Item Information</Text>
            <TextInput 
                value={itemDescription} 
                onChangeText={setItemDescription} 
                style={[styles.input, { marginBottom: 5 }]}
                placeholder="Enter Item Description" 
                placeholderTextColor="#A6A09B" 
            />
            
            <View style={{flexDirection: 'row', justifyContent:'space-around'}}>
                <TextInput 
                keyboardType="numeric" 
                value={quantity} 
                onChangeText={setQuantity} 
                style={styles.halfInput}
                placeholder="Quantity" 
                placeholderTextColor="#A6A09B" 
                />

                <TextInput 
                keyboardType="numeric" 
                value={weight} 
                onChangeText={setWeight} 
                style={styles.halfInput}
                placeholder="Weight (KG)" 
                placeholderTextColor="#A6A09B" 
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  input: { width: 250, height: 45, borderColor:'#004F3B', borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 10 },
  mediumInput: {marginHorizontal: 10, width: 230, height: 40, borderColor:'#004F3B', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10 },
  halfInput: { width: 120, height: 50, borderColor:'#004F3B', borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 10 }
})