import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import client from '../api/client';
import API_ROUTES from '../api/routes';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../store/AuthProvider';

const loginSchema = z.object({
  identifier: z.string().min(3, 'Required'), // email or phone
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await client.post(API_ROUTES.LOGIN, {
        identifier: data.identifier,
        password: data.password,
      });
      const { token, profile, role } = res.data;
      await SecureStore.setItemAsync('jwt', token);
      await AsyncStorage.setItem('profile', JSON.stringify(profile));
      await AsyncStorage.setItem('role', role || profile.role || 'USER');
      login(profile);
      navigation.replace('Home');
    } catch (err) {
      // Show error toast/snackbar
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Login</Text>
      <Controller
        control={control}
        name="identifier"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Email or Phone"
            value={value}
            onChangeText={onChange}
            error={!!errors.identifier}
            style={styles.input}
          />
        )}
      />
      {errors.identifier && <Text style={styles.error}>{errors.identifier.message}</Text>}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Password"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            error={!!errors.password}
            style={styles.input}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
      <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={isSubmitting}>
        Login
      </Button>
      <Button onPress={() => navigation.navigate('Register')}>Register</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: { marginBottom: 12 },
  error: { color: 'red', marginBottom: 8 },
});
