import { createContext } from 'react';
import { Appearance } from 'react-native';

export const ThemeContext = createContext();

export const darkTheme = {
  background: '#121212',
  text: '#ffffff',
  header: '#1f1f1f',
  inputBackground: '#333333',
  border: '#444444',
};