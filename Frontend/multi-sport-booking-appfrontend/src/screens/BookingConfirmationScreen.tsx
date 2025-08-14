import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Share, Platform } from 'react-native';
import { Text, Button, ActivityIndicator, Card } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import client from '../api/client';
import QRCode from 'react-native-qrcode-svg';
import * as Calendar from 'expo-calendar';

export default function BookingConfirmationScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { bookingId } = route.params || {};
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState('');

  useEffect(() => {
    if (bookingId) fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    setLoading(true);
    try {
      const res = await client.get(`/bookings/${bookingId}`);
      setBooking(res.data);
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const addToCalendar = async () => {
    setCalendarLoading(true);
    setCalendarError('');
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        setCalendarError('Calendar permission not granted');
        setCalendarLoading(false);
        return;
      }
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find(c => c.allowsModifications) || calendars[0];
      const startDate = new Date(`${booking.date}T${booking.slot.start}`);
      const endDate = new Date(`${booking.date}T${booking.slot.end}`);
      await Calendar.createEventAsync(defaultCalendar.id, {
        title: `Booking: ${booking.venue.name}`,
        startDate,
        endDate,
        location: booking.venue.address,
        notes: `Sport: ${booking.sport.name}\nBooking ID: ${booking.id}`,
      });
    } catch (err) {
      setCalendarError('Failed to add to calendar');
    } finally {
      setCalendarLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const message = `Booking Confirmed!\nVenue: ${booking.venue.name}\nSport: ${booking.sport.name}\nDate: ${booking.date}\nTime: ${booking.slot.start} – ${booking.slot.end}\nBooking ID: ${booking.id}`;
      await Share.share({ message });
    } catch (err) {}
  };

  if (loading) return <ActivityIndicator style={{ flex: 1, marginTop: 50 }} />;

  // QR payload from backend (assumed as booking.qrPayload)
  const qrPayload = booking?.qrPayload || { bookingId: booking.id, userId: booking.userId, ts: Date.now(), checksum: booking.checksum };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Booking Confirmed!" />
        <Card.Content>
          <Text>Booking ID: {booking?.id}</Text>
          <Text>Venue: {booking?.venue?.name}</Text>
          <Text>Sport: {booking?.sport?.name}</Text>
          <Text>Date: {booking?.date}</Text>
          <Text>Time: {booking?.slot?.start} – {booking?.slot?.end}</Text>
          <Text>Total Paid: ₹{booking?.total}</Text>
        </Card.Content>
      </Card>
      {/* QR Code */}
      <View style={styles.qrContainer}>
        <QRCode value={JSON.stringify(qrPayload)} size={180} />
      </View>
      <Button mode="contained" style={styles.btn} onPress={addToCalendar} loading={calendarLoading}>
        Add to Calendar
      </Button>
      {calendarError ? <Text style={styles.error}>{calendarError}</Text> : null}
      <Button mode="outlined" style={styles.btn} onPress={handleShare}>
        Share
      </Button>
      <Button mode="contained" style={styles.btn} onPress={() => navigation.navigate('Home')}>
        Back to Home
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  card: { marginBottom: 24, width: '100%' },
  btn: { marginTop: 16, width: 200, alignSelf: 'center' },
  error: { color: 'red', marginVertical: 8 },
  qrContainer: { marginVertical: 20, alignItems: 'center' },
});
