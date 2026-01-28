import   { useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';


export default function AddressInput({ value, onChangeText, style, placeholder, placeholderTextColor, countries = ['au', 'sa'] }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (value.length === 0) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      searchAddress(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  const searchAddress = async (text) => {
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    const API_KEY = Constants.expoConfig?.extra?.geoApiKey;
    try {
      const countryFilter = `countrycode:${countries.join(',')}`; 
      const response = await axios.get('https://api.geoapify.com/v1/geocode/autocomplete', {
        params: {
          text: text,
          apiKey: API_KEY,
          filter: countryFilter,
        }
      });
      console.log('API Response:', response.data); // Debug
      setSuggestions(response.data.features || []);
    } catch (error) {
      console.error('Error fetching address suggestions:', error.message);
      setSuggestions([]);
    }
  };

  const selectAddress = (item) => {
    onChangeText(item.properties.formatted);
    setSuggestions([]);
    console.log('Selected:', item.properties);
  };

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={style}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
      />
      
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <ScrollView 
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {suggestions.map((item, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.suggestion}
                onPress={() => selectAddress(item)}
              >
                <Text style={styles.suggestionText}>{item.properties.formatted}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 300, // Match your input width
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 62,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#004F3B',
    borderRadius: 10,
    maxHeight: 150,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestion: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
});