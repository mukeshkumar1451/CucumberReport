import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';

export default function SlotSelectionScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { slots = [], sport, date } = route.params || {};

  const handleSelect = (slot) => {
    navigation.navigate('BookingSummary', { slot, sport, date });
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium">{sport?.name || 'Sport'} on {date ? format(new Date(date), 'PPP') : ''}</Text>
      <FlatList
        data={slots}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text>{item.start} – {item.end}</Text>
              <Text>₹{item.price}</Text>
              <Button mode="contained" onPress={() => handleSelect(item)} style={styles.btn}>
                Select Slot
              </Button>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={<Text>No available slots.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  card: { marginBottom: 12 },
  btn: { marginTop: 8 },
});
