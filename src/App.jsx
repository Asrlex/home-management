import "primereact/resources/themes/md-dark-deeppurple/theme.css";
import { useState, useEffect, useContext } from "react";
import { PrimeReactProvider } from "primereact/api";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import BarraLateral from "./components/menu/BarraLateral";
import MainContent from "./components/menu/MainContent";
import ListaCompra from "./components/products/ListaCompra";
import Despensa from "./components/products/Despensa";
import Tareas from "./components/tasks/Tareas";
import TareasCasa from "./components/tasks/TareasCasa";
import Recetas from "./components/recipes/Recetas";
import Gastos from "./components/expenses/Gastos";
import Ajustes from "./components/Ajustes";
import ListaProductos from "./components/products/ListaProductos";
import Login from "./components/users/Login";
import Signup from "./components/users/Signup";
import PrivateRoute from "./components/users/PrivateRoute";
import Portada from "./components/menu/Portada";
import Fichajes from "./components/tasks/Fichajes";
import useUserStore from "./store/UserStore";

function App() {
  const [selectedSection, setSelectedSection] = useState("");
  const { token } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();
  const publicRoutes = ["/login", "/signup", "/"];
  const validateToken = useUserStore((state) => state.validateToken);

  useEffect(() => {
    const validateAndRedirect = async () => {
      const path = location.pathname.split("/")[1];
      const section = path.replace(/-/g, " ");
      setSelectedSection(section.charAt(0).toUpperCase() + section.slice(1));
  
      if (!publicRoutes.includes(location.pathname)) {
        const isValidToken = await validateToken();
        if (!isValidToken) {
          navigate("/login");
        }
      }
    };
  
    validateAndRedirect();
  }, [location.pathname, navigate]);

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    navigate(`/${section.toLowerCase().replace(/\s+/g, "-")}`);
  };

  return (
    <>
      <PrimeReactProvider>
        <main className="app">
          <BarraLateral
            onSelectSection={handleSectionChange}
            section={selectedSection}
          />
          <MainContent titulo={selectedSection}>
            <Routes>
              <Route path="/" element={<Portada />} />
              <Route
                path="/productos"
                element={
                  <PrivateRoute>
                    <ListaProductos />
                  </PrivateRoute>
                }
              />
              <Route
                path="/lista-compra"
                element={
                  <PrivateRoute>
                    <ListaCompra />
                  </PrivateRoute>
                }
              />
              <Route
                path="/despensa"
                element={
                  <PrivateRoute>
                    <Despensa />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tareas-pendientes"
                element={
                  <PrivateRoute>
                    <Tareas />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tareas-casa"
                element={
                  <PrivateRoute>
                    <TareasCasa />
                  </PrivateRoute>
                }
              />
              <Route
                path="/fichajes"
                element={
                  <PrivateRoute>
                    <Fichajes />
                  </PrivateRoute>
                }
              />
              <Route
                path="/recetas"
                element={
                  <PrivateRoute>
                    <Recetas />
                  </PrivateRoute>
                }
              />
              <Route
                path="/gastos"
                element={
                  <PrivateRoute>
                    <Gastos />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ajustes"
                element={
                  <PrivateRoute>
                    <Ajustes />
                  </PrivateRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<Navigate to="/" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </MainContent>
        </main>
      </PrimeReactProvider>{" "}
    </>
  );
}

export default App;
