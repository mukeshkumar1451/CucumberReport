import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Chip, TextInput } from 'react-native-paper';
import EarningsChart from '../components/EarningsChart';

const mockPayments = [
  { id: 'p1', date: '2025-08-01', amount: 1200, commission: 120, net: 1080, status: 'PAID' },
  { id: 'p2', date: '2025-08-02', amount: 900, commission: 90, net: 810, status: 'PAID' },
  { id: 'p3', date: '2025-08-03', amount: 1600, commission: 160, net: 1440, status: 'PENDING' },
];
const mockData = [
  { date: 'Mon', earnings: 1200 },
  { date: 'Tue', earnings: 900 },
  { date: 'Wed', earnings: 1600 },
  { date: 'Thu', earnings: 800 },
  { date: 'Fri', earnings: 2000 },
  { date: 'Sat', earnings: 1700 },
  { date: 'Sun', earnings: 1500 },
];

export default function EarningsScreen() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const filtered = mockPayments.filter(p =>
    (!from || p.date >= from) &&
    (!to || p.date <= to)
  );
  const total = filtered.reduce((sum, p) => sum + p.amount, 0);
  const commission = filtered.reduce((sum, p) => sum + p.commission, 0);
  const net = filtered.reduce((sum, p) => sum + p.net, 0);

  const handleExport = () => {
    // Mock CSV export
    alert('CSV export (mock)');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Earnings & Payouts</Text>
      <View style={styles.filterRow}>
        <TextInput placeholder="From (YYYY-MM-DD)" value={from} onChangeText={setFrom} style={styles.filterInput} />
        <TextInput placeholder="To (YYYY-MM-DD)" value={to} onChangeText={setTo} style={styles.filterInput} />
        <Button mode="contained" onPress={handleExport} style={{ marginLeft: 8 }}>Export CSV</Button>
      </View>
      <View style={styles.summaryRow}>
        <Text>Total Collected: ₹{total}</Text>
        <Text>Commission: ₹{commission}</Text>
        <Text>Net Payable: ₹{net}</Text>
      </View>
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Date</Text>
        <Text style={styles.headerCell}>Amount</Text>
        <Text style={styles.headerCell}>Commission</Text>
        <Text style={styles.headerCell}>Net</Text>
        <Text style={styles.headerCell}>Status</Text>
      </View>
      {filtered.length === 0 && <Text style={{ margin: 16 }}>No payments found.</Text>}
      {filtered.map(p => (
        <View key={p.id} style={styles.dataRow}>
          <Text style={styles.cell}>{p.date}</Text>
          <Text style={styles.cell}>₹{p.amount}</Text>
          <Text style={styles.cell}>₹{p.commission}</Text>
          <Text style={styles.cell}>₹{p.net}</Text>
          <Chip style={{ backgroundColor: p.status === 'PAID' ? '#C8E6C9' : '#FFF9C4' }}>{p.status}</Chip>
        </View>
      ))}
      <EarningsChart data={mockData} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', alignItems: 'center', padding: 16 },
  filterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  filterInput: { width: 140, marginRight: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginVertical: 12 },
  headerRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' },
  headerCell: { width: 90, fontWeight: 'bold', marginRight: 8 },
  dataRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#f5f5f5' },
  cell: { width: 90, marginRight: 8 },
});
