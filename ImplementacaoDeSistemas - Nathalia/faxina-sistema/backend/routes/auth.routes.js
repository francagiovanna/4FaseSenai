const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../../db');
const { exigirAutenticacao } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
// Valida credenciais e devolve um token JWT + dados basicos do usuario.
// Em caso de falha, devolve uma mensagem clara do motivo (RF 4.1).
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe e-mail e senha para continuar.' });
  }

  try {
    const resultado = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
    const usuario = resultado.rows[0];

    if (!usuario) {
      return res.status(401).json({ erro: 'E-mail nao cadastrado.' });
    }

    const senhaConfere = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaConfere) {
      return res.status(401).json({ erro: 'Senha incorreta.' });
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, nome: usuario.nome, email: usuario.email });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ erro: 'Erro interno ao tentar autenticar. Tente novamente.' });
  }
});

// GET /api/auth/me
// Usado pelas telas internas para confirmar a sessao e obter o nome do usuario logado.
router.get('/me', exigirAutenticacao, (req, res) => {
  res.json({ id: req.usuario.id, nome: req.usuario.nome, email: req.usuario.email });
});

module.exports = router;
