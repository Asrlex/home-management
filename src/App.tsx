import 'primereact/resources/themes/md-dark-deeppurple/theme.css';
import { useState, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from 'react-router-dom';
import BarraLateral from './components/menu/BarraLateral';
import MainContent from './components/menu/MainContent';
import ListaCompra from './components/products/ListaCompra';
import Despensa from './components/products/Despensa';
import Tareas from './components/tasks/Tareas';
import TareasCasa from './components/tasks/TareasCasa';
import Recetas from './components/recipes/Recetas';
import Gastos from './components/expenses/Gastos';
import Ajustes from './components/Ajustes';
import ListaProductos from './components/products/ListaProductos';
import Login from './components/users/Login';
import Signup from './components/users/Signup';
import PrivateRoute from './components/users/PrivateRoute';
import Portada from './components/menu/Portada';
import Fichajes from './components/tasks/checkin/Shifts';
import useUserStore from './store/UserStore';
import useSettingsStore from './store/SettingsStore';
import React from 'react';
import useThemeStore from './store/ThemeStore';
import { ApiPaths } from './entities/enums/api.enums';

function App() {
  const [selectedSection, setSelectedSection] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const publicRoutes = [ApiPaths.Login, ApiPaths.Signup, ApiPaths.Base];
  const validateToken = useUserStore((state) => state.validateToken);
  const fetchSettings = useSettingsStore((state) => state.fetchSettings);
  const theme = useSettingsStore((state) => state.settings?.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  useEffect(() => {
    const initializeApp = async () => {
      const settings = await fetchSettings();

      if (settings?.theme && settings.theme !== theme) {
        toggleTheme();
      }

      const path = location.pathname.split(ApiPaths.Base)[1];
      const section = path.replace(/-/g, ' ');
      setSelectedSection(section.charAt(0).toUpperCase() + section.slice(1));

      if (!publicRoutes.includes(location.pathname as ApiPaths)) {
        const isValidToken = await validateToken();
        if (!isValidToken) {
          navigate(ApiPaths.Login);
        } else {
          const defaultPage =
            useSettingsStore.getState().settings?.defaultPage || ApiPaths.Base;
          if (location.pathname === ApiPaths.Base) {
            navigate(defaultPage);
          }
        }
      }
    };

    initializeApp();
  }, [location.pathname, navigate]);

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
    navigate(`/${section.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <>
      <PrimeReactProvider>
        <main className='app'>
          <BarraLateral
            onSelectSection={handleSectionChange}
            section={selectedSection}
          />
          <MainContent titulo={selectedSection}>
            <Routes>
              <Route path={ApiPaths.Base} element={<Portada />} />
              <Route
                path='/productos'
                element={
                  <PrivateRoute>
                    <ListaProductos />
                  </PrivateRoute>
                }
              />
              <Route
                path='/lista-compra'
                element={
                  <PrivateRoute>
                    <ListaCompra />
                  </PrivateRoute>
                }
              />
              <Route
                path='/despensa'
                element={
                  <PrivateRoute>
                    <Despensa />
                  </PrivateRoute>
                }
              />
              <Route
                path='/tareas-pendientes'
                element={
                  <PrivateRoute>
                    <Tareas />
                  </PrivateRoute>
                }
              />
              <Route
                path='/tareas-casa'
                element={
                  <PrivateRoute>
                    <TareasCasa />
                  </PrivateRoute>
                }
              />
              <Route
                path='/fichajes'
                element={
                  <PrivateRoute>
                    <Fichajes />
                  </PrivateRoute>
                }
              />
              <Route
                path='/recetas'
                element={
                  <PrivateRoute>
                    <Recetas />
                  </PrivateRoute>
                }
              />
              <Route
                path='/gastos'
                element={
                  <PrivateRoute>
                    <Gastos />
                  </PrivateRoute>
                }
              />
              <Route
                path='/ajustes'
                element={
                  <PrivateRoute>
                    <Ajustes />
                  </PrivateRoute>
                }
              />
              <Route path={ApiPaths.Login} element={<Login />} />
              <Route path={ApiPaths.Signup} element={<Signup />} />
              <Route path={ApiPaths.Base} element={<Navigate to={ApiPaths.Base} />} />
              <Route path='*' element={<Navigate to={ApiPaths.Base} />} />
            </Routes>
          </MainContent>
        </main>
      </PrimeReactProvider>{' '}
    </>
  );
}

export default App;
