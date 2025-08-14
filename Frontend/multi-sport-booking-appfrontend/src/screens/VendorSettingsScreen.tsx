import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, TextInput, HelperText } from 'react-native-paper';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Phone required'),
});
const bankSchema = z.object({
  account: z.string().min(1, 'Account number required'),
  ifsc: z.string().min(1, 'IFSC required'),
});

export default function VendorSettingsScreen() {
  const [profile, setProfile] = useState({ name: 'Vendor Name', email: 'vendor@mail.com', phone: '9999999999' });
  const [profileEdit, setProfileEdit] = useState(profile);
  const [profileError, setProfileError] = useState('');
  const [bank, setBank] = useState({ account: '', ifsc: '' });
  const [bankError, setBankError] = useState('');
  const [support, setSupport] = useState('1800-123-456');
  const [apiKey] = useState('sk_test_1234567890abcdef');

  const saveProfile = () => {
    try {
      profileSchema.parse(profileEdit);
      setProfile(profileEdit);
      setProfileError('');
    } catch (e) {
      setProfileError(e.errors?.[0]?.message || 'Validation failed');
    }
  };
  const saveBank = () => {
    try {
      bankSchema.parse(bank);
      setBankError('');
    } catch (e) {
      setBankError(e.errors?.[0]?.message || 'Validation failed');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Vendor Settings</Text>
      <Card style={styles.card}>
        <Card.Title title="Profile" />
        <Card.Content>
          <TextInput label="Name" value={profileEdit.name} onChangeText={v => setProfileEdit(f => ({ ...f, name: v }))} style={styles.input} />
          <TextInput label="Email" value={profileEdit.email} onChangeText={v => setProfileEdit(f => ({ ...f, email: v }))} style={styles.input} />
          <TextInput label="Phone" value={profileEdit.phone} onChangeText={v => setProfileEdit(f => ({ ...f, phone: v }))} style={styles.input} />
          {profileError ? <HelperText type="error">{profileError}</HelperText> : null}
          <Button mode="contained" onPress={saveProfile}>Save Profile</Button>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Title title="Bank Details (for payouts)" />
        <Card.Content>
          <TextInput label="Account Number" value={bank.account} onChangeText={v => setBank(f => ({ ...f, account: v }))} style={styles.input} />
          <TextInput label="IFSC" value={bank.ifsc} onChangeText={v => setBank(f => ({ ...f, ifsc: v }))} style={styles.input} />
          {bankError ? <HelperText type="error">{bankError}</HelperText> : null}
          <Button mode="contained" onPress={saveBank}>Save Bank Details</Button>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Title title="Support Contact" />
        <Card.Content>
          <TextInput label="Support Contact" value={support} onChangeText={setSupport} style={styles.input} />
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Title title="API Key" />
        <Card.Content>
          <Text selectable>{apiKey}</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', alignItems: 'center', padding: 16 },
  card: { width: '100%', maxWidth: 400, marginBottom: 16, padding: 8 },
  input: { marginBottom: 8 },
});
