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
      <div className="marca">
        <img src="/logo_faxina.png" alt="Faxina App" className="logo-marca" />
      </div>
      <div className="usuario-area">
        <span className="nome-usuario">Ola, <strong>{nome}</strong></span>
        <button className="btn-secundario btn-icone" onClick={handleLogout}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sair
        </button>
      </div>
    </header>
  );
}