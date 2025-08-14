import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Text, Card, Button, TextInput, Dialog, Portal, HelperText, Menu } from 'react-native-paper';
import { z } from 'zod';

const sportSchema = z.object({
  sportId: z.string().min(1, 'Select a sport'),
  pricePerHour: z.string().min(1, 'Enter price'),
});

const mockSports = [
  { id: '1', name: 'Box Cricket' },
  { id: '2', name: 'Badminton' },
  { id: '3', name: 'Football' },
];

const mockVenueSports = [
  { id: 'vs1', sportId: '1', sportName: 'Box Cricket', pricePerHour: '1200' },
  { id: 'vs2', sportId: '2', sportName: 'Badminton', pricePerHour: '800' },
];

export default function SportManagementScreen() {
  const [venueSports, setVenueSports] = useState(mockVenueSports);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState<any>({ sportId: '', pricePerHour: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const openAdd = () => {
    setForm({ sportId: '', pricePerHour: '' });
    setDialogVisible(true);
    setFormError(null);
  };
  const closeDialog = () => {
    setDialogVisible(false);
    setFormError(null);
  };
  const handleSave = () => {
    try {
      const validated = sportSchema.parse(form);
      const sport = mockSports.find(s => s.id === validated.sportId);
      setVenueSports([...venueSports, { id: Math.random().toString(), sportId: validated.sportId, sportName: sport?.name, pricePerHour: validated.pricePerHour }]);
      closeDialog();
    } catch (e) {
      setFormError(e.errors?.[0]?.message || 'Validation failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Sport Management</Text>
      <Button mode="contained" onPress={openAdd} style={{ marginBottom: 16 }}>
        Add Sport Mapping
      </Button>
      <FlatList
        data={venueSports}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.sportName} subtitle={`₹${item.pricePerHour}/hr`} />
          </Card>
        )}
        ListEmptyComponent={<Text>No sports mapped yet.</Text>}
      />
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={closeDialog} style={{ width: '90%', alignSelf: 'center' }}>
          <Dialog.Title>Add Sport Mapping</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={<Button mode="outlined" onPress={() => setMenuVisible(true)} style={{ marginBottom: 8 }}>{mockSports.find(s => s.id === form.sportId)?.name || 'Select Sport'}</Button>}
              >
                {mockSports.map(s => (
                  <Menu.Item key={s.id} onPress={() => { setForm((f:any) => ({ ...f, sportId: s.id })); setMenuVisible(false); }} title={s.name} />
                ))}
              </Menu>
              <TextInput
                label="Price Per Hour"
                value={form.pricePerHour}
                onChangeText={v => setForm((f:any) => ({ ...f, pricePerHour: v }))}
                keyboardType="numeric"
                style={styles.input}
              />
              {formError ? <HelperText type="error">{formError}</HelperText> : null}
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Cancel</Button>
            <Button mode="contained" onPress={handleSave}>Add</Button>
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
