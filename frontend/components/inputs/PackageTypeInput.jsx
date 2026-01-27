import { View, Text, Pressable } from 'react-native';
import { font } from '../../styles/font';

export default function PackageTypeInput({ packageType, setPackageType }) {

  const packageTypes = ['pallet', 'crate', 'box'];

  const getButtonStyle = (type, pressed) => ({
    width: 75,
    height: 75,
    backgroundColor: packageType === type ? '#A4F4CF' : '#E7E5E4',
    borderRadius: 10,
    opacity: pressed ? 0.7 : 1,
    borderWidth: packageType === type ? 2 : 0,
    borderColor: '#004F3B',
    justifyContent: 'center',
    alignItems: 'center'
  });


  return (
    <View>
      <Text style={[font]}>Package Type</Text>
      <View style={{flexDirection: 'row', gap: 10, justifyContent: 'flex-start', marginTop: 5, marginBottom: 10 }}>

        {packageTypes.map((type) => {
          return(
            <Pressable
              key={type}
              onPress={() => setPackageType(type)}
              style={({ pressed }) => getButtonStyle(type, pressed)}
            >
              <Text style={{textAlign: 'center'}}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
            </Pressable>
          )
        })}
          
      </View>	
    </View>
  )
}