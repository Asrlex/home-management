import "primereact/resources/themes/md-dark-deeppurple/theme.css";
import { useState, useEffect } from "react";
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
import ControlGastos from "./components/ControlGastos";
import Configuracion from "./components/Configuracion";
import { StoreContextProvider } from "./store/StoreContext";
import { ProductContextProvider } from "./store/ProductContext";
import { EtiquetaContextProvider } from "./store/EtiquetaContext";
import { ShoppingListContextProvider } from "./store/ShoppingListContext";
import { StockContextProvider } from "./store/StockContext";
import { ThemeContextProvider } from "./store/ThemeContext";
import { ConnectionProvider } from "./store/ConnectionContext";
import "./App.css";

function App() {
  const [selectedSection, setSelectedSection] = useState("Lista compra");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split("/")[1];
    const section = path.replace(/-/g, " ");
    setSelectedSection(section.charAt(0).toUpperCase() + section.slice(1));
  }, [location.pathname]);

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    navigate(`/${section.toLowerCase().replace(/\s+/g, "-")}`);
  };

  return (
    <>
      <ConnectionProvider>
        <ThemeContextProvider>
          <PrimeReactProvider>
            <ProductContextProvider>
              <EtiquetaContextProvider>
                <StockContextProvider>
                  <ShoppingListContextProvider>
                    <StoreContextProvider>
                      <main className="flex">
                        <BarraLateral
                          onSelectSection={handleSectionChange}
                          section={selectedSection}
                        />
                        <MainContent titulo={selectedSection}>
                          <Routes>
                            <Route
                              path="/lista-compra"
                              element={<ListaCompra />}
                            />
                            <Route path="/despensa" element={<Despensa />} />
                            <Route
                              path="/tareas-pendientes"
                              element={<Tareas />}
                            />
                            <Route
                              path="/tareas-casa"
                              element={<TareasCasa />}
                            />
                            <Route path="/recetas" element={<Recetas />} />
                            <Route path="/gastos" element={<ControlGastos />} />
                            <Route
                              path="/ajustes"
                              element={<Configuracion />}
                            />
                            <Route
                              path="/"
                              element={<Navigate to="/lista-compra" />}
                            />
                            <Route
                              path="*"
                              element={<Navigate to="/lista-compra" />}
                            />
                          </Routes>
                        </MainContent>
                      </main>
                    </StoreContextProvider>
                  </ShoppingListContextProvider>
                </StockContextProvider>
              </EtiquetaContextProvider>
            </ProductContextProvider>
          </PrimeReactProvider>
        </ThemeContextProvider>
      </ConnectionProvider>
    </>
  );
}

export default App;
