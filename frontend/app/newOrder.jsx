import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddressInput } from "../components/inputs/AddressInput";
import { PackageTypeInput } from "../components/inputs/PackageTypeInput";
import { router } from "expo-router";
import { ItemInfoInput } from "../components/inputs/ItemInfoInput";
import { ContactInput } from "../components/inputs/ContactInput";
import { axiosPrivate } from "../services/axios";
import { ScreenHeader } from "../components/ScreenHeader";
import { colors, spacing, typography, radii, shadows, touch } from "../constants/theme";

const SCROLL_FADE_STEPS = 8;

function ScrollFade() {
  return (
    <View style={styles.scrollFade} pointerEvents="none">
      {Array.from({ length: SCROLL_FADE_STEPS }, (_, i) => (
        <View key={i} style={[styles.scrollFadeStep, { opacity: (i + 1) / SCROLL_FADE_STEPS }]} />
      ))}
    </View>
  );
}

export default function NewOrder() {
  const { width: screenWidth } = useWindowDimensions();
  const contentMaxWidth = Math.min(420, screenWidth - 32);

  const [itemDescription, setItemDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [packageType, setPackageType] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const canSubmit =
    packageType.trim().length > 0 &&
    origin.trim().length > 0 &&
    destination.trim().length > 0 &&
    itemDescription.trim().length > 0 &&
    !isSubmitting;

  const handleSubmitNewOrder = async () => {
    if (!canSubmit) {
      setSubmitError("Please fill in all required fields before submitting.");
      return;
    }
    try {
      setSubmitError("");
      setIsSubmitting(true);
      await axiosPrivate.post("/shipments-customer/", {
        packageType,
        itemDescription,
        quantity: parseInt(quantity, 10) || 1,
        weight: parseInt(weight, 10) || 0,
        height: parseInt(height, 10) || 0,
        width: parseInt(width, 10) || 0,
        length: parseInt(length, 10) || 0,
        destination,
        origin,
        senderEmail,
        senderPhone,
        recipientEmail,
        recipientPhone,
      });

      Alert.alert("Order created", "Your shipment request has been submitted.", [
        { text: "View orders", onPress: () => router.replace("/dashboard") },
      ]);

      setItemDescription("");
      setQuantity("");
      setWeight("");
      setHeight("");
      setWidth("");
      setLength("");
      setOrigin("");
      setDestination("");
      setPackageType("");
      setRecipientEmail("");
      setSenderEmail("");
      setRecipientPhone("");
      setSenderPhone("");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create order. Please try again.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <ScreenHeader title="New booking" />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.scrollWrapper}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.sectionCard, styles.layerBase, { width: contentMaxWidth }]}>
              <Text style={styles.sectionTitle}>Package type</Text>
              <PackageTypeInput packageType={packageType} setPackageType={setPackageType} />
            </View>

            <View style={[styles.sectionCard, styles.layerTop, { width: contentMaxWidth }]}>
              <Text style={styles.sectionTitle}>Route</Text>
              <AddressInput
                value={origin}
                onChangeText={setOrigin}
                style={styles.addressInput}
                wrapperStyle={styles.pickupAddressWrapper}
                placeholder="Pickup from"
                placeholderTextColor={colors.textPlaceholder}
              />
              <AddressInput
                value={destination}
                onChangeText={setDestination}
                style={[styles.addressInput, { marginBottom: 0 }]}
                wrapperStyle={styles.destinationAddressWrapper}
                placeholder="Deliver to"
                placeholderTextColor={colors.textPlaceholder}
              />
            </View>

            <View style={[styles.sectionCard, styles.layerMiddle, { width: contentMaxWidth }]}>
              <Text style={styles.sectionTitle}>Item information</Text>
              <ItemInfoInput
                itemDescription={itemDescription}
                setItemDescription={setItemDescription}
                quantity={quantity}
                setQuantity={setQuantity}
                weight={weight}
                setWeight={setWeight}
                height={height}
                setHeight={setHeight}
                width={width}
                setWidth={setWidth}
                length={length}
                setLength={setLength}
              />
            </View>

            <View style={[styles.sectionCard, styles.layerBase, { width: contentMaxWidth }]}>
              <Text style={styles.sectionTitle}>Contact details</Text>
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
            </View>
          </ScrollView>
          <ScrollFade />
        </View>

        {!!submitError && (
          <View
            style={[styles.errorBox, { width: contentMaxWidth, alignSelf: "center" }]}
            accessibilityLiveRegion="polite"
          >
            <Text style={styles.errorText}>{submitError}</Text>
          </View>
        )}

        <Pressable
          onPress={handleSubmitNewOrder}
          disabled={!canSubmit}
          style={({ pressed }) => [
            styles.primaryButton,
            { width: contentMaxWidth, alignSelf: "center" },
            !canSubmit && styles.buttonDisabled,
            pressed && canSubmit && styles.buttonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={isSubmitting ? "Submitting order" : "Book Now"}
          accessibilityState={{ disabled: !canSubmit, busy: isSubmitting }}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.textOnDark} />
          ) : (
            <Text style={styles.primaryButtonText}>Book Now</Text>
          )}
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primarySurface,
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.primarySurface,
  },
  scrollWrapper: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: spacing.xs,
  },
  scrollFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 48,
    flexDirection: "column",
  },
  scrollFadeStep: {
    flex: 1,
    backgroundColor: colors.primarySurface,
  },
  pageTitle: {
    marginTop: spacing.base,
    marginBottom: spacing.xs,
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
    color: colors.primaryDeep,
    paddingHorizontal: spacing.xs,
  },
  errorBox: {
    marginTop: spacing.sm,
    backgroundColor: colors.errorBg,
    borderRadius: radii.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.size.base,
    lineHeight: typography.lineHeight.tight,
    textAlign: "center",
  },
  sectionCard: {
    position: "relative",
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderRadius: radii.xl,
    backgroundColor: colors.surface,
    ...shadows.float,
  },
  layerTop: {
    zIndex: 40,
    elevation: 8,
  },
  layerMiddle: {
    zIndex: 10,
    elevation: 2,
  },
  layerBase: {
    zIndex: 1,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: typography.size.base,
    color: colors.primaryDeep,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.sm,
    letterSpacing: 0.2,
  },
  addressInput: {
    marginBottom: spacing.sm,
    height: 40,
    borderColor: colors.borderMedium,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.neutral50,
    fontSize: typography.size.base,
    color: colors.textPrimary,
  },
  pickupAddressWrapper: {
    zIndex: 20,
    elevation: 20,
  },
  destinationAddressWrapper: {
    zIndex: 10,
    elevation: 10,
  },
  primaryButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    height: touch.buttonHeight,
    borderRadius: radii.xl,
    backgroundColor: colors.primaryCTA,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.elevated,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  primaryButtonText: {
    color: colors.textOnDark,
    textAlign: "center",
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.2,
  },
});
