import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import VendorNavigator from './VendorNavigator';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../store/AuthProvider';
import { ActivityIndicator } from 'react-native-paper';

export default function RootNavigator() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const checkTokenAndRole = async () => {
      const jwt = await SecureStore.getItemAsync('jwt');
      setToken(jwt);
      if (jwt) {
        const storedRole = await AsyncStorage.getItem('role');
        setRole(storedRole || 'USER');
      }
      setLoading(false);
    };
    checkTokenAndRole();
  }, [user]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (!token) return <AuthStack />;
  if (role === 'VENDOR') return <VendorNavigator />;
  return <MainTabs />;
}
