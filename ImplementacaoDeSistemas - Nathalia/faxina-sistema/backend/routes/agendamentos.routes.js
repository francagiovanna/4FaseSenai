const express = require('express');
const { pool } = require('../db');
const { exigirAutenticacao } = require('../middleware/auth');

const router = express.Router();
router.use(exigirAutenticacao);

const SELECT_BASE = `
  SELECT
    a.id, a.tipo_servico, a.data_agendamento, a.hora_inicio, a.hora_fim,
    a.status, a.observacoes, a.criado_em, a.atualizado_em,
    c.id AS cliente_id, c.nome AS cliente_nome,
    p.id AS profissional_id, p.nome AS profissional_nome
  FROM agendamento a
  JOIN cliente c ON c.id = a.cliente_id
  JOIN profissional p ON p.id = a.profissional_id
`;

// GET /api/agendamentos?busca=termo
// Lista os agendamentos. Se "busca" for informado, filtra por cliente,
// profissional ou tipo de servico (RF 6.1.1 e 6.1.2).
router.get('/', async (req, res) => {
  const { busca } = req.query;
  try {
    if (busca && busca.trim() !== '') {
      const termo = `%${busca.trim()}%`;
      const resultado = await pool.query(
        `${SELECT_BASE}
         WHERE c.nome ILIKE $1 OR p.nome ILIKE $1 OR a.tipo_servico ILIKE $1
         ORDER BY a.data_agendamento ASC, a.hora_inicio ASC`,
        [termo]
      );
      return res.json(resultado.rows);
    }

    const resultado = await pool.query(`${SELECT_BASE} ORDER BY a.data_agendamento ASC, a.hora_inicio ASC`);
    res.json(resultado.rows);
  } catch (err) {
    console.error('Erro ao listar agendamentos:', err);
    res.status(500).json({ erro: 'Nao foi possivel carregar os agendamentos.' });
  }
});

// Valida os campos obrigatorios de um agendamento. Retorna uma string de
// erro (para exibir ao usuario) ou null se estiver tudo certo (RF 6.1.6).
function validarCamposAgendamento(dados) {
  const { cliente_id, profissional_id, tipo_servico, data_agendamento, hora_inicio, hora_fim } = dados;

  if (!cliente_id) return 'Selecione um cliente.';
  if (!profissional_id) return 'Selecione um profissional.';
  if (!tipo_servico || !['residencial', 'comercial'].includes(tipo_servico)) {
    return 'Selecione o tipo de servico (residencial ou comercial).';
  }
  if (!data_agendamento) return 'Informe a data do agendamento.';
  if (!hora_inicio || !hora_fim) return 'Informe o horario de inicio e de termino.';
  if (hora_fim <= hora_inicio) return 'O horario de termino deve ser depois do horario de inicio.';

  const hoje = new Date().toISOString().slice(0, 10);
  if (data_agendamento < hoje) return 'A data do agendamento nao pode ser no passado.';

  return null;
}

// Verifica conflito de horario do profissional e sua disponibilidade
// (RF 7.1.4). ignorarId e usado nas edicoes, para nao comparar o
// agendamento com ele mesmo.
async function verificarConflito({ profissional_id, data_agendamento, hora_inicio, hora_fim }, ignorarId = null) {
  const disponibilidade = await pool.query('SELECT disponivel, nome FROM profissional WHERE id = $1', [profissional_id]);
  const profissional = disponibilidade.rows[0];

  if (!profissional) return 'Profissional nao encontrado.';
  if (!profissional.disponivel) return `${profissional.nome} esta marcado como indisponivel no momento.`;

  const params = [profissional_id, data_agendamento, hora_fim, hora_inicio];
  let query = `
    SELECT id FROM agendamento
    WHERE profissional_id = $1
      AND data_agendamento = $2
      AND status != 'cancelado'
      AND hora_inicio < $3
      AND hora_fim > $4
  `;
  if (ignorarId) {
    params.push(ignorarId);
    query += ' AND id != $5';
  }

  const conflito = await pool.query(query, params);
  if (conflito.rows.length > 0) {
    return `Conflito de horario: ${profissional.nome} ja possui outro atendimento nesse periodo.`;
  }
  return null;
}

// POST /api/agendamentos - cria um novo agendamento (RF 6.1.3 e 7.1.3)
router.post('/', async (req, res) => {
  const erroValidacao = validarCamposAgendamento(req.body);
  if (erroValidacao) return res.status(400).json({ erro: erroValidacao });

  try {
    const erroConflito = await verificarConflito(req.body);
    if (erroConflito) return res.status(409).json({ erro: erroConflito });

    const { cliente_id, profissional_id, tipo_servico, data_agendamento, hora_inicio, hora_fim, observacoes } = req.body;
    const resultado = await pool.query(
      `INSERT INTO agendamento (cliente_id, profissional_id, tipo_servico, data_agendamento, hora_inicio, hora_fim, observacoes)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [cliente_id, profissional_id, tipo_servico, data_agendamento, hora_inicio, hora_fim, observacoes || null]
    );
    res.status(201).json({ id: resultado.rows[0].id, mensagem: 'Agendamento criado com sucesso.' });
  } catch (err) {
    console.error('Erro ao criar agendamento:', err);
    res.status(500).json({ erro: 'Nao foi possivel criar o agendamento.' });
  }
});

// PUT /api/agendamentos/:id - edita um agendamento existente (RF 6.1.4)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const erroValidacao = validarCamposAgendamento(req.body);
  if (erroValidacao) return res.status(400).json({ erro: erroValidacao });

  try {
    const erroConflito = await verificarConflito(req.body, id);
    if (erroConflito) return res.status(409).json({ erro: erroConflito });

    const { cliente_id, profissional_id, tipo_servico, data_agendamento, hora_inicio, hora_fim, observacoes, status } = req.body;
    const resultado = await pool.query(
      `UPDATE agendamento SET
         cliente_id = $1, profissional_id = $2, tipo_servico = $3, data_agendamento = $4,
         hora_inicio = $5, hora_fim = $6, observacoes = $7, status = COALESCE($8, status),
         atualizado_em = NOW()
       WHERE id = $9 RETURNING id`,
      [cliente_id, profissional_id, tipo_servico, data_agendamento, hora_inicio, hora_fim, observacoes || null, status || null, id]
    );

    if (resultado.rows.length === 0) return res.status(404).json({ erro: 'Agendamento nao encontrado.' });
    res.json({ mensagem: 'Agendamento atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar agendamento:', err);
    res.status(500).json({ erro: 'Nao foi possivel atualizar o agendamento.' });
  }
});

// DELETE /api/agendamentos/:id (RF 6.1.5)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await pool.query('DELETE FROM agendamento WHERE id = $1 RETURNING id', [id]);
    if (resultado.rows.length === 0) return res.status(404).json({ erro: 'Agendamento nao encontrado.' });
    res.json({ mensagem: 'Agendamento excluido com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir agendamento:', err);
    res.status(500).json({ erro: 'Nao foi possivel excluir o agendamento.' });
  }
});

module.exports = router;
