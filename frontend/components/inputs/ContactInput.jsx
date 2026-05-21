import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors, spacing, typography, radii, touch } from "@/constants/theme";

export default function ContactInput({
  senderEmail,
  setSenderEmail,
  senderPhone,
  setSenderPhone,
  recipientEmail,
  setRecipientEmail,
  recipientPhone,
  setRecipientPhone,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Text style={styles.columnLabel}>Sender</Text>
        <TextInput
          value={senderEmail}
          onChangeText={setSenderEmail}
          placeholder="Email"
          placeholderTextColor={colors.textPlaceholder}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          accessibilityLabel="Sender email"
        />
        <TextInput
          value={senderPhone}
          onChangeText={setSenderPhone}
          placeholder="Phone"
          placeholderTextColor={colors.textPlaceholder}
          keyboardType="phone-pad"
          style={styles.input}
          returnKeyType="next"
          accessibilityLabel="Sender phone"
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.column}>
        <Text style={styles.columnLabel}>Recipient</Text>
        <TextInput
          value={recipientEmail}
          onChangeText={setRecipientEmail}
          placeholder="Email"
          placeholderTextColor={colors.textPlaceholder}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          accessibilityLabel="Recipient email"
        />
        <TextInput
          value={recipientPhone}
          onChangeText={setRecipientPhone}
          placeholder="Phone"
          placeholderTextColor={colors.textPlaceholder}
          keyboardType="phone-pad"
          style={styles.input}
          returnKeyType="done"
          accessibilityLabel="Recipient phone"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  column: {
    flex: 1,
    gap: spacing.sm,
  },
  columnLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderMedium,
    alignSelf: "stretch",
    marginTop: spacing.xl,
  },
  input: {
    width: "100%",
    height: touch.inputHeight,
    borderColor: colors.primaryDeep,
    borderWidth: 1.5,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primarySurface,
    fontSize: typography.size.base,
    color: colors.textPrimary,
  },
});
