import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSettings } from '../types';
import { getUserSettings, updateUserSettings } from '../services/dataService';

interface AppContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  isLoading: boolean;
  theme: 'light' | 'dark';
}

const defaultSettings: UserSettings = {
  defaultSummaryLength: 'medium',
  defaultQuizDifficulty: 'medium',
  defaultQuizQuestionCount: 5,
  theme: 'light'
};

const AppContext = createContext<AppContextType>({
  settings: defaultSettings,
  updateSettings: async () => {},
  isLoading: true,
  theme: 'light'
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const userSettings = await getUserSettings();
        setSettings(userSettings);
        
        // Set theme based on settings or system preference
        if (userSettings.theme === 'system') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setTheme(prefersDark ? 'dark' : 'light');
        } else {
          setTheme(userSettings.theme === 'dark' ? 'dark' : 'light');
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  // Apply theme class to body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      const updatedSettings = await updateUserSettings(newSettings);
      setSettings(updatedSettings);
      
      // Update theme if it was changed
      if (newSettings.theme) {
        if (newSettings.theme === 'system') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setTheme(prefersDark ? 'dark' : 'light');
        } else {
          setTheme(newSettings.theme === 'dark' ? 'dark' : 'light');
        }
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const value = {
    settings,
    updateSettings,
    isLoading,
    theme
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};