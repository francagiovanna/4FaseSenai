import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar.jsx';

export default function Painel() {
  return (
    <div className="app-shell">
      <TopBar />
      <main className="app-main">
        <div className="cabecalho-pagina">
          <h2>Painel</h2>
        </div>

        <div className="grade-cards">
          <Link className="card-acao" to="/cadastro-agendamento">
            <span className="indice">01</span>
            <h3>Cadastro de agendamento</h3>
            <p>Consultar, criar, editar e excluir agendamentos de faxina.</p>
          </Link>
          <Link className="card-acao" to="/gestao-agendamentos">
            <span className="indice">02</span>
            <h3>Gestao de agendamentos</h3>
            <p>Organizar a agenda, alocar profissionais e evitar conflitos de horario.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
