import { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

function ThemeContextProvider({ children }) {
  const handleSetTheme = () => {
    const theme = getTheme() === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    toggleTheme(theme);
  };

  const getTheme = () => {
    return localStorage.getItem('theme') || 'light';
  };

  const [theme, toggleTheme] = useState(getTheme());

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext, ThemeContextProvider };