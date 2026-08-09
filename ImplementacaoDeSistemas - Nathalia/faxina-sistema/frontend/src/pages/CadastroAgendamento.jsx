import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import ModalConfirmacao from '../components/ModalConfirmacao.jsx';
import { api } from '../api.js';

const VAZIO_FORM = {
  id: '',
  cliente_id: '',
  profissional_id: '',
  tipo_servico: 'residencial',
  data_agendamento: '',
  hora_inicio: '',
  hora_fim: '',
  status: 'agendado',
  observacoes: '',
};

function formatarData(iso) {
  const [ano, mes, dia] = iso.split('T')[0].split('-');
  return `${dia}/${mes}/${ano}`;
}
function formatarHora(hms) {
  return hms.slice(0, 5);
}

function validarFormulario(dados) {
  if (!dados.cliente_id) return 'Selecione um cliente.';
  if (!dados.profissional_id) return 'Selecione um profissional.';
  if (!dados.data_agendamento) return 'Informe a data do agendamento.';
  if (!dados.hora_inicio || !dados.hora_fim) return 'Informe o horario de inicio e de termino.';
  if (dados.hora_fim <= dados.hora_inicio) return 'O horario de termino deve ser depois do inicio.';
  return null;
}

export default function CadastroAgendamento() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [busca, setBusca] = useState('');
  const [erroLista, setErroLista] = useState('');
  const [carregando, setCarregando] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState(VAZIO_FORM);
  const [erroModal, setErroModal] = useState('');
  const [salvando, setSalvando] = useState(false);

  const [idParaExcluir, setIdParaExcluir] = useState(null);

  const carregarAgendamentos = useCallback(async (termo = '') => {
    try {
      const query = termo ? `?busca=${encodeURIComponent(termo)}` : '';
      const dados = await api(`/agendamentos${query}`);
      setAgendamentos(dados);
      setErroLista('');
    } catch (falha) {
      setErroLista(falha.message);
    }
  }, []);

  useEffect(() => {
    async function iniciar() {
      try {
        const [c, p] = await Promise.all([api('/clientes'), api('/profissionais')]);
        setClientes(c);
        setProfissionais(p);
        await carregarAgendamentos();
      } finally {
        setCarregando(false);
      }
    }
    iniciar();
  }, [carregarAgendamentos]);

  function handleBuscaKeyDown(evento) {
    if (evento.key === 'Enter') carregarAgendamentos(busca);
  }

  function abrirModalNovo() {
    setForm(VAZIO_FORM);
    setErroModal('');
    setModalAberto(true);
  }

  function abrirModalEdicao(item) {
    setForm({
      id: item.id,
      cliente_id: item.cliente_id,
      profissional_id: item.profissional_id,
      tipo_servico: item.tipo_servico,
      data_agendamento: item.data_agendamento.slice(0, 10),
      hora_inicio: formatarHora(item.hora_inicio),
      hora_fim: formatarHora(item.hora_fim),
      status: item.status,
      observacoes: item.observacoes || '',
    });
    setErroModal('');
    setModalAberto(true);
  }

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    const erroValidacao = validarFormulario(form);
    if (erroValidacao) {
      setErroModal(erroValidacao);
      return;
    }

    setSalvando(true);
    setErroModal('');
    try {
      const payload = { ...form, cliente_id: Number(form.cliente_id), profissional_id: Number(form.profissional_id) };
      if (form.id) {
        await api(`/agendamentos/${form.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await api('/agendamentos', { method: 'POST', body: JSON.stringify(payload) });
      }
      setModalAberto(false);
      carregarAgendamentos(busca);
    } catch (falha) {
      setErroModal(falha.message);
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    try {
      await api(`/agendamentos/${idParaExcluir}`, { method: 'DELETE' });
      carregarAgendamentos(busca);
    } catch (falha) {
      setErroLista(falha.message);
    } finally {
      setIdParaExcluir(null);
    }
  }

  return (
    <div className="app-shell">
      <TopBar />
      <main className="app-main">
        <div className="cabecalho-pagina">
          <div>
            <Link to="/" className="voltar">&larr; Voltar ao painel</Link>
            <h2 style={{ marginTop: '6px' }}>Cadastro de agendamento</h2>
          </div>
          <button className="btn-primario btn-icone" onClick={abrirModalNovo}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Novo agendamento
          </button>
        </div>

        <div className={`alerta erro ${erroLista ? 'mostrar' : ''}`}>{erroLista}</div>

        <div className="painel">
          <div className="painel-toolbar">
            <div className="busca-wrap">
              <svg className="icone-busca" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                className="busca"
                placeholder="Buscar por cliente, profissional ou tipo de servico..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onKeyDown={handleBuscaKeyDown}
              />
            </div>
            <button className="btn-secundario" onClick={() => carregarAgendamentos(busca)}>Buscar</button>
            <button className="btn-texto" onClick={() => { setBusca(''); carregarAgendamentos(); }}>Limpar</button>
          </div>

          {carregando ? (
            <div className="carregando-lista"><span className="spinner"></span> Carregando agendamentos...</div>
          ) : agendamentos.length === 0 ? (
            <div className="vazio">
              <strong>Nenhum agendamento encontrado</strong>
              Cadastre um novo agendamento ou ajuste o termo de busca.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Cliente</th><th>Profissional</th><th>Tipo</th><th>Data</th><th>Horario</th><th>Status</th><th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {agendamentos.map((a) => (
                  <tr key={a.id}>
                    <td>{a.cliente_nome}</td>
                    <td>{a.profissional_nome}</td>
                    <td><span className={`selo-tipo ${a.tipo_servico}`}>{a.tipo_servico}</span></td>
                    <td style={{ fontFamily: 'var(--fonte-dado)', fontSize: '13px' }}>{formatarData(a.data_agendamento)}</td>
                    <td style={{ fontFamily: 'var(--fonte-dado)', fontSize: '13px' }}>{formatarHora(a.hora_inicio)} - {formatarHora(a.hora_fim)}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td>
                      <div className="acoes-linha">
                        <button className="btn-secundario btn-icone" onClick={() => abrirModalEdicao(a)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                          Editar
                        </button>
                        <button className="btn-perigo btn-icone" onClick={() => setIdParaExcluir(a.id)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <div className={`modal-fundo ${modalAberto ? 'aberto' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setModalAberto(false); }}>
        <div className="modal-caixa">
          <h3>{form.id ? 'Editar agendamento' : 'Novo agendamento'}</h3>
          <p className="modal-subtitulo">Preencha os dados do atendimento de faxina.</p>

          <div className={`alerta erro ${erroModal ? 'mostrar' : ''}`}>{erroModal}</div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="campo">
              <label htmlFor="cliente_id">Cliente</label>
              <select id="cliente_id" value={form.cliente_id} onChange={(e) => atualizarCampo('cliente_id', e.target.value)} required>
                <option value="">Selecione...</option>
                {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>

            <div className="linha-2">
              <div className="campo">
                <label htmlFor="profissional_id">Profissional</label>
                <select id="profissional_id" value={form.profissional_id} onChange={(e) => atualizarCampo('profissional_id', e.target.value)} required>
                  <option value="">Selecione...</option>
                  {profissionais.map((p) => <option key={p.id} value={p.id}>{p.nome} ({p.especialidade})</option>)}
                </select>
              </div>
              <div className="campo">
                <label htmlFor="tipo_servico">Tipo de servico</label>
                <select id="tipo_servico" value={form.tipo_servico} onChange={(e) => atualizarCampo('tipo_servico', e.target.value)}>
                  <option value="residencial">Residencial</option>
                  <option value="comercial">Comercial</option>
                </select>
              </div>
            </div>

            <div className="linha-2">
              <div className="campo">
                <label htmlFor="data_agendamento">Data</label>
                <input type="date" id="data_agendamento" value={form.data_agendamento} onChange={(e) => atualizarCampo('data_agendamento', e.target.value)} required />
              </div>
              <div className="campo">
                <label htmlFor="status">Status</label>
                <select id="status" value={form.status} onChange={(e) => atualizarCampo('status', e.target.value)}>
                  <option value="agendado">Agendado</option>
                  <option value="concluido">Concluido</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="linha-2">
              <div className="campo">
                <label htmlFor="hora_inicio">Horario de inicio</label>
                <input type="time" id="hora_inicio" value={form.hora_inicio} onChange={(e) => atualizarCampo('hora_inicio', e.target.value)} required />
              </div>
              <div className="campo">
                <label htmlFor="hora_fim">Horario de termino</label>
                <input type="time" id="hora_fim" value={form.hora_fim} onChange={(e) => atualizarCampo('hora_fim', e.target.value)} required />
              </div>
            </div>

            <div className="campo">
              <label htmlFor="observacoes">Observacoes (opcional)</label>
              <textarea id="observacoes" rows="2" value={form.observacoes} onChange={(e) => atualizarCampo('observacoes', e.target.value)} />
            </div>

            <div className="modal-acoes">
              <button type="button" className="btn-secundario" onClick={() => setModalAberto(false)}>Cancelar</button>
              <button type="submit" className="btn-primario" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar agendamento'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ModalConfirmacao
        aberto={idParaExcluir !== null}
        titulo="Excluir agendamento?"
        mensagem="Essa acao nao pode ser desfeita. O agendamento sera removido permanentemente do sistema."
        textoConfirmar="Excluir"
        onConfirmar={confirmarExclusao}
        onCancelar={() => setIdParaExcluir(null)}
      />
    </div>
  );
}