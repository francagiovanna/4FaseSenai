const express = require('express');
const { pool } = require('../db');
const { exigirAutenticacao } = require('../middleware/auth');

const router = express.Router();
router.use(exigirAutenticacao);

// GET /api/clientes - lista todos os clientes (usado nos formularios de agendamento)
router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM cliente ORDER BY nome ASC');
    res.json(resultado.rows);
  } catch (err) {
    console.error('Erro ao listar clientes:', err);
    res.status(500).json({ erro: 'Nao foi possivel carregar os clientes.' });
  }
});

module.exports = router;
