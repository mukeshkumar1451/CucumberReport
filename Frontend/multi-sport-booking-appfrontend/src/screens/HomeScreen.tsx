import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Chip, Card, Button, TextInput, ActivityIndicator, IconButton } from 'react-native-paper';
import EmptyStateLottie from '../components/EmptyStateLottie';
import client from '../api/client';
import { useNavigation } from '@react-navigation/native';

const DEFAULT_CITY = 'Mumbai';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [city, setCity] = useState(DEFAULT_CITY);
  const [search, setSearch] = useState('');
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const [venues, setVenues] = useState([]);
  const [loadingSports, setLoadingSports] = useState(true);
  const [loadingVenues, setLoadingVenues] = useState(false);
  // Advanced filters
  const [amenities, setAmenities] = useState(['Parking', 'Washroom', 'Cafeteria', 'Floodlights']);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    fetchSports();
  }, []);

  useEffect(() => {
    if (selectedSport) fetchVenues();
  }, [selectedSport, city, search, selectedAmenities, priceRange, minRating, sortBy]);

  const fetchSports = async () => {
    setLoadingSports(true);
    try {
      const res = await client.get('/sports');
      setSports(res.data);
      setSelectedSport(res.data[0]?.id || null);
    } catch (err) {
      // handle error
    } finally {
      setLoadingSports(false);
    }
  };

  const fetchVenues = async () => {
    setLoadingVenues(true);
    try {
      const res = await client.get(`/sports/${selectedSport}/venues`, {
        params: {
          city,
          q: search,
          amenities: selectedAmenities.join(','),
          priceMin: priceRange[0],
          priceMax: priceRange[1],
          minRating,
          sortBy,
        }
      });
      setVenues(res.data);
    } catch (err) {
      // handle error
    } finally {
      setLoadingVenues(false);
    }
  };


  const [favoriteVenues, setFavoriteVenues] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      const favs = await import('../store/favorites').then(m => m.getFavorites());
      setFavoriteVenues(favs);
    })();
  }, [venues]);

  const toggleFavorite = async (venueId: string) => {
    const favsModule = await import('../store/favorites');
    let newFavs;
    if (favoriteVenues.includes(venueId)) {
      newFavs = await favsModule.removeFavorite(venueId);
    } else {
      newFavs = await favsModule.addFavorite(venueId);
    }
    setFavoriteVenues(newFavs);
  };

  const renderVenue = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.name}
        subtitle={`${item.city} • Rating: ${item.rating}`}
        right={() => (
          <IconButton
            icon={favoriteVenues.includes(item.id) ? 'heart' : 'heart-outline'}
            color={favoriteVenues.includes(item.id) ? 'red' : undefined}
            onPress={() => toggleFavorite(item.id)}
            accessibilityLabel={favoriteVenues.includes(item.id) ? 'Remove from favorites' : 'Add to favorites'}
          />
        )}
      />
      <TouchableOpacity onPress={() => navigation.navigate('VenueDetail', { venue: item })}>
        <Card.Content>
          <Text>From ₹{item.priceFrom}</Text>
          <View style={styles.badgeRow}>
            {item.amenities?.map((amenity, i) => (
              <Chip key={i} style={styles.badge}>{amenity}</Chip>
            ))}
          </View>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* City Selector & Search */}
      <View style={styles.row}>
        <TextInput
          label="City"
          value={city}
          onChangeText={setCity}
          style={styles.cityInput}
        />
        <TextInput
          label="Search"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>
      {/* Sports Chips */}
      {loadingSports ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={sports}
          horizontal
          showsHorizontalScrollIndicator={false}
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
      )}
      {/* Advanced Filters */}
      <View style={styles.filterSection}>
        <Text variant="titleSmall">Amenities</Text>
        <View style={styles.amenityRow}>
          {amenities.map(a => (
            <Chip
              key={a}
              selected={selectedAmenities.includes(a)}
              onPress={() => setSelectedAmenities(selectedAmenities.includes(a)
                ? selectedAmenities.filter(x => x !== a)
                : [...selectedAmenities, a])}
              style={styles.chip}
            >
              {a}
            </Chip>
          ))}
        </View>
        <Text variant="titleSmall">Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</Text>
        {/* Simple slider substitute: two inputs or buttons for demo; use real slider in production */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Button onPress={() => setPriceRange([Math.max(0, priceRange[0] - 50), priceRange[1]])}>-</Button>
          <Text>Min</Text>
          <Button onPress={() => setPriceRange([priceRange[0] + 50, priceRange[1]])}>+</Button>
          <Text> / </Text>
          <Button onPress={() => setPriceRange([priceRange[0], Math.max(priceRange[0], priceRange[1] - 50)])}>-</Button>
          <Text>Max</Text>
          <Button onPress={() => setPriceRange([priceRange[0], priceRange[1] + 50])}>+</Button>
        </View>
        <Text variant="titleSmall">Min Rating</Text>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          {[0, 1, 2, 3, 4, 5].map(r => (
            <Chip key={r} selected={minRating === r} onPress={() => setMinRating(r)} style={styles.chip}>{r}★</Chip>
          ))}
        </View>
        <Text variant="titleSmall">Sort By</Text>
        <View style={{ flexDirection: 'row' }}>
          {['relevance', 'price', 'rating'].map(opt => (
            <Chip key={opt} selected={sortBy === opt} onPress={() => setSortBy(opt)} style={styles.chip}>{opt}</Chip>
          ))}
        </View>
      </View>
      {/* Venue Grid */}
      {loadingVenues ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={venues}
          numColumns={2}
          keyExtractor={item => item.id.toString()}
          renderItem={renderVenue}
          contentContainerStyle={styles.grid}
          ListEmptyComponent={<EmptyStateLottie text="No venues found. Try changing your filters!" />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  row: { flexDirection: 'row', marginBottom: 12 },
  cityInput: { flex: 1, marginRight: 8 },
  searchInput: { flex: 2 },
  chipList: { marginBottom: 12 },
  chip: { marginRight: 8 },
  grid: { gap: 12 },
  card: { flex: 1, margin: 6 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  badge: { marginRight: 4, marginBottom: 4 },
});
