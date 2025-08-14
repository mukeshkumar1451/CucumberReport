import React, { createContext, useContext, useState, useMemo } from 'react';
import { MD3LightTheme as LightTheme, MD3DarkTheme as DarkTheme, adaptNavigationTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();
export const useThemeMode = () => useContext(ThemeContext);

export default function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState(systemScheme || 'light');

  const theme = useMemo(() => (mode === 'dark' ? DarkTheme : LightTheme), [mode]);
  const navigationTheme = adaptNavigationTheme({ reactNavigationLight: LightTheme, reactNavigationDark: DarkTheme })[mode === 'dark' ? 'DarkTheme' : 'LightTheme'];

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children(theme, navigationTheme)}
    </ThemeContext.Provider>
  );
}
