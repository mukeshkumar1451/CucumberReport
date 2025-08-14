import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, TextInput, Dialog, Portal, HelperText, Chip } from 'react-native-paper';
import { z } from 'zod';

const policySchema = z.object({
  cancellation: z.string().min(1, 'Enter cancellation policy'),
});
const pricingSchema = z.object({
  day: z.string().min(1, 'Select day'),
  start: z.string().min(1, 'Start time required'),
  end: z.string().min(1, 'End time required'),
  price: z.string().min(1, 'Price required'),
});
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function PoliciesScreen() {
  const [policy, setPolicy] = useState('Full refund up to 24 hours before slot.');
  const [policyEdit, setPolicyEdit] = useState('');
  const [policyDialog, setPolicyDialog] = useState(false);
  const [policyError, setPolicyError] = useState('');
  const [pricingRules, setPricingRules] = useState<any[]>([]);
  const [pricingDialog, setPricingDialog] = useState(false);
  const [pricingForm, setPricingForm] = useState<any>({ day: '', start: '', end: '', price: '' });
  const [pricingError, setPricingError] = useState('');

  const openPolicyEdit = () => { setPolicyEdit(policy); setPolicyDialog(true); setPolicyError(''); };
  const savePolicy = () => {
    try {
      policySchema.parse({ cancellation: policyEdit });
      setPolicy(policyEdit);
      setPolicyDialog(false);
    } catch (e) {
      setPolicyError(e.errors?.[0]?.message || 'Validation failed');
    }
  };
  const openPricing = () => { setPricingForm({ day: '', start: '', end: '', price: '' }); setPricingDialog(true); setPricingError(''); };
  const savePricing = () => {
    try {
      pricingSchema.parse(pricingForm);
      setPricingRules([...pricingRules, { ...pricingForm }]);
      setPricingDialog(false);
    } catch (e) {
      setPricingError(e.errors?.[0]?.message || 'Validation failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Policies & Discounts</Text>
      <Card style={styles.card}>
        <Card.Title title="Cancellation Policy" />
        <Card.Content>
          <Text>{policy}</Text>
          <Button onPress={openPolicyEdit} style={{ marginTop: 8 }}>Edit Policy</Button>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Title title="Special Pricing Rules" />
        <Card.Content>
          <Button onPress={openPricing} style={{ marginBottom: 8 }}>Add Rule</Button>
          <FlatList
            data={pricingRules}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <Card style={{ marginBottom: 8 }}>
                <Card.Content>
                  <Text>{item.day}: {item.start} - {item.end} → ₹{item.price}</Text>
                </Card.Content>
              </Card>
            )}
            ListEmptyComponent={<Text>No rules yet.</Text>}
          />
        </Card.Content>
      </Card>
      <Portal>
        <Dialog visible={policyDialog} onDismiss={() => setPolicyDialog(false)}>
          <Dialog.Title>Edit Cancellation Policy</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Cancellation Policy"
              value={policyEdit}
              onChangeText={setPolicyEdit}
              multiline
              style={{ minHeight: 80 }}
            />
            {policyError ? <HelperText type="error">{policyError}</HelperText> : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setPolicyDialog(false)}>Cancel</Button>
            <Button mode="contained" onPress={savePolicy}>Save</Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog visible={pricingDialog} onDismiss={() => setPricingDialog(false)}>
          <Dialog.Title>Add Pricing Rule</Dialog.Title>
          <Dialog.Content>
            <Text style={{ marginBottom: 8 }}>Day</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
              {days.map(d => (
                <Chip
                  key={d}
                  selected={pricingForm.day === d}
                  onPress={() => setPricingForm((f:any) => ({ ...f, day: d }))}
                  style={{ margin: 4 }}>
                  {d}
                </Chip>
              ))}
            </View>
            <TextInput label="Start Time (HH:MM)" value={pricingForm.start} onChangeText={v => setPricingForm((f:any) => ({ ...f, start: v }))} style={{ marginBottom: 8 }} />
            <TextInput label="End Time (HH:MM)" value={pricingForm.end} onChangeText={v => setPricingForm((f:any) => ({ ...f, end: v }))} style={{ marginBottom: 8 }} />
            <TextInput label="Price" value={pricingForm.price} onChangeText={v => setPricingForm((f:any) => ({ ...f, price: v }))} style={{ marginBottom: 8 }} />
            {pricingError ? <HelperText type="error">{pricingError}</HelperText> : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setPricingDialog(false)}>Cancel</Button>
            <Button mode="contained" onPress={savePricing}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  card: { marginBottom: 16 },
});
