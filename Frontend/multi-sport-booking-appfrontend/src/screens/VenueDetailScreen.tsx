import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Text, Chip, Button, ActivityIndicator, Card, Divider } from 'react-native-paper';
import client from '../api/client';
import { useRoute, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';

function groupSlotsByTime(slots) {
  const groups = { morning: [], afternoon: [], evening: [] };
  slots.forEach(slot => {
    const hour = parseInt(slot.start.split(':')[0], 10);
    if (hour < 12) groups.morning.push(slot);
    else if (hour < 18) groups.afternoon.push(slot);
    else groups.evening.push(slot);
  });
  return groups;
}

export default function VenueDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const venueId = route.params?.venue?.id || route.params?.venueId;
  const [venue, setVenue] = useState(null);
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [slots, setSlots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    fetchVenue();
    fetchVenueSports();
    fetchReviews();
  }, [venueId]);

  useEffect(() => {
    if (selectedSport) fetchSlots();
  }, [selectedSport, date]);

  const fetchVenue = async () => {
    setLoading(true);
    try {
      const res = await client.get(`/venues/${venueId}`);
      setVenue(res.data);
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const fetchVenueSports = async () => {
    try {
      const res = await client.get(`/venues/${venueId}/sports`);
      setSports(res.data);
      setSelectedSport(res.data[0]?.id || null);
    } catch (err) {}
  };

  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      const res = await client.get(`/venues/${venueId}/slots`, {
        params: {
          date: format(date, 'yyyy-MM-dd'),
          sportId: selectedSport
        }
      });
      setSlots(res.data);
    } catch (err) {}
    finally {
      setLoadingSlots(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await client.get(`/reviews/${venueId}`);
      setReviews(res.data);
    } catch (err) {}
  };

  if (loading || !venue) return <ActivityIndicator style={{ flex: 1, marginTop: 50 }} />;

  const slotGroups = groupSlotsByTime(slots);

  return (
    <ScrollView style={styles.container}>
      {/* Image Carousel */}
      <FlatList
        data={venue.images || []}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
        style={styles.carousel}
      />
      <Text variant="headlineMedium">{venue.name}</Text>
      <Text>{venue.city} • {venue.address}</Text>
      {/* Amenities */}
      <View style={styles.badgeRow}>
        {venue.amenities?.map((a, i) => (
          <Chip key={i} style={styles.badge}>{a}</Chip>
        ))}
      </View>
      {/* Sports Selector */}
      <FlatList
        data={sports}
        horizontal
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Chip
            selected={selectedSport === item.id}
            onPress={() => setSelectedSport(item.id)}
            style={styles.chip}
          >
            {item.name}
          </Chip>
        )}
        style={styles.chipList}
      />
      {/* Date Picker */}
      <Button onPress={() => setShowDatePicker(true)} style={{ marginVertical: 8 }}>
        {format(date, 'PPP')}
      </Button>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(_, selected) => {
            setShowDatePicker(false);
            if (selected) setDate(selected);
          }}
        />
      )}
      {/* Reviews List with Pagination */}
      <Divider style={{ marginVertical: 8 }} />
      <Text variant="titleMedium">Reviews</Text>
      <Button mode="outlined" style={{ marginVertical: 6 }} onPress={() => navigation.navigate('WriteReview', { venueId })}>
        Write a Review
      </Button>
      <FlatList
        data={reviews.data || reviews}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 8 }}>
            <Card.Title title={`Rating: ${item.rating}/5`} subtitle={item.user?.name || ''} />
            <Card.Content>
              <Text>{item.comment}</Text>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={<Text>No reviews yet.</Text>}
      />
      {/* Pagination Controls */}
      {reviews?.pageCount && reviews?.pageCount > 1 && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 8 }}>
          <Button disabled={reviews.page === 1} onPress={() => fetchReviews(reviews.page - 1)}>Prev</Button>
          <Text style={{ marginHorizontal: 12 }}>{reviews.page} / {reviews.pageCount}</Text>
          <Button disabled={reviews.page === reviews.pageCount} onPress={() => fetchReviews(reviews.page + 1)}>Next</Button>
        </View>
      )}
      {/* Slot List */}
      <Divider style={{ marginVertical: 8 }} />
      <Text variant="titleMedium">Available Slots</Text>
      {loadingSlots ? <ActivityIndicator /> : (
        <>
          {['morning', 'afternoon', 'evening'].map(period => (
            <View key={period} style={{ marginBottom: 8 }}>
              <Text style={styles.periodLabel}>{period.charAt(0).toUpperCase() + period.slice(1)}</Text>
              <View style={styles.slotRow}>
                {slotGroups[period].length === 0 && <Text>No slots</Text>}
                {slotGroups[period].map(slot => (
                  <Button
                    key={slot.id}
                    mode={slot.booked ? 'outlined' : 'contained'}
                    disabled={slot.booked}
                    style={styles.slotBtn}
                    onPress={() => navigation.navigate('SlotSelection', { slot })}
                  >
                    {slot.start} - {slot.end}
                  </Button>
                ))}
              </View>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 12 },
  carousel: { height: 180, marginBottom: 12 },
  image: { width: 280, height: 180, borderRadius: 10, marginRight: 8 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 },
  badge: { marginRight: 4, marginBottom: 4 },
  chip: { marginRight: 8 },
  chipList: { marginBottom: 12 },
  slotRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  slotBtn: { marginRight: 8, marginBottom: 8 },
  periodLabel: { fontWeight: 'bold', marginBottom: 4 },
});
