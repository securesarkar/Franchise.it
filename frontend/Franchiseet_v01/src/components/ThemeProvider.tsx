import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('franchisematch-theme') as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setThemeState('light');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    
    if (theme === 'dark') {
      // Dark theme colors
      root.style.setProperty('--bg-primary', '#0a0a0f');
      root.style.setProperty('--bg-secondary', '#12121a');
      root.style.setProperty('--bg-tertiary', '#1a1a25');
      root.style.setProperty('--card-bg', '#151520');
      root.style.setProperty('--card-hover', '#1e1e2d');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#a0a0b0');
      root.style.setProperty('--text-muted', '#606070');
      root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--border-hover', 'rgba(255, 255, 255, 0.15)');
      root.style.setProperty('--primary-color', '#d4a853');
      root.style.setProperty('--primary-hover', '#e5b964');
      root.style.setProperty('--primary-rgb', '212, 168, 83');
      root.style.setProperty('--accent-color', '#8b5cf6');
      root.style.setProperty('--accent-hover', '#a78bfa');
      root.style.setProperty('--success-color', '#22c55e');
      root.style.setProperty('--warning-color', '#f59e0b');
      root.style.setProperty('--error-color', '#ef4444');
      root.style.setProperty('--shadow-sm', '0 2px 8px rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--shadow-md', '0 4px 16px rgba(0, 0, 0, 0.4)');
      root.style.setProperty('--shadow-lg', '0 8px 32px rgba(0, 0, 0, 0.5)');
      root.style.setProperty('--gradient-primary', 'linear-gradient(135deg, #d4a853 0%, #b8941f 100%)');
      root.style.setProperty('--gradient-accent', 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)');
    } else {
      // Light theme colors
      root.style.setProperty('--bg-primary', '#fafafa');
      root.style.setProperty('--bg-secondary', '#ffffff');
      root.style.setProperty('--bg-tertiary', '#f5f5f7');
      root.style.setProperty('--card-bg', '#ffffff');
      root.style.setProperty('--card-hover', '#f8f8fa');
      root.style.setProperty('--text-primary', '#1a1a2e');
      root.style.setProperty('--text-secondary', '#4a4a5a');
      root.style.setProperty('--text-muted', '#8a8a9a');
      root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.08)');
      root.style.setProperty('--border-hover', 'rgba(0, 0, 0, 0.15)');
      root.style.setProperty('--primary-color', '#b8941f');
      root.style.setProperty('--primary-hover', '#d4a853');
      root.style.setProperty('--primary-rgb', '184, 148, 31');
      root.style.setProperty('--accent-color', '#7c3aed');
      root.style.setProperty('--accent-hover', '#8b5cf6');
      root.style.setProperty('--success-color', '#16a34a');
      root.style.setProperty('--warning-color', '#d97706');
      root.style.setProperty('--error-color', '#dc2626');
      root.style.setProperty('--shadow-sm', '0 2px 8px rgba(0, 0, 0, 0.08)');
      root.style.setProperty('--shadow-md', '0 4px 16px rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--shadow-lg', '0 8px 32px rgba(0, 0, 0, 0.12)');
      root.style.setProperty('--gradient-primary', 'linear-gradient(135deg, #b8941f 0%, #d4a853 100%)');
      root.style.setProperty('--gradient-accent', 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)');
    }

    localStorage.setItem('franchisematch-theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Prevent flash of wrong theme
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
