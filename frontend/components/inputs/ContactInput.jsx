import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors, spacing, typography, radii } from "../../constants/theme";

export function ContactInput({
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
    gap: 6,
  },
  columnLabel: {
    fontSize: 11,
    fontWeight: typography.weight.semibold,
    color: colors.primaryDeep,
    letterSpacing: 0.2,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderMedium,
    alignSelf: "stretch",
    marginTop: 6,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: colors.borderMedium,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.neutral50,
    fontSize: typography.size.base,
    color: colors.textPrimary,
  },
});
