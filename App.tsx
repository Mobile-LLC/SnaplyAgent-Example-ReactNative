/**
 * Snaply Agent — React Native example.
 *
 * The whole integration is in this file: `Snaply.on` and `Snaply.configure` in the effect below,
 * and `<SnaplyRedact>` around what must never leave the phone. There is no Snaply code in the
 * ios or android folders.
 */

import { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Snaply, SnaplyError, SnaplyRedact } from '@snaplyagent/react-native';

import { androidKey, host, iosKey } from './snaply.config';

const user = { id: 'usr_20481', name: 'Maya Kowalski' };

function App() {
  const [items, setItems] = useState(2);
  const [password, setPassword] = useState('hunter2-secret');
  const [card, setCard] = useState('4242 4242 4242 4242');
  const [iban, setIban] = useState('DE89 3704 0044 0532');
  const [passport, setPassport] = useState('AB1234567');
  const [note, setNote] = useState('Leave at the door');
  const [status, setStatus] = useState('Connecting…');
  const addItem = () => setItems(n => n + 1);

  useEffect(() => {
    // 1. Listen before you configure: a request can arrive as soon as the device is registered.
    Snaply.on({
      onRequestShown: () => setStatus('Support asked to see your screen…'),
      onAllowed: () => setStatus('Screenshot shared ✓'),
      onDenied: () => setStatus('You declined the request.'),
      onExpired: () => setStatus('The request expired.'),
      onRemoteControl: active =>
        setStatus(
          active ? 'Support can control this screen.' : 'Remote control ended.',
        ),
      onLiveEnded: () => setStatus('Live session ended.'),
      onError: error => setStatus(`Snaply error: ${error.code}`),
    });
    // 2. Configure once, with the key of this platform's product. `user` is optional — without
    //    it the device stays anonymous and support finds it by the support code.
    Snaply.configure({
      key: Platform.OS === 'ios' ? iosKey : androidKey,
      environment: host,
      user,
    }).then(
      () => setStatus('Ready — support can ask to see this screen.'),
      (error: SnaplyError) => setStatus(`Could not connect: ${error.code}`),
    );
  }, []);

  // When someone signs in after launch.
  const signIn = () => {
    Snaply.identify(user);
    setStatus(`Signed in as ${user.name}.`);
  };

  // On sign-out: detaches the person. The device keeps its support code.
  const signOut = async () => {
    Snaply.reset();
    setStatus(
      `Signed out · support code ${(await Snaply.supportCode()) ?? '—'}`,
    );
  };

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

        {/* Hidden by you: wrap it in SnaplyRedact. The box is painted on the device before the
            image is encoded. */}
        <Text style={styles.label}>Card number</Text>
        <SnaplyRedact>
          <TextInput
            style={styles.input}
            value={card}
            onChangeText={setCard}
            keyboardType="number-pad"
          />
        </SnaplyRedact>

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

        {/* Any view, not only an input. */}
        <Text style={styles.label}>Delivery address</Text>
        <SnaplyRedact>
          <Text style={styles.address}>12 Rue des Lilas, Paris</Text>
        </SnaplyRedact>

        <Text style={styles.error}>Payment failed — card declined (402)</Text>

        {/* An ordinary pressable: an agent with remote control can tap it. */}
        <Pressable
          style={styles.button}
          onPress={addItem}
          testID="addItem"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Add one more</Text>
        </Pressable>

        <View style={styles.row}>
          <Pressable onPress={signOut} accessibilityRole="button">
            <Text style={styles.link}>Sign out</Text>
          </Pressable>
          <Pressable onPress={signIn} accessibilityRole="button">
            <Text style={styles.link}>Sign in</Text>
          </Pressable>
          <Pressable
            onPress={Snaply.showSupportCode}
            accessibilityRole="button"
          >
            <Text style={styles.link}>Support code</Text>
          </Pressable>
        </View>
        <Text style={styles.status}>{status}</Text>
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
  row: { flexDirection: 'row', gap: 20, marginTop: 14 },
  link: {
    color: '#1f6f4a',
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 6,
  },
  status: { fontSize: 13, color: '#5b665e', marginTop: 8 },
});

export default App;
