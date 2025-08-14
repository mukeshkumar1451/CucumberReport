import React, { useState } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import client from '../api/client';

export default function PaymentScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { slot, coupon, total } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [polling, setPolling] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Initiate payment
      const res = await client.post('/payments/initiate', {
        slotId: slot.id,
        coupon,
      });
      const { orderId, amount, currency, checkoutUrl } = res.data;
      // 2. Open Stripe Checkout in browser
      await Linking.openURL(checkoutUrl);
      setPolling(true);
      pollVerification(orderId);
    } catch (err) {
      setError('Payment initiation failed.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Poll backend for verification
  const pollVerification = async (orderId) => {
    let attempts = 0;
    const maxAttempts = 15;
    const interval = 3000;
    const poll = async () => {
      try {
        const res = await client.post('/payments/verify', { orderId });
        if (res.data.verified && res.data.bookingId) {
          navigation.replace('BookingConfirmation', { bookingId: res.data.bookingId });
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, interval);
        } else {
          setError('Payment verification timeout.');
          setPolling(false);
        }
      } catch {
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, interval);
        } else {
          setError('Payment verification failed.');
          setPolling(false);
        }
      }
    };
    poll();
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium">Total to Pay: ₹{total}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading || polling ? (
        <ActivityIndicator />
      ) : (
        <Button mode="contained" onPress={handlePayment}>
          Pay with Stripe
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  error: { color: 'red', marginVertical: 12 },
});
