import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function TopBar() {
  const { nome, sair } = useAuth();
  const navegar = useNavigate();

  function handleLogout() {
    sair();
    navegar('/login', { replace: true });
  }

  return (
    <header className="app-topbar">
      <div className="marca"><span className="ponto"></span> Faxina App</div>
      <div className="usuario-area">
        <span className="nome-usuario">Ola, <strong>{nome}</strong></span>
        <button className="btn-secundario" onClick={handleLogout}>Sair</button>
      </div>
    </header>
  );
}
