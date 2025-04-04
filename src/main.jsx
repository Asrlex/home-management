import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import useThemeStore from "./store/ThemeContext";
import useConnectionStore from "./store/ConnectionContext";
import './index.css';
import "./styles/css/productos.css";
import "./styles/css/recetas.css";
import "./styles/css/tareas.css";
import "./styles/css/mainContent.css";
import "./styles/css/gastos.css";
import "./styles/css/context.css";
import "./styles/css/barraLateral.css";
import "./styles/css/etiquetas.css";
import "./styles/css/modal.css";

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
  </React.StrictMode>,
);
