import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, TextInput } from 'react-native-paper';

export default function WalletScreen() {
  const [balance, setBalance] = useState(500); // mock balance
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleAdd = () => {
    setBalance(balance + Number(amount));
    setAmount('');
    setMessage('Amount added!');
  };

  const handleWithdraw = () => {
    if (Number(amount) > balance) {
      setMessage('Insufficient balance');
      return;
    }
    setBalance(balance - Number(amount));
    setAmount('');
    setMessage('Withdrawal successful!');
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Wallet" />
        <Card.Content>
          <Text variant="headlineMedium">₹{balance}</Text>
          <TextInput
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />
          <View style={styles.row}>
            <Button mode="contained" onPress={handleAdd} style={styles.btn}>Add</Button>
            <Button mode="outlined" onPress={handleWithdraw} style={styles.btn}>Withdraw</Button>
          </View>
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
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  btn: { minWidth: 100, marginHorizontal: 8 },
  msg: { marginTop: 12, color: '#1976d2' },
});
