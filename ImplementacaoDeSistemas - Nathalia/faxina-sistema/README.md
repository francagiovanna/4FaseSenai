# Faxina App — Sistema de Agendamento de Serviços de Limpeza

Sistema web com **back-end em Node.js + Express** e **front-end em React (Vite)**, banco de dados **PostgreSQL**.

Cobre as entregas 4, 5, 6 e 7 da atividade: autenticação, tela principal, cadastro de agendamento e gestão de agendamentos (com verificação automática de conflitos de horário).

## Estrutura do projeto

```
faxina-sistema/
├── database/
│   └── faxina_db.sql        # script de criação e população do banco (entrega 3)
├── middleware/
│   └── auth.js              # validação do token JWT
├── routes/
│   ├── auth.routes.js       # login
│   ├── clientes.routes.js
│   ├── profissionais.routes.js
│   └── agendamentos.routes.js  # CRUD + verificação de conflito
├── frontend/                 # front-end em React (Vite)
│   ├── index.html
│   └── src/
│       ├── App.jsx           # rotas (react-router-dom)
│       ├── api.js            # cliente HTTP (fetch + JWT)
│       ├── styles.css        # identidade visual, compartilhada por todas as telas
│       ├── context/AuthContext.jsx
│       ├── components/       # TopBar, RotaProtegida
│       └── pages/
│           ├── Login.jsx                 # item 4
│           ├── Painel.jsx                # item 5 (tela principal)
│           ├── CadastroAgendamento.jsx   # item 6
│           └── GestaoAgendamentos.jsx    # item 7
├── server.js                 # serve a API e o build do React (frontend/dist)
├── db.js
├── package.json              # dependências do back-end
└── .env.example
```

## Pré-requisitos

- Node.js 18+
- PostgreSQL 14+

## Como rodar

1. **Criar o banco e rodar o script**

   ```bash
   createdb faxina_db
   psql -d faxina_db -f database/faxina_db.sql
   ```

2. **Configurar variáveis de ambiente**

   ```bash
   cp .env.example .env
   # edite DATABASE_URL com o usuário/senha do seu PostgreSQL
   ```

3. **Instalar as dependências do back-end e do front-end**

   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

### Modo desenvolvimento (dois servidores, com hot-reload no React)

```bash
npm start                 # terminal 1: back-end na porta 3000
cd frontend && npm run dev   # terminal 2: front-end na porta 5173
```

Acesse **http://localhost:5173** (o Vite já faz proxy de `/api` para o back-end, configurado em `frontend/vite.config.js`).

### Modo produção (um único servidor)

```bash
cd frontend && npm run build && cd ..
npm start
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
- **Tela principal** — nome do usuário logado, logout, atalhos para as demais telas.
- **Cadastro de agendamento** — listagem automática, busca por cliente/profissional/tipo, criação, edição, exclusão e validação de campos com alertas.
- **Gestão de agendamentos** — listagem ordenada (algoritmo quicksort implementado manualmente em `public/js/gestao-agendamentos.js`), seleção de um agendamento para movimentação (tipo de serviço, profissional, data e horário), com verificação automática de conflito de horário e de disponibilidade do profissional a cada alteração.

## Observações técnicas

- A verificação de conflito de horário é feita no back-end (`routes/agendamentos.routes.js`, função `verificarConflito`), tanto na criação quanto na edição, comparando sobreposição de intervalos (`hora_inicio` / `hora_fim`) para o mesmo profissional e data.
- Senhas são armazenadas com hash `bcrypt`.
- Sessão do front-end é mantida via `localStorage` (token JWT); `AuthContext` (`frontend/src/context/AuthContext.jsx`) expõe o usuário logado para toda a árvore de componentes, e `RotaProtegida` redireciona para `/login` quando não há sessão.
- A ordenação da tela de gestão de agendamentos usa um quicksort implementado manualmente (`frontend/src/pages/GestaoAgendamentos.jsx`), não o `.sort()` nativo do array.
- Roteamento client-side com `react-router-dom`; `server.js` tem um fallback que devolve `index.html` para qualquer rota fora de `/api`, necessário para o React Router funcionar em recarregamentos de página.
