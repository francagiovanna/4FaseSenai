# Faxina App — Sistema de Agendamento de Serviços de Limpeza

Sistema web com **back-end em Node.js + Express** e **front-end em React (Vite)**, banco de dados **PostgreSQL** (hospedado na [Neon](https://neon.tech)).

Cobre as entregas 4, 5, 6 e 7 da atividade: autenticação, tela principal, cadastro de agendamento e gestão de agendamentos (com verificação automática de conflitos de horário).

## Estrutura do projeto

```
faxina-sistema/
├── database/
│   └── faxina_db.sql          # script de criação e população do banco (entrega 3)
├── backend/
│   ├── server.js              # serve a API e o build do React (frontend/dist)
│   ├── db.js                  # pool de conexão com o PostgreSQL (Neon)
│   ├── middleware/
│   │   └── auth.js            # validação do token JWT
│   ├── routes/
│   │   ├── auth.routes.js         # login
│   │   ├── clientes.routes.js
│   │   ├── profissionais.routes.js
│   │   └── agendamentos.routes.js # CRUD + verificação de conflito
│   ├── package.json
│   └── .env.example
├── frontend/                  # front-end em React (Vite)
│   ├── index.html
│   ├── vite.config.js
│   ├── public/
│   │   └── logo_faxina.png
│   └── src/
│       ├── App.jsx            # rotas (react-router-dom)
│       ├── api.js             # cliente HTTP (fetch + JWT)
│       ├── styles.css         # identidade visual, compartilhada por todas as telas
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── components/
│       │   ├── TopBar.jsx
│       │   ├── StatusBadge.jsx
│       │   └── ModalConfirmacao.jsx
│       └── pages/
│           ├── Login.jsx                 # item 4
│           ├── Painel.jsx                # item 5 (tela principal)
│           ├── CadastroAgendamento.jsx   # item 6
│           └── GestaoAgendamentos.jsx    # item 7
├── README.md
└── LICENSE
```

## Pré-requisitos

- Node.js 18+
- Conta no [Neon](https://neon.tech) (PostgreSQL serverless, plano free) ou um PostgreSQL 14+ local/próprio

## Como rodar

1. **Banco de dados**

   O script `database/faxina_db.sql` cria as tabelas e popula os dados de exemplo. Rode-o contra a instância PostgreSQL que você for usar:

   ```bash
   psql "SUA_CONNECTION_STRING" -f database/faxina_db.sql
   ```

   > **Nota:** o banco está hospedado no Neon com o nome `neondb`, e não `faxina_db` — o plano free do Neon permite apenas um banco por projeto, então o nome do banco em si diverge do especificado na atividade. O script e as tabelas seguem exatamente o schema exigido.

2. **Configurar variáveis de ambiente do back-end**

   ```bash
   cd backend
   cp .env.example .env
   # edite DATABASE_URL com a connection string do Neon (ou do seu Postgres)
   ```

   O `.env` precisa conter:
   ```
   DATABASE_URL=postgresql://usuario:senha@host/neondb?sslmode=require
   JWT_SECRET=sua_chave_secreta
   PORT=3000
   ```

3. **Instalar as dependências**

   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

### Modo desenvolvimento (dois servidores, com hot-reload no React)

```bash
cd backend && npm start        # terminal 1: back-end na porta 3000
cd frontend && npm run dev     # terminal 2: front-end na porta 5173
```

Acesse **http://localhost:5173** (o Vite já faz proxy de `/api` para o back-end, configurado em `frontend/vite.config.js`).

### Modo produção (um único servidor)

```bash
cd frontend && npm run build
cd ../backend && npm start
```

Acesse **http://localhost:3000** — o Express serve a API e o build do React (`frontend/dist`), com fallback de SPA para as rotas do React Router.

### Login de teste

| E-mail | Senha |
|---|---|
| ana.souza@faxinapp.com | 123456 |
| bruno.lima@faxinapp.com | 123456 |
| carla.reis@faxinapp.com | 123456 |

## Funcionalidades implementadas

- **Login** — autenticação com JWT; mensagem de erro específica (e-mail não encontrado / senha incorreta) e retorno à tela de login.
- **Tela principal** — nome do usuário logado, logout, resumo com números reais (agendamentos ativos, residenciais, comerciais, próximo atendimento) e atalhos para as demais telas.
- **Cadastro de agendamento** — listagem automática, busca por cliente/profissional/tipo, criação, edição, exclusão e validação de campos com alertas.
- **Gestão de agendamentos** — listagem ordenada (algoritmo quicksort implementado manualmente em `frontend/src/pages/GestaoAgendamentos.jsx`), seleção de um agendamento para movimentação (tipo de serviço, profissional, data e horário), com verificação automática de conflito de horário e de disponibilidade do profissional a cada alteração.

## Observações técnicas

- A verificação de conflito de horário é feita no back-end (`backend/routes/agendamentos.routes.js`, função `verificarConflito`), tanto na criação quanto na edição, comparando sobreposição de intervalos (`hora_inicio` / `hora_fim`) para o mesmo profissional e data.
- Senhas são armazenadas com hash `bcrypt`.
- Sessão do front-end é mantida via `localStorage` (token JWT); `AuthContext` (`frontend/src/context/AuthContext.jsx`) expõe o usuário logado para toda a árvore de componentes.
- A ordenação da tela de gestão de agendamentos usa um quicksort implementado manualmente, não o `.sort()` nativo do array.
- Roteamento client-side com `react-router-dom`; `backend/server.js` tem um fallback que devolve `index.html` para qualquer rota fora de `/api`, necessário para o React Router funcionar em recarregamentos de página.
- Identidade visual: verde-petróleo (`#0F6E67`) como cor primária, terracota (`#C1704A`) como cor de destaque, fundo marfim (`#FBF6EF`). Fontes: Space Grotesk (títulos), Inter (corpo) e IBM Plex Mono (dados/horários).