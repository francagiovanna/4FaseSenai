import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { api } from '../api.js';

function quicksort(lista, chave) {
  if (lista.length <= 1) return lista;
  const [pivo, ...resto] = lista;
  const menores = resto.filter((item) => chave(item) < chave(pivo));
  const maioresOuIguais = resto.filter((item) => chave(item) >= chave(pivo));
  return [...quicksort(menores, chave), pivo, ...quicksort(maioresOuIguais, chave)];
}

function chaveOrdenacao(criterio) {
  if (criterio === 'data') return (a) => `${a.data_agendamento}T${a.hora_inicio}`;
  return (a) => a.cliente_nome.toLowerCase();
}

function formatarData(iso) {
  const [ano, mes, dia] = iso.split('T')[0].split('-');
  return `${dia}/${mes}/${ano}`;
}
function formatarHora(hms) {
  return hms.slice(0, 5);
}

export default function GestaoAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [criterio, setCriterio] = useState('cliente');
  const [erroGeral, setErroGeral] = useState('');
  const [carregando, setCarregando] = useState(true);

  const [selecionadoId, setSelecionadoId] = useState(null);
  const [form, setForm] = useState(null);
  const [erroMov, setErroMov] = useState('');
  const [sucessoMov, setSucessoMov] = useState('');
  const [verificando, setVerificando] = useState(false);

  const carregarAgendamentos = useCallback(async () => {
    try {
      const dados = await api('/agendamentos');
      setAgendamentos(dados);
      setErroGeral('');
    } catch (falha) {
      setErroGeral(falha.message);
    }
  }, []);

  useEffect(() => {
    async function iniciar() {
      try {
        const p = await api('/profissionais');
        setProfissionais(p);
        await carregarAgendamentos();
      } finally {
        setCarregando(false);
      }
    }
    iniciar();
  }, [carregarAgendamentos]);

  const ordenados = useMemo(
    () => quicksort([...agendamentos], chaveOrdenacao(criterio)),
    [agendamentos, criterio]
  );

  function selecionar(item) {
    setSelecionadoId(item.id);
    setErroMov('');
    setSucessoMov('');
    setForm({
      cliente_id: item.cliente_id,
      cliente_nome: item.cliente_nome,
      profissional_id: item.profissional_id,
      tipo_servico: item.tipo_servico,
      data_agendamento: item.data_agendamento.slice(0, 10),
      hora_inicio: formatarHora(item.hora_inicio),
      hora_fim: formatarHora(item.hora_fim),
      status: item.status,
      observacoes: item.observacoes,
    });
  }

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErroMov('');
    setSucessoMov('');
    setVerificando(true);

    const payload = { ...form, profissional_id: Number(form.profissional_id) };
    delete payload.cliente_nome;

    try {
      await api(`/agendamentos/${selecionadoId}`, { method: 'PUT', body: JSON.stringify(payload) });
      setSucessoMov('Nenhum conflito encontrado. Agendamento atualizado com sucesso.');
      carregarAgendamentos();
    } catch (falha) {
      setErroMov(falha.message);
    } finally {
      setVerificando(false);
    }
  }

  return (
    <div className="app-shell">
      <TopBar />
      <main className="app-main">
        <div className="cabecalho-pagina">
          <div>
            <Link to="/" className="voltar">&larr; Voltar ao painel</Link>
            <h2 style={{ marginTop: '6px' }}>Gestao de agendamentos</h2>
          </div>
          <div className="ordenacao">
            Ordenar por
            <select value={criterio} onChange={(e) => setCriterio(e.target.value)}>
              <option value="cliente">Cliente (A-Z)</option>
              <option value="data">Data e horario</option>
            </select>
          </div>
        </div>

        <div className={`alerta erro ${erroGeral ? 'mostrar' : ''}`}>{erroGeral}</div>

        <div className="painel-gestao">
          <div className="painel">
            <div className="painel-toolbar">
              <span style={{ fontSize: '13px', color: 'var(--cor-texto-muted)' }}>
                Selecione um agendamento na lista para movimenta-lo
              </span>
            </div>

            {carregando ? (
              <div className="carregando-lista"><span className="spinner"></span> Carregando agendamentos...</div>
            ) : ordenados.length === 0 ? (
              <div className="vazio">
                <strong>Nenhum agendamento cadastrado</strong>
                Cadastre um agendamento na outra tela primeiro.
              </div>
            ) : (
              <div className="tabela-scroll">
                <table>
                  <thead>
                    <tr><th>Cliente</th><th>Profissional</th><th>Tipo</th><th>Data</th><th>Horario</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {ordenados.map((a) => (
                      <tr
                        key={a.id}
                        className={`linha-selecionavel ${a.id === selecionadoId ? 'selecionada' : ''}`}
                        onClick={() => selecionar(a)}
                      >
                        <td>{a.cliente_nome}</td>
                        <td>{a.profissional_nome}</td>
                        <td><span className={`selo-tipo ${a.tipo_servico}`}>{a.tipo_servico}</span></td>
                        <td style={{ fontFamily: 'var(--fonte-dado)', fontSize: '13px' }}>{formatarData(a.data_agendamento)}</td>
                        <td style={{ fontFamily: 'var(--fonte-dado)', fontSize: '13px' }}>{formatarHora(a.hora_inicio)} - {formatarHora(a.hora_fim)}</td>
                        <td><StatusBadge status={a.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="form-gestao">
            {!form ? (
              <div className="vazio vazio-lateral">
                <strong>Nenhum agendamento selecionado</strong>
                Clique em um agendamento na lista ao lado para editar tipo de servico, profissional, data e horario.
              </div>
            ) : (
              <>
                <h3>Movimentar agendamento #{selecionadoId}</h3>
                <p className="ajuda">Ajuste os dados abaixo. O sistema verifica conflitos automaticamente ao salvar.</p>

                <form onSubmit={handleSubmit}>
                  <div className="campo">
                    <label>Cliente</label>
                    <input type="text" value={form.cliente_nome} disabled />
                  </div>

                  <div className="campo">
                    <label htmlFor="movTipoServico">Tipo de servico</label>
                    <select id="movTipoServico" value={form.tipo_servico} onChange={(e) => atualizarCampo('tipo_servico', e.target.value)}>
                      <option value="residencial">Residencial</option>
                      <option value="comercial">Comercial</option>
                    </select>
                  </div>

                  <div className="campo">
                    <label htmlFor="movProfissional">Profissional alocado</label>
                    <select id="movProfissional" value={form.profissional_id} onChange={(e) => atualizarCampo('profissional_id', e.target.value)}>
                      {profissionais.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nome} ({p.especialidade}){!p.disponivel && ' - indisponivel'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="linha-2">
                    <div className="campo">
                      <label htmlFor="movData">Data</label>
                      <input type="date" id="movData" value={form.data_agendamento} onChange={(e) => atualizarCampo('data_agendamento', e.target.value)} required />
                    </div>
                    <div className="campo">
                      <label htmlFor="movStatus">Status</label>
                      <select id="movStatus" value={form.status} onChange={(e) => atualizarCampo('status', e.target.value)}>
                        <option value="agendado">Agendado</option>
                        <option value="concluido">Concluido</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
                  </div>

                  <div className="linha-2">
                    <div className="campo">
                      <label htmlFor="movHoraInicio">Horario de inicio</label>
                      <input type="time" id="movHoraInicio" value={form.hora_inicio} onChange={(e) => atualizarCampo('hora_inicio', e.target.value)} required />
                    </div>
                    <div className="campo">
                      <label htmlFor="movHoraFim">Horario de termino</label>
                      <input type="time" id="movHoraFim" value={form.hora_fim} onChange={(e) => atualizarCampo('hora_fim', e.target.value)} required />
                    </div>
                  </div>

                  <div className={`alerta erro ${erroMov ? 'mostrar' : ''}`}>{erroMov}</div>
                  <div className={`alerta sucesso ${sucessoMov ? 'mostrar' : ''}`}>{sucessoMov}</div>

                  <button type="submit" className="btn-primario" style={{ width: '100%' }} disabled={verificando}>
                    {verificando ? 'Verificando...' : 'Verificar conflitos e salvar'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}