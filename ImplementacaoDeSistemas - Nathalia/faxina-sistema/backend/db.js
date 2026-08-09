const { Pool } = require('pg');

// Pool de conexoes com o PostgreSQL. Le a string de conexao do .env
// (DATABASE_URL).
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool de conexoes do PostgreSQL:', err);
});

module.exports = { pool };