import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Text, Card, Button, TextInput, Dialog, Portal, Chip, Switch, HelperText } from 'react-native-paper';
import { z } from 'zod';
import { format } from 'date-fns';

const slotBulkSchema = z.object({
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().min(1, 'End date required'),
  daysOfWeek: z.array(z.string()).min(1, 'Select at least one day'),
  startTime: z.string().min(1, 'Start time required'),
  endTime: z.string().min(1, 'End time required'),
  duration: z.string().min(1, 'Duration required'),
  gap: z.string(),
  price: z.string().min(1, 'Price required'),
});

const mockSlots = [
  { id: 's1', date: '2025-08-15', start: '10:00', end: '11:00', available: true, price: '1200' },
  { id: 's2', date: '2025-08-15', start: '11:00', end: '12:00', available: false, price: '1200' },
  { id: 's3', date: '2025-08-15', start: '12:00', end: '13:00', available: true, price: '1200' },
];

export default function SlotManagementScreen() {
  const [slots, setSlots] = useState(mockSlots);
  const [bulkDialog, setBulkDialog] = useState(false);
  const [bulkForm, setBulkForm] = useState<any>({ startDate: '', endDate: '', daysOfWeek: [], startTime: '', endTime: '', duration: '', gap: '', price: '' });
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [editDialog, setEditDialog] = useState(false);
  const [editSlot, setEditSlot] = useState<any>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editError, setEditError] = useState<string | null>(null);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const openBulk = () => {
    setBulkForm({ startDate: '', endDate: '', daysOfWeek: [], startTime: '', endTime: '', duration: '', gap: '', price: '' });
    setBulkDialog(true);
    setBulkError(null);
  };
  const closeBulk = () => { setBulkDialog(false); setBulkError(null); };
  const handleBulkCreate = () => {
    try {
      slotBulkSchema.parse(bulkForm);
      // Mock slot creation
      setSlots([...slots, { id: Math.random().toString(), date: bulkForm.startDate, start: bulkForm.startTime, end: bulkForm.endTime, available: true, price: bulkForm.price }]);
      closeBulk();
    } catch (e) {
      setBulkError(e.errors?.[0]?.message || 'Validation failed');
    }
  };
  const toggleAvailable = (slotId: string) => {
    setSlots(slots.map(s => s.id === slotId ? { ...s, available: !s.available } : s));
  };
  const openEdit = (slot: any) => {
    setEditSlot(slot);
    setEditPrice(slot.price);
    setEditDialog(true);
    setEditError(null);
  };
  const saveEdit = () => {
    if (!editPrice) { setEditError('Price required'); return; }
    setSlots(slots.map(s => s.id === editSlot.id ? { ...s, price: editPrice } : s));
    setEditDialog(false);
    setEditError(null);
  };
  const blockDate = (slotId: string) => {
    setSlots(slots.filter(s => s.id !== slotId)); // Mock block by removal
  };
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Slot Management</Text>
      <Button mode="contained" onPress={openBulk} style={{ marginBottom: 16 }}>Bulk Create Slots</Button>
      <FlatList
        data={slots}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={`${item.start} - ${item.end}`} subtitle={item.date}
              right={() => (
                <Chip style={{ backgroundColor: item.available ? '#C8E6C9' : '#FFCDD2' }}>{item.available ? 'AVAILABLE' : 'UNAVAILABLE'}</Chip>
              )}
            />
            <Card.Content>
              <Text>Price: ₹{item.price}</Text>
            </Card.Content>
            <Card.Actions>
              <Switch value={item.available} onValueChange={() => toggleAvailable(item.id)} />
              <Button onPress={() => openEdit(item)}>Edit Price</Button>
              <Button onPress={() => blockDate(item.id)} color="#d32f2f">Block</Button>
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={<Text>No slots yet.</Text>}
      />
      <Portal>
        <Dialog visible={bulkDialog} onDismiss={closeBulk} style={{ width: '90%', alignSelf: 'center' }}>
          <Dialog.Title>Bulk Create Slots</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView>
              <TextInput label="Start Date (YYYY-MM-DD)" value={bulkForm.startDate} onChangeText={v => setBulkForm((f:any) => ({ ...f, startDate: v }))} style={styles.input} />
              <TextInput label="End Date (YYYY-MM-DD)" value={bulkForm.endDate} onChangeText={v => setBulkForm((f:any) => ({ ...f, endDate: v }))} style={styles.input} />
              <Text style={{ marginVertical: 8 }}>Days of Week</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {days.map(d => (
                  <Chip
                    key={d}
                    selected={bulkForm.daysOfWeek.includes(d)}
                    onPress={() => setBulkForm((f:any) => ({ ...f, daysOfWeek: bulkForm.daysOfWeek.includes(d) ? bulkForm.daysOfWeek.filter((x:string) => x !== d) : [...bulkForm.daysOfWeek, d] }))}
                    style={{ margin: 4 }}>
                    {d}
                  </Chip>
                ))}
              </View>
              <TextInput label="Start Time (HH:MM)" value={bulkForm.startTime} onChangeText={v => setBulkForm((f:any) => ({ ...f, startTime: v }))} style={styles.input} />
              <TextInput label="End Time (HH:MM)" value={bulkForm.endTime} onChangeText={v => setBulkForm((f:any) => ({ ...f, endTime: v }))} style={styles.input} />
              <TextInput label="Slot Duration (mins)" value={bulkForm.duration} onChangeText={v => setBulkForm((f:any) => ({ ...f, duration: v }))} style={styles.input} />
              <TextInput label="Gap Time (mins)" value={bulkForm.gap} onChangeText={v => setBulkForm((f:any) => ({ ...f, gap: v }))} style={styles.input} />
              <TextInput label="Price" value={bulkForm.price} onChangeText={v => setBulkForm((f:any) => ({ ...f, price: v }))} style={styles.input} />
              {bulkError ? <HelperText type="error">{bulkError}</HelperText> : null}
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={closeBulk}>Cancel</Button>
            <Button mode="contained" onPress={handleBulkCreate}>Create</Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog visible={editDialog} onDismiss={() => setEditDialog(false)} style={{ width: '90%', alignSelf: 'center' }}>
          <Dialog.Title>Edit Slot Price</Dialog.Title>
          <Dialog.Content>
            <TextInput label="Price" value={editPrice} onChangeText={setEditPrice} keyboardType="numeric" style={styles.input} />
            {editError ? <HelperText type="error">{editError}</HelperText> : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialog(false)}>Cancel</Button>
            <Button mode="contained" onPress={saveEdit}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  card: { marginBottom: 16 },
  input: { marginBottom: 8 },
});
