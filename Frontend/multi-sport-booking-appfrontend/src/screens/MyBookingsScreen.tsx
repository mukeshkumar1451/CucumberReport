import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, Card, ActivityIndicator, SegmentedButtons, Dialog, Portal } from 'react-native-paper';
import client from '../api/client';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';

export default function MyBookingsScreen() {
  const navigation = useNavigation();
  const [tab, setTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await client.get('/bookings/my');
      setBookings(res.data);
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const filtered = bookings.filter(b => {
    const isPast = new Date(b.date) < new Date();
    return tab === 'upcoming' ? !isPast : isPast;
  });

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      await client.post(`/bookings/${cancelId}/cancel`);
      setCancelDialog(false);
      fetchBookings();
    } catch (err) {
      setError('Cancel failed');
    } finally {
      setCancelLoading(false);
    }
  };

  const renderBooking = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.venue.name} subtitle={item.sport.name} />
      <Card.Content>
        <Text>Date: {item.date}</Text>
        <Text>Time: {item.slot.start} – {item.slot.end}</Text>
        <Text>Status: {item.paymentStatus}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => navigation.navigate('BookingConfirmation', { bookingId: item.id })}>
          View QR
        </Button>
        {item.canCancel && (
          <Button onPress={() => { setCancelId(item.id); setCancelDialog(true); }}>
            Cancel
          </Button>
        )}
        {item.canReschedule && (
          <Button disabled>Reschedule</Button> {/* Implement as needed */}
        )}
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={tab}
        onValueChange={setTab}
        buttons={[
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'past', label: 'Past' },
        ]}
        style={styles.tabs}
      />
      {loading ? <ActivityIndicator /> : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id.toString()}
          renderItem={renderBooking}
          ListEmptyComponent={<Text>No bookings found.</Text>}
        />
      )}
      <Portal>
        <Dialog visible={cancelDialog} onDismiss={() => setCancelDialog(false)}>
          <Dialog.Title>Cancel Booking?</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to cancel this booking?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setCancelDialog(false)}>No</Button>
            <Button loading={cancelLoading} onPress={handleCancel}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  tabs: { marginBottom: 12 },
  card: { marginBottom: 12 },
  error: { color: 'red', marginTop: 12 },
});
