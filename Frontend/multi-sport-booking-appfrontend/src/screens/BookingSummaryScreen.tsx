import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, TextInput, Button } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import client from '../api/client';
import { format } from 'date-fns';

export default function BookingSummaryScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { slot, sport, date, venue } = route.params || {};
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [validating, setValidating] = useState(false);

  const price = slot?.price || 0;
  const taxes = Math.round(price * 0.18); // Example 18% GST
  const total = price + taxes - discount;

  const validateCoupon = async () => {
    setValidating(true);
    setCouponError('');
    try {
      const res = await client.post('/coupons/validate', { code: coupon, venueId: venue?.id, sportId: sport?.id });
      if (res.data.valid && res.data.discountAmount) {
        setDiscount(res.data.discountAmount);
      } else {
        setCouponError('Invalid coupon');
        setDiscount(0);
      }
    } catch (err) {
      setCouponError('Invalid coupon');
      setDiscount(0);
    } finally {
      setValidating(false);
    }
  };

  const scheduleBookingReminder = async () => {
    if (!slot || !date) return;
    const startDate = new Date(`${date}T${slot.start}`);
    const reminderDate = new Date(startDate.getTime() - 60 * 60 * 1000); // 1 hour before
    if (reminderDate > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Booking Reminder',
          body: `You have a booking for ${venue?.name} at ${slot.start}`,
        },
        trigger: reminderDate,
      });
    }
  };

  const handlePayment = async () => {
    await scheduleBookingReminder();
    navigation.navigate('Payment', { slot, sport, date, venue, total });
  };


  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={venue?.name || 'Venue'} subtitle={venue?.city} />
        <Card.Content>
          <Text>Sport: {sport?.name}</Text>
          <Text>Date: {date ? format(new Date(date), 'PPP') : ''}</Text>
          <Text>Time: {slot?.start} – {slot?.end}</Text>
          <Text>Price: ₹{price}</Text>
          <Text>Taxes: ₹{taxes}</Text>
          <Text>Total: ₹{total}</Text>
        </Card.Content>
      </Card>
      <TextInput
        label="Coupon Code (optional)"
        value={coupon}
        onChangeText={setCoupon}
        style={styles.input}
        right={<TextInput.Icon icon="check" onPress={validateCoupon} disabled={validating} />}
        error={!!couponError}
      />
      {couponError ? <Text style={styles.error}>{couponError}</Text> : null}
      <Button mode="contained" onPress={handlePayment} style={styles.cta}>
        Proceed to Payment
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  card: { marginBottom: 16 },
  input: { marginTop: 12, marginBottom: 4 },
  error: { color: 'red', marginBottom: 8 },
  cta: { marginTop: 16 },
});
