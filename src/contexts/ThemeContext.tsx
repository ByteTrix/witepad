import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  defaultZoom: number;
  setDefaultZoom: (zoom: number) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  autoSave: boolean;
  setAutoSave: (auto: boolean) => void;
}

const defaultContext: ThemeContextType = {
  theme: 'system',
  setTheme: () => {},
  animationsEnabled: true,
  setAnimationsEnabled: () => {},
  defaultZoom: 100,
  setDefaultZoom: () => {},
  showGrid: true,
  setShowGrid: () => {},
  snapToGrid: true,
  setSnapToGrid: () => {},
  autoSave: true,
  setAutoSave: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Load settings from localStorage or use defaults
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('witepad-theme');
    return (savedTheme as Theme) || 'system';
  });
  
  const [animationsEnabled, setAnimationsEnabledState] = useState<boolean>(() => {
    const savedValue = localStorage.getItem('witepad-animations');
    return savedValue ? savedValue === 'true' : true;
  });
  
  const [defaultZoom, setDefaultZoomState] = useState<number>(() => {
    const savedValue = localStorage.getItem('witepad-zoom');
    return savedValue ? parseInt(savedValue) : 100;
  });
  
  const [showGrid, setShowGridState] = useState<boolean>(() => {
    const savedValue = localStorage.getItem('witepad-show-grid');
    return savedValue ? savedValue === 'true' : true;
  });
  
  const [snapToGrid, setSnapToGridState] = useState<boolean>(() => {
    const savedValue = localStorage.getItem('witepad-snap-to-grid');
    return savedValue ? savedValue === 'true' : true;
  });
  
  const [autoSave, setAutoSaveState] = useState<boolean>(() => {
    const savedValue = localStorage.getItem('witepad-auto-save');
    return savedValue ? savedValue === 'true' : true;
  });

  // Wrapper functions that save to localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('witepad-theme', newTheme);
    
    // Apply theme to document
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(systemTheme);
    } else {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
    }
  };

  const setAnimationsEnabled = (enabled: boolean) => {
    setAnimationsEnabledState(enabled);
    localStorage.setItem('witepad-animations', enabled.toString());
    
    // Apply animations setting
    if (!enabled) {
      document.body.classList.add('disable-animations');
    } else {
      document.body.classList.remove('disable-animations');
    }
  };

  const setDefaultZoom = (zoom: number) => {
    setDefaultZoomState(zoom);
    localStorage.setItem('witepad-zoom', zoom.toString());
  };

  const setShowGrid = (show: boolean) => {
    setShowGridState(show);
    localStorage.setItem('witepad-show-grid', show.toString());
  };

  const setSnapToGrid = (snap: boolean) => {
    setSnapToGridState(snap);
    localStorage.setItem('witepad-snap-to-grid', snap.toString());
  };

  const setAutoSave = (auto: boolean) => {
    setAutoSaveState(auto);
    localStorage.setItem('witepad-auto-save', auto.toString());
  };

  // Setup initial theme based on saved preference or system
  useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(e.matches ? 'dark' : 'light');
      }
    };

    // Apply initial theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(systemTheme);
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    } else {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  // Apply animations setting
  useEffect(() => {
    if (!animationsEnabled) {
      document.body.classList.add('disable-animations');
    } else {
      document.body.classList.remove('disable-animations');
    }
  }, [animationsEnabled]);

  const value = {
    theme,
    setTheme,
    animationsEnabled,
    setAnimationsEnabled,
    defaultZoom,
    setDefaultZoom,
    showGrid,
    setShowGrid,
    snapToGrid,
    setSnapToGrid,
    autoSave,
    setAutoSave,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
