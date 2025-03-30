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
import ControlGastos from "./components/expenses/ControlGastos";
import Ajustes from "./components/Ajustes";
import ListaProductos from "./components/products/ListaProductos";
import Login from "./components/users/Login";
import Signup from "./components/users/Signup";
import PrivateRoute from "./components/users/PrivateRoute";
import Portada from "./components/menu/Portada";
import useUserStore from "./store/UserContext";
import "./App.css";

function App() {
  const [selectedSection, setSelectedSection] = useState("");
  const { token } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();
  const publicRoutes = ["/login", "/signup"];

  useEffect(() => {
    const path = location.pathname.split("/")[1];
    const section = path.replace(/-/g, " ");
    setSelectedSection(section.charAt(0).toUpperCase() + section.slice(1));
  }, [location.pathname]);

  useEffect(() => {
    if (!publicRoutes.includes(location.pathname) && !token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    navigate(`/${section.toLowerCase().replace(/\s+/g, "-")}`);
  };

  return (
    <>
      <PrimeReactProvider>
        <main className="flex">
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
                    <ControlGastos />
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
