import { useEffect, useState } from "react";
import { View, TextInput, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import { colors, spacing, typography, radii, touch, shadows } from "@/constants/theme";

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
        params: { text, apiKey: API_KEY, filter: countryFilter },
      });
      setSuggestions(response.data.features || []);
    } catch (error) {
      setSuggestions([]);
    }
  };

  const selectAddress = (item) => {
    onChangeText(item.properties.formatted);
    setSuggestions([]);
  };

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <TextInput
        style={[styles.defaultInput, style]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor ?? colors.textPlaceholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          setSuggestions([]);
        }}
        returnKeyType="done"
        accessibilityLabel={placeholder}
      />

      {isFocused && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <ScrollView
            nestedScrollEnabled
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            {suggestions.map((item, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.suggestion,
                  pressed && styles.suggestionPressed,
                  index === suggestions.length - 1 && styles.suggestionLast,
                ]}
                onPress={() => selectAddress(item)}
                accessibilityRole="button"
                accessibilityLabel={item.properties.formatted}
              >
                <Text style={styles.suggestionText} numberOfLines={2}>
                  {item.properties.formatted}
                </Text>
              </Pressable>
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
  defaultInput: {
    width: "100%",
    height: 40,
    borderColor: colors.borderMedium,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    backgroundColor: "rgba(248,250,252,0.9)",
    fontSize: typography.size.base,
    color: colors.textPrimary,
  },
  suggestionsContainer: {
    position: "absolute",
    top: 40 + spacing.xs,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: radii.md,
    maxHeight: 160,
    zIndex: 9999,
    ...shadows.elevated,
    elevation: 10,
  },
  suggestion: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  suggestionLast: {
    borderBottomWidth: 0,
  },
  suggestionPressed: {
    backgroundColor: colors.primarySurface,
  },
  suggestionText: {
    fontSize: typography.size.base,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.tight,
  },
});
