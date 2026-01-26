import { View, Text, Image, Pressable, TouchableOpacity } from 'react-native';
import { font } from '../styles/font';

export default function ShipmentCard({ shipment, expandedOrder, setExpandedOrder }) {

  const isExpanded = expandedOrder === shipment._id;

  return (
    <>
      <TouchableOpacity 
        key={shipment._id}
        onPress={() => setExpandedOrder(isExpanded ? null : shipment._id)}
        activeOpacity={0.7}
      >
        <View style={{ width: 275, backgroundColor: "white", marginTop: 10, marginHorizontal: 10, borderRadius: 16, borderWidth: 1, borderColor: '#E5E5E5', overflow: 'hidden'}}>
            {/* Main Card Content */}
          <View style={{ padding: 10 }}>
              {/* Header Row */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <Text style={[font, { fontSize: 10, color: '#666', marginBottom: 4 }]}>
                  #{shipment.orderNumber}
                </Text>
                <Text style={[font, { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 2 }]}>
                  {shipment.itemDescription}
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
                  <Text style={[font, { fontSize: 11, color: '#666' }]}>
                    ⚖️ {shipment.weight} kg
                  </Text>
                  <Text style={[font, { fontSize: 11, color: '#666' }]}>
                    📦 {shipment.packageType.charAt(0).toUpperCase() + shipment.packageType.slice(1)}
                  </Text>
                </View>
              </View>
                  
              {/* Status Badge */}
              <View style={{ backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                  <Text style={[font, { fontSize: 11, color: '#92400E', fontWeight: '600' }]}>
                      Pending
                  </Text>
              </View>
            </View>
              
              {/* Route Display */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 }}>
                <Text style={[font, { fontSize: 12, color: '#666', flex: 1 }]} numberOfLines={1}>
                  {shipment.origin}
                </Text>
                <Text style={{ fontSize: 14, color: '#14B8A6' }}>-{'>'}</Text>
                <Text style={[font, { fontSize: 12, color: '#666', flex: 1, textAlign: 'right' }]} numberOfLines={1}>
                  {shipment.destination}
                </Text>
              </View>
              
              {/* Expand/Collapse Indicator */}
              <View style={{ alignItems: 'center', marginTop: 8 }}>
                  <Text style={{ fontSize: 14, color: '#004F3B', fontWeight: 'bold' }}>
                      View Details {isExpanded ? '⬆️' : '⬇️'}
                  </Text>
              </View>
          </View>
          
          {/* Expanded Content */}
          {isExpanded && (
            <View style={{ backgroundColor: '#F9FAFB', padding: 10, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>

              <View style={{ marginBottom: 6 }}>
                <Text style={[font, { fontSize: 10, color: '#6B7280' }]}>
                  Full Origin Address
                </Text>
                <Text style={[font, { fontSize: 12, color: '#374151' }]}>
                  {shipment.origin}
                </Text>
              </View>

              <View>
                <Text style={[font, { fontSize: 10, color: '#6B7280' }]}>
                  Full Destination
                </Text>
                <Text style={[font, { fontSize: 12, color: '#374151' }]}>
                  {shipment.destination}
                </Text>
              </View>
                  
            </View>
          )}
        </View>
      </TouchableOpacity>  
    </>
  )
}