import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

type ThemeColors = {
  background: string;
  text: string;
  card: string;
  border: string;
  backgroundImage: any;
};

const lightColors: ThemeColors = {
  background: '#ffffff',
  text: '#000000',
  card: 'rgba(255,255,255,0.55)',
  border: '#dddddd',
  backgroundImage: require('../assets/images/day.jpg'),
};

const darkColors: ThemeColors = {
  background: '#121212',
  text: '#ffffff',
  card: 'rgba(0,0,0,0.35)',
  border: '#333333',
  backgroundImage: require('../assets/images/night.jpg'),
};

export const homeBackgroundImage = require('../assets/images/home.jpg');

type ThemeContextType = {
  theme: Theme;
  colors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getThemeByTime(): Theme {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? 'light' : 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getThemeByTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTheme(getThemeByTime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}