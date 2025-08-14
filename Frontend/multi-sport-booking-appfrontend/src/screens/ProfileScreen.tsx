import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, Switch, Card, ActivityIndicator } from 'react-native-paper';
import client from '../api/client';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../store/AuthProvider';
import { useThemeMode } from '../store/ThemeProvider';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const { mode, setMode } = useThemeMode();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchProfile();
    checkPushStatus();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await client.get('/users/me');
      setProfile(res.data);
      setForm({ name: res.data.name, email: res.data.email, phone: res.data.phone });
    } catch (err) {}
    setLoading(false);
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      await client.put('/users/me', form);
      setEditMode(false);
      fetchProfile();
    } catch (err) {}
    setLoading(false);
  };

  const checkPushStatus = async () => {
    // Optionally, check if already registered
    // setNotifEnabled(...)
  };

  const handleNotifToggle = async (val) => {
    setNotifLoading(true);
    setNotifEnabled(val);
    if (val) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Enable notifications in settings.');
        setNotifEnabled(false);
        setNotifLoading(false);
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      await client.post('/users/me/push-token', { token });
    } else {
      // Optionally remove token from backend
    }
    setNotifLoading(false);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('jwt');
    await AsyncStorage.clear();
    logout();
  };

  if (loading) return <ActivityIndicator style={{ flex: 1, marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={t('profile')} />
        <Card.Content>
          <Text>{t('language')}</Text>
          <View style={styles.row}>
            <Button mode={i18n.language === 'en' ? 'contained' : 'outlined'} onPress={() => i18n.changeLanguage('en')} style={styles.btn}>English</Button>
            <Button mode={i18n.language === 'hi' ? 'contained' : 'outlined'} onPress={() => i18n.changeLanguage('hi')} style={styles.btn}>हिन्दी</Button>
            <Button mode={i18n.language === 'te' ? 'contained' : 'outlined'} onPress={() => i18n.changeLanguage('te')} style={styles.btn}>తెలుగు</Button>
          </View>
          <TextInput
            label={t('name')}
            value={form.name}
            onChangeText={name => setForm(f => ({ ...f, name }))}
            style={styles.input}
            editable={editMode}
          />
          <TextInput
            label={t('email')}
            value={form.email}
            onChangeText={email => setForm(f => ({ ...f, email }))}
            style={styles.input}
            editable={editMode}
          />
          <TextInput
            label={t('phone')}
            value={form.phone}
            onChangeText={phone => setForm(f => ({ ...f, phone }))}
            style={styles.input}
            editable={editMode}
          />
          <View style={styles.row}>
            <Text>Notifications</Text>
            <Switch
              value={notifEnabled}
              onValueChange={handleNotifToggle}
              disabled={notifLoading}
              accessibilityLabel="Toggle notifications"
              style={{ minWidth: 44, minHeight: 44 }}
            />
          </View>
          <View style={styles.row}>
            <Text>Theme</Text>
            <Button
              mode="outlined"
              onPress={() => setMode(mode === 'dark' ? 'light' : 'dark')}
              accessibilityLabel="Toggle light or dark theme"
              style={{ minWidth: 100, minHeight: 44 }}
            >
              {mode === 'dark' ? 'Dark' : 'Light'}
            </Button>
          </View>
          {editMode ? (
            <Button mode="contained" onPress={saveProfile} style={styles.btn} accessibilityLabel="Save profile changes" contentStyle={{ minHeight: 44 }}>
              Save
            </Button>
          ) : (
            <Button mode="outlined" onPress={() => setEditMode(true)} style={styles.btn} accessibilityLabel="Edit profile" contentStyle={{ minHeight: 44 }}>
              Edit
            </Button>
          )}
          <Button mode="contained" style={styles.logoutBtn} onPress={handleLogout} accessibilityLabel="Logout" contentStyle={{ minHeight: 44 }}>
            Logout
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  card: { width: '100%', maxWidth: 400, padding: 16 },
  input: { marginBottom: 12 },
  btn: { marginTop: 8 },
  logoutBtn: { marginTop: 24, backgroundColor: '#d32f2f' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 12 },
});
