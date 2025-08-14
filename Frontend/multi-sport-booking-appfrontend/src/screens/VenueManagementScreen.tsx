import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Card, Button, Chip, TextInput, Dialog, Portal } from 'react-native-paper';
import ImageUploader from '../components/ImageUploader';
import { z } from 'zod';

const venueSchema = z.object({
  name: z.string().min(1, 'Name required'),
  address: z.string().min(1, 'Address required'),
  city: z.string().min(1, 'City required'),
  locationUrl: z.string().url('Valid URL required'),
  contactNumber: z.string().min(10, 'Contact number required'),
  description: z.string().min(1, 'Description required'),
  image: z.string().url('Image required'),
  status: z.enum(['ACTIVE', 'INACTIVE'])
});

type Venue = z.infer<typeof venueSchema> & { id: string };

const mockVenues: Venue[] = [
  { id: '1', name: 'Arena 1', address: '123 St', city: 'Mumbai', locationUrl: 'http://maps.google.com', contactNumber: '9999999999', description: 'Great for football.', image: '', status: 'ACTIVE' },
  { id: '2', name: 'Arena 2', address: '456 Ave', city: 'Delhi', locationUrl: 'http://maps.google.com', contactNumber: '8888888888', description: 'Indoor badminton.', image: '', status: 'INACTIVE' },
];

export default function VenueManagementScreen() {
  const [venues, setVenues] = useState<Venue[]>(mockVenues);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [form, setForm] = useState<any>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const openAdd = () => {
    setEditingVenue(null);
    setForm({ name: '', address: '', city: '', locationUrl: '', contactNumber: '', description: '', image: '', status: 'ACTIVE' });
    setImage(null);
    setDialogVisible(true);
  };
  const openEdit = (venue: Venue) => {
    setEditingVenue(venue);
    setForm({ ...venue });
    setImage(venue.image);
    setDialogVisible(true);
  };
  const closeDialog = () => {
    setDialogVisible(false);
    setFormError(null);
  };
  const handleSave = () => {
    try {
      const validated = venueSchema.parse({ ...form, image: image || '' });
      if (editingVenue) {
        setVenues(venues.map(v => v.id === editingVenue.id ? { ...validated, id: editingVenue.id } : v));
      } else {
        setVenues([...venues, { ...validated, id: Math.random().toString() }]);
      }
      closeDialog();
    } catch (e) {
      setFormError(e.errors?.[0]?.message || 'Validation failed');
    }
  };
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Venue Management</Text>
      <Button mode="contained" onPress={openAdd} style={{ marginBottom: 16 }}>
        Add Venue
      </Button>
      <FlatList
        data={venues}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.name} subtitle={item.city}
              right={() => (
                <Chip style={{ backgroundColor: item.status === 'ACTIVE' ? '#C8E6C9' : '#FFCDD2' }}>{item.status}</Chip>
              )}
            />
            <Card.Content>
              <Text>{item.address}</Text>
              <Text>{item.contactNumber}</Text>
              <Text numberOfLines={1}>{item.description}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => openEdit(item)}>Edit</Button>
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={<Text>No venues yet.</Text>}
      />
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={closeDialog} style={{ width: '90%', alignSelf: 'center' }}>
          <Dialog.Title>{editingVenue ? 'Edit Venue' : 'Add Venue'}</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView>
              <TextInput label="Name" value={form.name} onChangeText={v => setForm((f:any) => ({ ...f, name: v }))} style={styles.input} />
              <TextInput label="Address" value={form.address} onChangeText={v => setForm((f:any) => ({ ...f, address: v }))} style={styles.input} />
              <TextInput label="City" value={form.city} onChangeText={v => setForm((f:any) => ({ ...f, city: v }))} style={styles.input} />
              <TextInput label="Location URL" value={form.locationUrl} onChangeText={v => setForm((f:any) => ({ ...f, locationUrl: v }))} style={styles.input} />
              <TextInput label="Contact Number" value={form.contactNumber} onChangeText={v => setForm((f:any) => ({ ...f, contactNumber: v }))} style={styles.input} />
              <TextInput label="Description" value={form.description} onChangeText={v => setForm((f:any) => ({ ...f, description: v }))} style={styles.input} />
              <ImageUploader label="Venue Image" onUpload={uri => { setImage(uri); setForm((f:any) => ({ ...f, image: uri })); }} initialUri={image} />
              <View style={{ flexDirection: 'row', marginVertical: 8 }}>
                <Chip
                  selected={form.status === 'ACTIVE'}
                  onPress={() => setForm((f:any) => ({ ...f, status: 'ACTIVE' }))}
                  style={{ marginRight: 8 }}>
                  ACTIVE
                </Chip>
                <Chip
                  selected={form.status === 'INACTIVE'}
                  onPress={() => setForm((f:any) => ({ ...f, status: 'INACTIVE' }))}>
                  INACTIVE
                </Chip>
              </View>
              {formError ? <Text style={{ color: 'red' }}>{formError}</Text> : null}
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Cancel</Button>
            <Button mode="contained" onPress={handleSave}>{editingVenue ? 'Save' : 'Add'}</Button>
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
