DROP TABLE IF EXISTS agendamento CASCADE;
DROP TABLE IF EXISTS profissional CASCADE;
DROP TABLE IF EXISTS cliente CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;

CREATE TABLE usuario (
    id            SERIAL PRIMARY KEY,
    nome          VARCHAR(120)        NOT NULL,
    email         VARCHAR(150) UNIQUE NOT NULL,
    senha_hash    VARCHAR(255)        NOT NULL,
    criado_em     TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE TABLE cliente (
    id            SERIAL PRIMARY KEY,
    nome          VARCHAR(120)        NOT NULL,
    email         VARCHAR(150),
    telefone      VARCHAR(20)         NOT NULL,
    endereco      VARCHAR(255)        NOT NULL,
    tipo_cliente  VARCHAR(20)         NOT NULL DEFAULT 'residencial'
                  CHECK (tipo_cliente IN ('residencial', 'comercial')),
    criado_em     TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE TABLE profissional (
    id            SERIAL PRIMARY KEY,
    nome          VARCHAR(120)        NOT NULL,
    email         VARCHAR(150),
    telefone      VARCHAR(20)         NOT NULL,
    especialidade VARCHAR(80)         NOT NULL DEFAULT 'geral',
    disponivel    BOOLEAN             NOT NULL DEFAULT TRUE,
    criado_em     TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE TABLE agendamento (
    id               SERIAL PRIMARY KEY,
    cliente_id       INTEGER NOT NULL REFERENCES cliente(id) ON DELETE RESTRICT,
    profissional_id  INTEGER NOT NULL REFERENCES profissional(id) ON DELETE RESTRICT,
    tipo_servico     VARCHAR(20) NOT NULL DEFAULT 'residencial'
                     CHECK (tipo_servico IN ('residencial', 'comercial')),
    data_agendamento DATE NOT NULL,
    hora_inicio      TIME NOT NULL,
    hora_fim         TIME NOT NULL,
    status           VARCHAR(20) NOT NULL DEFAULT 'agendado'
                     CHECK (status IN ('agendado', 'concluido', 'cancelado')),
    observacoes      VARCHAR(255),
    criado_em        TIMESTAMP NOT NULL DEFAULT NOW(),
    atualizado_em    TIMESTAMP NOT NULL DEFAULT NOW(),
    CHECK (hora_fim > hora_inicio)
);

CREATE INDEX idx_agendamento_profissional_data ON agendamento (profissional_id, data_agendamento);
CREATE INDEX idx_agendamento_cliente ON agendamento (cliente_id);

INSERT INTO usuario (nome, email, senha_hash) VALUES
('Ana Souza',   'ana.souza@faxinapp.com',   '$2b$10$kPvcyXQBt5drkCkU1WI4CuHGPMXO1iqYmv1cwJdKsutxtSoc0GhVC'),
('Bruno Lima',  'bruno.lima@faxinapp.com',  '$2b$10$kPvcyXQBt5drkCkU1WI4CuHGPMXO1iqYmv1cwJdKsutxtSoc0GhVC'),
('Carla Reis',  'carla.reis@faxinapp.com',  '$2b$10$kPvcyXQBt5drkCkU1WI4CuHGPMXO1iqYmv1cwJdKsutxtSoc0GhVC');

INSERT INTO cliente (nome, email, telefone, endereco, tipo_cliente) VALUES
('Marcos Andrade',        'marcos.andrade@email.com', '(47) 99911-2233', 'Rua das Palmeiras, 120 - Joinville/SC',  'residencial'),
('Loja Vitrine Ltda',     'contato@vitrineloja.com',  '(47) 98822-1144', 'Av. Central, 900 - Joinville/SC',        'comercial'),
('Fernanda Prado',        'fernanda.prado@email.com', '(47) 99733-5566', 'Rua Bom Retiro, 45 - Joinville/SC',      'residencial');

INSERT INTO profissional (nome, email, telefone, especialidade, disponivel) VALUES
('Juliana Matos',  'juliana.matos@faxinapp.com',  '(47) 99911-7788', 'residencial', TRUE),
('Ricardo Nunes',  'ricardo.nunes@faxinapp.com',  '(47) 99822-3344', 'comercial',   TRUE),
('Patricia Gomes', 'patricia.gomes@faxinapp.com', '(47) 99733-9900', 'geral',       TRUE);

INSERT INTO agendamento (cliente_id, profissional_id, tipo_servico, data_agendamento, hora_inicio, hora_fim, status, observacoes) VALUES
(1, 1, 'residencial', CURRENT_DATE + INTERVAL '2 day', '09:00', '11:00', 'agendado', 'Cliente pediu atencao especial na cozinha'),
(2, 2, 'comercial',   CURRENT_DATE + INTERVAL '3 day', '14:00', '17:00', 'agendado', 'Faxina apos horario comercial'),
(3, 3, 'residencial', CURRENT_DATE + INTERVAL '5 day', '08:00', '10:00', 'agendado', NULL);