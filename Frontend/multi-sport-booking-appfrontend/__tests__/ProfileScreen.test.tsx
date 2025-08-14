import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProfileScreen from '../src/screens/ProfileScreen';
import * as AuthProvider from '../src/store/AuthProvider';

jest.mock('../src/store/AuthProvider', () => ({
  useAuth: () => ({ user: { name: 'Test', email: 'test@mail.com', phone: '1234567890' }, logout: jest.fn() }),
}));

jest.mock('../src/store/ThemeProvider', () => ({
  useThemeMode: () => ({ mode: 'light', setMode: jest.fn() }),
}));

describe('ProfileScreen', () => {
  it('renders profile fields and toggles edit mode', async () => {
    const { getByLabelText, getByText } = render(<ProfileScreen />);
    await waitFor(() => getByLabelText('Edit profile'));
    fireEvent.press(getByLabelText('Edit profile'));
    expect(getByLabelText('Save profile changes')).toBeTruthy();
  });
});
