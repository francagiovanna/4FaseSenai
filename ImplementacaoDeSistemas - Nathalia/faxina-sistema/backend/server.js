require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const clientesRoutes = require('./routes/clientes.routes');
const profissionaisRoutes = require('./routes/profissionais.routes');
const agendamentosRoutes = require('./routes/agendamentos.routes');

const app = express();

app.use(cors());
app.use(express.json());

// API
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/profissionais', profissionaisRoutes);
app.use('/api/agendamentos', agendamentosRoutes);

// Front-end React (build gerado por "npm run build" dentro de /frontend).
// (frontend/vite.config.js ja faz proxy de /api para este servidor).
const frontendDist = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(frontendDist));

// Fallback de SPA: qualquer rota que nao seja /api/* devolve o index.html,
// deixando o React Router decidir qual tela renderizar (login, painel, etc).
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
