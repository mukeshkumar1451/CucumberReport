import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';

const API_BASE_URL = Constants?.expoConfig?.extra?.API_BASE_URL || process.env.API_BASE_URL;

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT from SecureStore to requests
client.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await SecureStore.deleteItemAsync('jwt');
      // Optionally, show alert
      Alert.alert('Session expired', 'Please login again.');
      // Navigate to Login screen
      global.navigationRef?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    }
    return Promise.reject(error);
  }
);

export default client;
