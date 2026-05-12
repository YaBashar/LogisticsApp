import { useEffect, useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import Constants from "expo-constants";

export default function AddressInput({
  value,
  onChangeText,
  style,
  wrapperStyle,
  placeholder,
  placeholderTextColor,
  countries = ["au", "sa"],
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused || value.length === 0) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      searchAddress(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value, isFocused]);

  const searchAddress = async (text) => {
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    const API_KEY = Constants.expoConfig?.extra?.geoApiKey;
    try {
      const countryFilter = `countrycode:${countries.join(",")}`;
      const response = await axios.get("https://api.geoapify.com/v1/geocode/autocomplete", {
        params: {
          text: text,
          apiKey: API_KEY,
          filter: countryFilter,
        },
      });
      console.log("API Response:", response.data); // Debug
      setSuggestions(response.data.features || []);
    } catch (error) {
      console.error("Error fetching address suggestions:", error.message);
      setSuggestions([]);
    }
  };

  const selectAddress = (item) => {
    onChangeText(item.properties.formatted);
    setSuggestions([]);
    console.log("Selected:", item.properties);
  };

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <TextInput
        style={style}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          setSuggestions([]);
        }}
      />

      {isFocused && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <ScrollView
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="always"
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
    position: "relative",
    width: "100%",
    zIndex: 100,
  },
  suggestionsContainer: {
    position: "absolute",
    top: 62,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.14)",
    borderRadius: 12,
    maxHeight: 150,
    zIndex: 9999,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestion: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "white",
  },
  suggestionText: {
    fontSize: 14,
    color: "#333",
  },
});
