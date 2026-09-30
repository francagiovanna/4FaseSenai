CREATE DATABASE IF NOT EXISTS oficina_mecanica;

USE oficina_mecanica;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(150),
    endereco VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE veiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(10) NOT NULL UNIQUE,
    modelo VARCHAR(100) NOT NULL,
    marca VARCHAR(100),
    ano INT,
    cliente_id INT NOT NULL,

    CONSTRAINT fk_veiculo_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES clientes(id)
        ON DELETE CASCADE
);

CREATE TABLE ordens_servico (
    id INT AUTO_INCREMENT PRIMARY KEY,

    cliente_id INT NOT NULL,
    veiculo_id INT NOT NULL,

    data_agendamento DATETIME NOT NULL,

    descricao TEXT NOT NULL,

    status VARCHAR(30) DEFAULT 'Aberta',

    valor DECIMAL(10,2) DEFAULT 0.00,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_os_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES clientes(id),

    CONSTRAINT fk_os_veiculo
        FOREIGN KEY (veiculo_id)
        REFERENCES veiculos(id)
);

INSERT INTO clientes
(nome, cpf, telefone, email, endereco)
VALUES
(
    'João da Silva',
    'DADO_CRIPTOGRAFADO_1',
    '(48) 99999-1111',
    'joao@email.com',
    'Rua A, 100'
),
(
    'Maria Souza',
    'DADO_CRIPTOGRAFADO_2',
    '(48) 99999-2222',
    'maria@email.com',
    'Rua B, 200'
),
(
    'Carlos Oliveira',
    'DADO_CRIPTOGRAFADO_3',
    '(48) 99999-3333',
    'carlos@email.com',
    'Rua C, 300'
);

INSERT INTO veiculos
(placa, modelo, marca, ano, cliente_id)
VALUES
('ABC1D23', 'Civic', 'Honda', 2020, 1),
('DEF4G56', 'Onix', 'Chevrolet', 2022, 2),
('HIJ7K89', 'Gol', 'Volkswagen', 2019, 3);

INSERT INTO ordens_servico
(
    cliente_id,
    veiculo_id,
    data_agendamento,
    descricao,
    status,
    valor
)
VALUES
(
    1,
    1,
    '2026-10-01 09:00:00',
    'Troca de óleo e filtro',
    'Aberta',
    250.00
),
(
    2,
    2,
    '2026-10-02 10:30:00',
    'Revisão dos freios',
    'Em andamento',
    450.00
),
(
    3,
    3,
    '2026-10-03 14:00:00',
    'Alinhamento e balanceamento',
    'Aberta',
    180.00
);