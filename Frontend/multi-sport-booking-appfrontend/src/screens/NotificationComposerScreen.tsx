import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, TextInput, HelperText } from 'react-native-paper';
import { z } from 'zod';

const notificationSchema = z.object({
  message: z.string().min(1, 'Message required'),
});

export default function NotificationComposerScreen() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setError(''); setSuccess('');
    try {
      notificationSchema.parse({ message });
      setSending(true);
      // Mock API call
      setTimeout(() => {
        setSending(false);
        setSuccess('Notification sent!');
        setMessage('');
      }, 1200);
      // In real app: await api.post('/vendor/notifications', { message })
    } catch (e) {
      setError(e.errors?.[0]?.message || 'Validation failed');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Send Push Notification" />
        <Card.Content>
          <TextInput
            label="Message"
            value={message}
            onChangeText={setMessage}
            multiline
            style={{ minHeight: 80, marginBottom: 8 }}
          />
          {error ? <HelperText type="error">{error}</HelperText> : null}
          {success ? <HelperText type="info">{success}</HelperText> : null}
          <Button mode="contained" onPress={handleSend} loading={sending}>
            Send Notification
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  card: { width: '100%', maxWidth: 400, padding: 16 },
});
