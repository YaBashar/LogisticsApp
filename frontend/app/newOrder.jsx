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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { font } from "../styles/font";
import AddressInput from "../components/inputs/AddressInput";
import PackageTypeInput from "../components/inputs/PackageTypeInput";
import { router } from "expo-router";
import ItemInfoInput from "../components/inputs/ItemInfoInput";
import ContactInput from "../components/inputs/ContactInput";
import { axiosPrivate } from "../services/axios";
import { AuthenticatedScreenHeader } from "../components/AuthenticatedScreenHeader";

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

  const handleSubmitNewOrder = async () => {
    try {
      const quantityInt = parseInt(quantity, 10);
      const weightInt = parseInt(weight, 10);
      const heightInt = parseInt(height, 10);
      const widthInt = parseInt(width, 10);
      const lengthInt = parseInt(length, 10);

      const res = await axiosPrivate.post("/shipments-customer/", {
        packageType,
        itemDescription,
        quantity: quantityInt,
        weight: weightInt,
        height: heightInt,
        width: widthInt,
        length: lengthInt,
        destination,
        origin,
        senderEmail,
        senderPhone,
        recipientEmail,
        recipientPhone,
      });
      alert("Successfully Created New Order", res.data.result);
      router.push("/profile");

      // Clear Form fields
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
      console.error(error);
      alert("Failed To Create Order", error.response.data.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["left", "right", "bottom"]}>
      <AuthenticatedScreenHeader title="New booking" />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "white" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ alignItems: "center", paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={[
              font,
              {
                marginTop: 16,
                fontSize: 22,
                color: "#004F3B",
                marginHorizontal: 10,
              },
            ]}
          >
            Request a shipment
          </Text>

          <View style={[styles.sectionCard, styles.layerBase, { width: contentMaxWidth }]}>
            <Text style={[font, styles.sectionTitle]}>Package type</Text>
            <PackageTypeInput packageType={packageType} setPackageType={setPackageType} />
          </View>

          {/* Delivery Details */}
          <View style={[styles.sectionCard, styles.layerTop, { width: contentMaxWidth }]}>
            <Text style={[font, styles.sectionTitle]}>Details</Text>

            <AddressInput
              value={origin}
              onChangeText={setOrigin}
              style={[styles.mediumInput, { width: "100%" }]}
              wrapperStyle={styles.pickupAddressWrapper}
              placeholder="Pickup From"
              placeholderTextColor="#A6A09B"
            />

            <AddressInput
              value={destination}
              onChangeText={setDestination}
              style={[styles.mediumInput, { width: "100%" }]}
              wrapperStyle={styles.destinationAddressWrapper}
              placeholder="Deliver To"
              placeholderTextColor="#A6A09B"
            />
          </View>

          <View style={[styles.sectionCard, styles.layerMiddle, { width: contentMaxWidth }]}>
            <Text style={[font, styles.sectionTitle]}>Item information</Text>
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
            <Text style={[font, styles.sectionTitle]}>Contact details</Text>
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

          <Pressable
            onPress={handleSubmitNewOrder}
            style={({ pressed }) => [
              styles.primaryButton,
              { width: contentMaxWidth, opacity: pressed ? 0.92 : 1 },
            ]}
          >
            <Text style={[font, styles.primaryButtonText]}>Book Now</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#CFEFE1",
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  sectionCard: {
    position: "relative",
    marginTop: 10,
    padding: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 3,
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
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "700",
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  input: {
    width: 250,
    height: 45,
    borderColor: "#004F3B",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  mediumInput: {
    marginBottom: 10,
    height: 40,
    borderColor: "rgba(15, 23, 42, 0.14)",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "rgba(248,250,252,0.9)",
  },
  pickupAddressWrapper: {
    zIndex: 20,
    elevation: 20,
  },
  destinationAddressWrapper: {
    zIndex: 10,
    elevation: 10,
  },
  halfInput: {
    width: 120,
    height: 50,
    borderColor: "#004F3B",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  primaryButton: {
    marginTop: 14,
    borderRadius: 18,
    backgroundColor: "#1E9E73",
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
