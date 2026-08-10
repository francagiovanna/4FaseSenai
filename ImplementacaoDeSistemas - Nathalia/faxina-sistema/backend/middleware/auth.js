const jwt = require('jsonwebtoken');

function exigirAutenticacao(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [tipo, token] = authHeader.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Sessao ausente ou invalida. Faca login novamente.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // { id, nome, email }
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Sessao expirada. Faca login novamente.' });
  }
}

module.exports = { exigirAutenticacao };
