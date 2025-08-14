import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card } from 'react-native-paper';
import EarningsChart from '../components/EarningsChart';

const mockStats = {
  todaysBookings: 7,
  monthRevenue: 42000,
  upcomingSlots: [
    { id: 'S1', time: '10:00', date: '2025-08-14', venue: 'Arena 1', sport: 'Football' },
    { id: 'S2', time: '11:00', date: '2025-08-14', venue: 'Arena 2', sport: 'Badminton' },
    { id: 'S3', time: '12:00', date: '2025-08-14', venue: 'Arena 1', sport: 'Football' },
    { id: 'S4', time: '13:00', date: '2025-08-14', venue: 'Arena 3', sport: 'Box Cricket' },
    { id: 'S5', time: '14:00', date: '2025-08-14', venue: 'Arena 2', sport: 'Badminton' },
    { id: 'S6', time: '15:00', date: '2025-08-14', venue: 'Arena 1', sport: 'Football' },
    { id: 'S7', time: '16:00', date: '2025-08-14', venue: 'Arena 3', sport: 'Box Cricket' },
    { id: 'S8', time: '17:00', date: '2025-08-14', venue: 'Arena 2', sport: 'Badminton' },
    { id: 'S9', time: '18:00', date: '2025-08-14', venue: 'Arena 1', sport: 'Football' },
    { id: 'S10', time: '19:00', date: '2025-08-14', venue: 'Arena 3', sport: 'Box Cricket' }
  ],
  weekRevenue: [
    { date: 'Mon', earnings: 6000 },
    { date: 'Tue', earnings: 7000 },
    { date: 'Wed', earnings: 5000 },
    { date: 'Thu', earnings: 8000 },
    { date: 'Fri', earnings: 9000 },
    { date: 'Sat', earnings: 7000 },
    { date: 'Sun', earnings: 4000 },
  ]
};

export default function VendorDashboardScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Vendor Dashboard</Text>
      <View style={styles.row}>
        <Card style={styles.statCard}>
          <Card.Title title="Today's Bookings" subtitle={mockStats.todaysBookings.toString()} />
        </Card>
        <Card style={styles.statCard}>
          <Card.Title title="This Month's Revenue" subtitle={`₹${mockStats.monthRevenue}`} />
        </Card>
      </View>
      <Card style={styles.upcomingCard}>
        <Card.Title title="Upcoming Slots (Next 10)" />
        <Card.Content>
          <FlatList
            data={mockStats.upcomingSlots}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.slotRow}>
                <Text>{item.time} • {item.venue} • {item.sport}</Text>
              </View>
            )}
          />
        </Card.Content>
      </Card>
      <EarningsChart data={mockStats.weekRevenue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { flex: 1, marginRight: 8, minWidth: 140 },
  upcomingCard: { marginBottom: 16 },
  slotRow: { paddingVertical: 4 },
});
