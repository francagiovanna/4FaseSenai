# Faxina App

### Documentação de Requisitos e Casos de Teste

---

## 1. Lista de Requisitos Funcionais

Requisitos funcionais identificados a partir do desafio proposto, organizados por interface do sistema. A numeração (RF) corresponde diretamente à numeração dos subitens do documento da atividade.

### 1.1 Autenticação (Login)

| ID | Descrição | Interface relacionada |
|---|---|---|
| RF04.1 | Em caso de falha de autenticação (e-mail não cadastrado ou senha incorreta), o sistema deve informar ao usuário o motivo da falha e mantê-lo na tela de login. | Login |

### 1.2 Interface Principal

| ID | Descrição | Interface relacionada |
|---|---|---|
| RF05.1.1 | Exibir o nome do usuário autenticado. | Interface principal |
| RF05.1.2 | Permitir que o usuário realize logout, redirecionando à tela de login. | Interface principal |
| RF05.1.3 | Disponibilizar acesso à interface de Cadastro de Agendamento. | Interface principal |
| RF05.1.4 | Disponibilizar acesso à interface de Gestão de Agendamentos. | Interface principal |

### 1.3 Cadastro de Agendamento

| ID | Descrição | Interface relacionada |
|---|---|---|
| RF06.1.1 | Listar os agendamentos cadastrados em uma tabela, carregada automaticamente ao acessar a interface. | Cadastro de agendamento |
| RF06.1.2 | Permitir busca por termo (cliente, profissional ou tipo de serviço), atualizando a listagem conforme o termo informado. | Cadastro de agendamento |
| RF06.1.3 | Permitir a inserção de um novo agendamento no banco de dados. | Cadastro de agendamento |
| RF06.1.4 | Permitir a edição de um agendamento existente. | Cadastro de agendamento |
| RF06.1.5 | Permitir a exclusão de um agendamento existente. | Cadastro de agendamento |
| RF06.1.6 | Validar os campos obrigatórios na criação/edição, exibindo alertas em caso de dados ausentes ou inválidos. | Cadastro de agendamento |
| RF06.1.7 | Permitir o retorno à interface principal do sistema. | Cadastro de agendamento |

### 1.4 Gestão de Agendamentos

| ID | Descrição | Interface relacionada |
|---|---|---|
| RF07.1.1 | Listar os agendamentos em ordem alfabética ou cronológica, utilizando algoritmo de ordenação. | Gestão de agendamentos |
| RF07.1.2 | Permitir a seleção do agendamento a ser movimentado, possibilitando alterar o tipo de serviço (residencial/comercial) e o profissional alocado. | Gestão de agendamentos |
| RF07.1.3 | Permitir a inserção/alteração da data e do horário do agendamento. | Gestão de agendamentos |
| RF07.1.4 | Verificar automaticamente conflitos de horário ou indisponibilidade do profissional a cada movimentação, emitindo alerta ao usuário. | Gestão de agendamentos |

---

## 2. Descritivo de Casos de Teste de Software

### 2.1 Ferramentas e Ambiente

- Ambiente de desenvolvimento: Node.js v24.13.0 (backend/Express), React + Vite (frontend), Windows 11, versão 25H2.
- Banco de dados: PostgreSQL, hospedado na Neon (banco "neondb"), populado conforme `database/faxina_db.sql`.
