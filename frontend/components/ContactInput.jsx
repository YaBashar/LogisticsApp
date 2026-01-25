import { View, Text, TextInput, StyleSheet } from 'react-native'
import { font } from '../styles/font';

export default function ContactInput({ 
  senderEmail, 
  setSenderEmail, 
  senderPhone, 
  setSenderPhone, 
  recipientEmail, 
  setRecipientEmail,
  recipientPhone,
  setRecipientPhone
}) {
    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <View style={{flexDirection: 'column', gap: 5}}>
                  <Text style={[font]}>Sender Details</Text>
                  <TextInput 
                    value={senderEmail}
                    onChangeText={setSenderEmail}
                    placeholder='Email'
                    style={styles.halfInput}>
                  </TextInput>

                  <TextInput 
                    value={senderPhone}
                    onChangeText={setSenderPhone}
                    placeholder='Phone No'
                    keyboardType='numeric'
                    style={styles.halfInput}>
                  </TextInput>
                </View>

                <View style={{flexDirection: 'column', gap: 5}}>
                  <Text style={[font]}>Recipient Details</Text>
                  <TextInput 
                    value={recipientEmail}
                    onChangeText={setRecipientEmail}
                    placeholder='Email'
                    style={styles.halfInput}>
                  </TextInput>

                  <TextInput 
                    value={recipientPhone}
                    onChangeText={setRecipientPhone}
                    placeholder='Phone No'
                    keyboardType='numeric'
                    style={styles.halfInput}>
                  </TextInput>
                </View>
              </View>
    )
}

const styles = StyleSheet.create({
  input: { width: 250, height: 45, borderColor:'#004F3B', borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 10 },
  mediumInput: {marginHorizontal: 10, width: 230, height: 40, borderColor:'#004F3B', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10 },
  halfInput: { width: 120, height: 50, borderColor:'#004F3B', borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 10 }
})