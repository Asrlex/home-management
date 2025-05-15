import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import useThemeStore from './store/ThemeStore';
import useConnectionStore from './store/ConnectionStore';
import './index.css';
import './styles/css/products.css';
import './styles/css/recipes.css';
import './styles/css/tasks.css';
import './styles/css/mainContent.css';
import './styles/css/expenses.css';
import './styles/css/context.css';
import './styles/css/sidebar.css';
import './styles/css/tags.css';
import './styles/css/modal.css';
import './styles/css/shifts.css';
import './styles/css/settings.css';
import './styles/css/car.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

const { theme } = useThemeStore.getState();
document.documentElement.className = theme;

useConnectionStore.getState().initializeConnectionCheck();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
