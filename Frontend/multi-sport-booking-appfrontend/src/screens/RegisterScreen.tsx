import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import client from '../api/client';
import API_ROUTES from '../api/routes';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../store/AuthProvider';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm: z.string(),
  role: z.enum(['USER', 'VENDOR']),
}).refine((data) => data.password === data.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen({ navigation }) {
  const { login } = useAuth();
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'USER' },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const res = await client.post(API_ROUTES.REGISTER, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
      });
      const { token, profile, role } = res.data;
      await SecureStore.setItemAsync('jwt', token);
      await AsyncStorage.setItem('profile', JSON.stringify(profile));
      await AsyncStorage.setItem('role', role || data.role);
      login(profile);
      navigation.replace('Home');
    } catch (err) {
      // Show error toast/snackbar
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Register</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Full Name"
            value={value}
            onChangeText={onChange}
            error={!!errors.name}
            style={styles.input}
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Email"
            value={value}
            onChangeText={onChange}
            error={!!errors.email}
            style={styles.input}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Phone"
            value={value}
            onChangeText={onChange}
            error={!!errors.phone}
            style={styles.input}
          />
        )}
      />
      {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}
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
      <Controller
        control={control}
        name="confirm"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Confirm Password"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            error={!!errors.confirm}
            style={styles.input}
          />
        )}
      />
      {errors.confirm && <Text style={styles.error}>{errors.confirm.message}</Text>}
      {/* Role selection with RadioButton.Group */}
      <Controller
        control={control}
        name="role"
        render={({ field: { onChange, value } }) => (
          <RadioButton.Group onValueChange={onChange} value={value}>
            <RadioButton.Item label="User" value="USER" style={{ minHeight: 44 }} />
            <RadioButton.Item label="Vendor" value="VENDOR" style={{ minHeight: 44 }} />
          </RadioButton.Group>
        )}
      />
      {errors.role && <Text style={styles.error}>{errors.role.message}</Text>}
      <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={isSubmitting}>
        Register
      </Button>
      <Button onPress={() => navigation.goBack()}>Back to Login</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: { marginBottom: 12 },
  error: { color: 'red', marginBottom: 8 },
});
