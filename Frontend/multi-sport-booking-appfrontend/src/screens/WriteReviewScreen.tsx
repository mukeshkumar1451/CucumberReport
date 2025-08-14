import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, TextInput, Card } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import client from '../api/client';

export default function WriteReviewScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { venueId } = route.params || {};
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await client.post('/reviews', { venueId, rating: Number(rating), comment });
      navigation.goBack();
    } catch (err) {
      setError('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title title="Write a Review" />
        <Card.Content>
          <TextInput
            label="Rating (1-5)"
            value={rating}
            onChangeText={setRating}
            keyboardType="numeric"
            maxLength={1}
            style={styles.input}
          />
          <TextInput
            label="Comment"
            value={comment}
            onChangeText={setComment}
            multiline
            style={styles.input}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={!rating || !comment}>
            Submit
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#fff' },
  input: { marginBottom: 12 },
  error: { color: 'red', marginBottom: 8 },
});
