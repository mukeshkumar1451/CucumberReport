import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Text, Card, Button, Chip, TextInput, Menu } from 'react-native-paper';

const mockVenues = [
  { id: 'v1', name: 'Arena 1' },
  { id: 'v2', name: 'Arena 2' },
];
const mockSports = [
  { id: 's1', name: 'Football' },
  { id: 's2', name: 'Badminton' },
];
const mockBookings = [
  { id: 'b1', user: 'Amit', phone: '9999999999', date: '2025-08-15', time: '10:00', sport: 'Football', venue: 'Arena 1', price: '1200', payment: 'SUCCESS' },
  { id: 'b2', user: 'Priya', phone: '8888888888', date: '2025-08-15', time: '11:00', sport: 'Badminton', venue: 'Arena 2', price: '800', payment: 'PENDING' },
  { id: 'b3', user: 'Rahul', phone: '7777777777', date: '2025-08-15', time: '12:00', sport: 'Football', venue: 'Arena 1', price: '1200', payment: 'FAILED' },
];

export default function BookingManagementScreen() {
  const [venueFilter, setVenueFilter] = useState('');
  const [sportFilter, setSportFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [menuVenue, setMenuVenue] = useState(false);
  const [menuSport, setMenuSport] = useState(false);

  const filtered = mockBookings.filter(b =>
    (!venueFilter || b.venue === venueFilter) &&
    (!sportFilter || b.sport === sportFilter) &&
    (!dateFilter || b.date === dateFilter)
  );

  const handleExport = () => {
    // Mock CSV export
    alert('CSV export (mock)');
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Booking Management</Text>
      <View style={styles.filterRow}>
        <Menu
          visible={menuVenue}
          onDismiss={() => setMenuVenue(false)}
          anchor={<Button mode="outlined" onPress={() => setMenuVenue(true)} style={styles.filterBtn}>{venueFilter || 'Venue'}</Button>}
        >
          {mockVenues.map(v => (
            <Menu.Item key={v.id} onPress={() => { setVenueFilter(v.name); setMenuVenue(false); }} title={v.name} />
          ))}
        </Menu>
        <Menu
          visible={menuSport}
          onDismiss={() => setMenuSport(false)}
          anchor={<Button mode="outlined" onPress={() => setMenuSport(true)} style={styles.filterBtn}>{sportFilter || 'Sport'}</Button>}
        >
          {mockSports.map(s => (
            <Menu.Item key={s.id} onPress={() => { setSportFilter(s.name); setMenuSport(false); }} title={s.name} />
          ))}
        </Menu>
        <TextInput
          placeholder="YYYY-MM-DD"
          value={dateFilter}
          onChangeText={setDateFilter}
          style={styles.filterInput}
        />
        <Button onPress={() => { setVenueFilter(''); setSportFilter(''); setDateFilter(''); }}>Clear</Button>
        <Button mode="contained" onPress={handleExport} style={{ marginLeft: 8 }}>Export CSV</Button>
      </View>
      <ScrollView horizontal style={{ marginTop: 8 }}>
        <View>
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>ID</Text>
            <Text style={styles.headerCell}>User</Text>
            <Text style={styles.headerCell}>Phone</Text>
            <Text style={styles.headerCell}>Date</Text>
            <Text style={styles.headerCell}>Time</Text>
            <Text style={styles.headerCell}>Venue</Text>
            <Text style={styles.headerCell}>Sport</Text>
            <Text style={styles.headerCell}>Price</Text>
            <Text style={styles.headerCell}>Payment</Text>
          </View>
          {filtered.length === 0 && <Text style={{ margin: 16 }}>No bookings found.</Text>}
          {filtered.map(b => (
            <View key={b.id} style={styles.dataRow}>
              <Text style={styles.cell}>{b.id}</Text>
              <Text style={styles.cell}>{b.user}</Text>
              <Text style={styles.cell}>{b.phone}</Text>
              <Text style={styles.cell}>{b.date}</Text>
              <Text style={styles.cell}>{b.time}</Text>
              <Text style={styles.cell}>{b.venue}</Text>
              <Text style={styles.cell}>{b.sport}</Text>
              <Text style={styles.cell}>₹{b.price}</Text>
              <Chip style={{ backgroundColor: b.payment === 'SUCCESS' ? '#C8E6C9' : b.payment === 'PENDING' ? '#FFF9C4' : '#FFCDD2' }}>{b.payment}</Chip>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  filterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  filterBtn: { minWidth: 80, marginRight: 8 },
  filterInput: { width: 120, marginRight: 8 },
  headerRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' },
  headerCell: { width: 80, fontWeight: 'bold', marginRight: 8 },
  dataRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#f5f5f5' },
  cell: { width: 80, marginRight: 8 },
});
