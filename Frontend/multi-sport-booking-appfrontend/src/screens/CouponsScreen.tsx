import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, TextInput } from 'react-native-paper';

const mockCoupons = [
  { code: 'WELCOME100', discount: 100, description: '₹100 off on your first booking' },
  { code: 'SUMMER50', discount: 50, description: '₹50 off for summer' },
];

export default function CouponsScreen() {
  const [coupons, setCoupons] = useState(mockCoupons);
  const [newCode, setNewCode] = useState('');
  const [message, setMessage] = useState('');

  const handleAdd = () => {
    if (!newCode) return;
    // In real app, validate via API
    setCoupons([...coupons, { code: newCode, discount: 0, description: 'Custom coupon' }]);
    setNewCode('');
    setMessage('Coupon added!');
  };

  const handleRemove = (code) => {
    setCoupons(coupons.filter(c => c.code !== code));
    setMessage('Coupon removed!');
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="My Coupons" />
        <Card.Content>
          <TextInput
            label="Add Coupon Code"
            value={newCode}
            onChangeText={setNewCode}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleAdd} style={styles.btn}>Add</Button>
          <FlatList
            data={coupons}
            keyExtractor={item => item.code}
            renderItem={({ item }) => (
              <Card style={styles.couponCard}>
                <Card.Title title={item.code} subtitle={item.description} />
                <Card.Content>
                  <Text>Discount: ₹{item.discount}</Text>
                </Card.Content>
                <Card.Actions>
                  <Button onPress={() => handleRemove(item.code)}>Remove</Button>
                </Card.Actions>
              </Card>
            )}
            ListEmptyComponent={<Text>No coupons yet.</Text>}
          />
          {message ? <Text style={styles.msg}>{message}</Text> : null}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  card: { width: '100%', maxWidth: 400, padding: 16 },
  input: { marginBottom: 12 },
  btn: { marginBottom: 16 },
  couponCard: { marginBottom: 12 },
  msg: { marginTop: 12, color: '#1976d2' },
});
