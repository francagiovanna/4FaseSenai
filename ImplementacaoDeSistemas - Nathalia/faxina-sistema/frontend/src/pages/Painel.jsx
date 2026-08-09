import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';

function saudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return 'Bom dia';
  if (hora < 18) return 'Boa tarde';
  return 'Boa noite';
}

function dataDeHoje() {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).format(new Date());
}

function formatarDataCurta(iso) {
  const [ano, mes, dia] = iso.split('T')[0].split('-');
  return `${dia}/${mes}`;
}
function formatarHora(hms) {
  return hms.slice(0, 5);
}

export default function Painel() {
  const { nome } = useAuth();
  const [resumo, setResumo] = useState(null);
  const primeiroNome = (nome || 'Usuario').split(' ')[0];

  useEffect(() => {
    api('/agendamentos').then((dados) => {
      const ativos = dados.filter((a) => a.status === 'agendado');
      const residenciais = ativos.filter((a) => a.tipo_servico === 'residencial').length;
      const comerciais = ativos.filter((a) => a.tipo_servico === 'comercial').length;

      const hoje = new Date().toISOString().slice(0, 10);
      const proximos = ativos
        .filter((a) => a.data_agendamento.slice(0, 10) >= hoje)
        .sort((a, b) => `${a.data_agendamento}${a.hora_inicio}`.localeCompare(`${b.data_agendamento}${b.hora_inicio}`));

      setResumo({
        total: ativos.length,
        residenciais,
        comerciais,
        proximo: proximos[0] || null,
      });
    }).catch(() => setResumo({ total: null, residenciais: 0, comerciais: 0, proximo: null }));
  }, []);

  return (
    <div className="app-shell">
      <TopBar />
      <main className="app-main">
        <div className="boas-vindas">
          <p className="boas-vindas-data">{dataDeHoje()}</p>
          <h2>{saudacao()}, {primeiroNome}.</h2>
        </div>

        {resumo && resumo.total !== null && (
          <div className="resumo-grid">
            <div className="resumo-card">
              <span className="resumo-numero">{resumo.total}</span>
              <span className="resumo-label">Agendamentos ativos</span>
            </div>
            <div className="resumo-card">
              <span className="resumo-numero">{resumo.residenciais}</span>
              <span className="resumo-label">Residenciais</span>
            </div>
            <div className="resumo-card">
              <span className="resumo-numero">{resumo.comerciais}</span>
              <span className="resumo-label">Comerciais</span>
            </div>
            <div className="resumo-card resumo-proximo">
              {resumo.proximo ? (
                <>
                  <span className="resumo-label">Proximo atendimento</span>
                  <span className="resumo-proximo-info">
                    {resumo.proximo.cliente_nome} &middot; {formatarDataCurta(resumo.proximo.data_agendamento)} as {formatarHora(resumo.proximo.hora_inicio)}
                  </span>
                </>
              ) : (
                <>
                  <span className="resumo-label">Proximo atendimento</span>
                  <span className="resumo-proximo-info resumo-vazio-texto">Nenhum agendado</span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="grade-cards">
          <Link className="card-acao" to="/cadastro-agendamento">
            <span className="card-icone">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                <line x1="12" y1="14" x2="12" y2="18" /><line x1="10" y1="16" x2="14" y2="16" />
              </svg>
            </span>
            <h3>Cadastro de agendamento</h3>
            <p>Consultar, criar, editar e excluir agendamentos de faxina.</p>
          </Link>
          <Link className="card-acao" to="/gestao-agendamentos">
            <span className="card-icone">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </span>
            <h3>Gestao de agendamentos</h3>
            <p>Organizar a agenda, alocar profissionais e evitar conflitos de horario.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}