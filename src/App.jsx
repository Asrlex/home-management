import "primereact/resources/themes/md-dark-deeppurple/theme.css";
import { useState, useEffect } from "react";
import { PrimeReactProvider } from "primereact/api";
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import BarraLateral from "./components/menu/BarraLateral";
import MainContent from "./components/menu/MainContent";
import ListaCompra from "./components/productos/ListaCompra";
import Despensa from "./components/productos/Despensa";
import Tareas from "./components/Tareas";
import Recetas from "./components/Recetas";
import ControlGastos from "./components/ControlGastos";
import Configuracion from "./components/Configuracion";
import { TiendaContextProvider } from "./store/tienda-context";
import { ProductContextProvider } from "./store/product-context";
import { EtiquetaContextProvider } from "./store/etiqueta-context";
import { ShoppingListContextProvider } from "./store/shopping-list-context";
import { StockContextProvider } from "./store/stock-context";
import { ThemeContextProvider } from "./store/theme-context";
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
      <ThemeContextProvider>
        <PrimeReactProvider>
          <StockContextProvider>
            <ShoppingListContextProvider>
              <ProductContextProvider>
                <EtiquetaContextProvider>
                  <TiendaContextProvider>
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
                          <Route path="/tareas" element={<Tareas />} />
                          <Route path="/recetas" element={<Recetas />} />
                          <Route path="/gastos" element={<ControlGastos />} />
                          <Route path="/ajustes" element={<Configuracion />} />
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
                  </TiendaContextProvider>
                </EtiquetaContextProvider>
              </ProductContextProvider>
            </ShoppingListContextProvider>
          </StockContextProvider>
        </PrimeReactProvider>
      </ThemeContextProvider>
    </>
  );
}

export default App;
