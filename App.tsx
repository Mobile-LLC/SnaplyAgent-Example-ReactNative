/**
 * Snaply Agent — React Native example.
 *
 * The SDK itself is started natively (ios/SnaplyExample/AppDelegate.swift and
 * android/.../MainActivity.kt). Nothing in this file calls it: a React Native screen is made of
 * real native views, so the SDK captures it like any other app. What this file shows is how a
 * React Native field is hidden from a capture.
 */

import { useState } from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

function App() {
  const [items, setItems] = useState(2);
  const [password, setPassword] = useState('hunter2-secret');
  const [card, setCard] = useState('4242 4242 4242 4242');
  const [iban, setIban] = useState('DE89 3704 0044 0532');
  const [passport, setPassport] = useState('AB1234567');
  const [note, setNote] = useState('Leave at the door');
  const addItem = () => setItems(n => n + 1);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.screen}>
        <Text style={styles.title}>Acme Delivery</Text>
        <Text style={styles.subtitle}>
          Order #8412 · Margherita pizza · {items}
        </Text>

        {/* Hidden by the SDK on its own: secureTextEntry is the native secure field. */}
        <Text style={styles.label}>Account password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Hidden by the developer: a testID containing "snaply-redact" is the SDK's mark.
            The box is painted on the device before the image is encoded. */}
        <Text style={styles.label}>Card number</Text>
        <TextInput
          style={styles.input}
          value={card}
          onChangeText={setCard}
          keyboardType="number-pad"
          testID="snaply-redact-card"
        />

        {/* Hidden from the dashboard, by identifier: Products → Hidden fields → "ibanField". */}
        <Text style={styles.label}>IBAN</Text>
        <TextInput
          style={styles.input}
          value={iban}
          onChangeText={setIban}
          testID="ibanField"
        />

        {/* Hidden from the dashboard, by text: a rule containing "passport" matches the
            placeholder and the accessibility label. */}
        <Text style={styles.label}>Passport</Text>
        <TextInput
          style={styles.input}
          value={passport}
          onChangeText={setPassport}
          placeholder="Passport number"
          accessibilityLabel="Passport number"
        />

        {/* Not marked: captured as it is. */}
        <Text style={styles.label}>Delivery note</Text>
        <TextInput style={styles.input} value={note} onChangeText={setNote} />

        {/* The mark works on any view, not only on inputs. */}
        <Text style={styles.label}>Delivery address</Text>
        <Text style={styles.address} testID="snaply-redact-address">
          12 Rue des Lilas, Paris
        </Text>

        <Text style={styles.error}>Payment failed — card declined (402)</Text>

        {/* Remote control on iOS reaches a control through accessibility activation, and React
            Native answers that only when onAccessibilityTap is set — so a pressable an agent
            should be able to tap carries it, next to onPress. Android needs nothing. */}
        <Pressable
          style={styles.button}
          onPress={addItem}
          onAccessibilityTap={addItem}
          testID="addItem"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Add one more</Text>
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff', paddingHorizontal: 24 },
  title: { fontSize: 22, fontWeight: '700', color: '#17201a', marginTop: 12 },
  subtitle: { fontSize: 13, color: '#5b665e', marginTop: 4, marginBottom: 6 },
  label: { fontSize: 12, color: '#5b665e', marginTop: 10, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#cfd6d0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    color: '#17201a',
    backgroundColor: '#ffffff',
  },
  address: { fontSize: 15, color: '#17201a', paddingVertical: 6 },
  error: {
    fontSize: 13,
    color: '#b3261e',
    backgroundColor: '#fdecea',
    borderRadius: 8,
    padding: 10,
    marginTop: 14,
  },
  button: {
    marginTop: 14,
    backgroundColor: '#1f6f4a',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
});

export default App;
