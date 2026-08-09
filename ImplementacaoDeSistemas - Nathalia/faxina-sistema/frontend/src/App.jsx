import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import RotaProtegida from './components/RotaProtegida.jsx';
import Login from './pages/Login.jsx';
import Painel from './pages/Painel.jsx';
import CadastroAgendamento from './pages/CadastroAgendamento.jsx';
import GestaoAgendamentos from './pages/GestaoAgendamentos.jsx';
import './styles.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RotaProtegida><Painel /></RotaProtegida>} />
          <Route path="/cadastro-agendamento" element={<RotaProtegida><CadastroAgendamento /></RotaProtegida>} />
          <Route path="/gestao-agendamentos" element={<RotaProtegida><GestaoAgendamentos /></RotaProtegida>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
