import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Veiculos from "./pages/Veiculos";
import OrdensServico from "./pages/OrdensServico";

import PrivateRoute from "./components/PrivateRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/clientes"
                    element={
                        <PrivateRoute>
                            <Clientes />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/veiculos"
                    element={
                        <PrivateRoute>
                            <Veiculos />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/ordens-servico"
                    element={
                        <PrivateRoute>
                            <OrdensServico />
                        </PrivateRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;