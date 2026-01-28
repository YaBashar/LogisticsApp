import { View, Text, TextInput, StyleSheet } from 'react-native'
import { font } from '../../styles/font';

export default function ItemInfoInput({
    itemDescription, 
    setItemDescription, 
    quantity, 
    setQuantity, 
    weight, 
    setWeight, 
    height, 
    setHeight, 
    width, 
    setWidth, 
    length, 
    setLength
}) {
    return(
        <View style={{marginTop: 5}}>
            <Text style={[font]}>Item Information</Text>
            <TextInput 
                value={itemDescription} 
                onChangeText={setItemDescription} 
                style={[styles.input, { marginBottom: 5 }]}
                placeholder="Enter Item Description" 
                placeholderTextColor="#A6A09B" 
            />
            
            <View style={{flexDirection: 'row', marginBottom: 5, gap: 10}}>
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

            <View style={{flexDirection: 'row', gap: 5}}>

                <TextInput 
                keyboardType="numeric" 
                value={height} 
                onChangeText={setHeight} 
                style={styles.thirdInput}
                placeholder="Height (m)" 
                placeholderTextColor="#A6A09B" 
                />

                <TextInput 
                keyboardType="numeric" 
                value={width} 
                onChangeText={setWidth} 
                style={styles.thirdInput}
                placeholder="Width (M)" 
                placeholderTextColor="#A6A09B" 
                />

                <TextInput 
                keyboardType="numeric" 
                value={length} 
                onChangeText={setLength} 
                style={styles.thirdInput}
                placeholder="Length (M)" 
                placeholderTextColor="#A6A09B" 
                />  

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  input: { width: 285, height: 40, borderColor:'#004F3B', borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 10 },
  halfInput: { width: 137, height: 40, borderColor:'#004F3B', borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 10 },
  thirdInput: { width: 95, height: 40, borderColor:'#004F3B', borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 5 }
})