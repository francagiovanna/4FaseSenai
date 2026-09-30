const pool = require("../config/database");

async function listarVeiculos(req, res) {
    try {
        const [veiculos] = await pool.execute(`
            SELECT
                v.id,
                v.placa,
                v.modelo,
                v.marca,
                v.ano,
                c.id AS cliente_id,
                c.nome AS cliente_nome
            FROM veiculos v
            INNER JOIN clientes c
                ON v.cliente_id = c.id
            ORDER BY v.modelo
        `);

        res.json(veiculos);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: "Erro ao buscar veículos."
        });
    }
}

async function criarVeiculo(req, res) {
    try {
        const {
            placa,
            modelo,
            marca,
            ano,
            cliente_id
        } = req.body;

        if (!placa || !modelo || !cliente_id) {
            return res.status(400).json({
                mensagem:
                    "Placa, modelo e cliente são obrigatórios."
            });
        }

        const [resultado] = await pool.execute(
            `
            INSERT INTO veiculos
            (placa, modelo, marca, ano, cliente_id)
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                placa,
                modelo,
                marca,
                ano,
                cliente_id
            ]
        );

        res.status(201).json({
            mensagem: "Veículo cadastrado com sucesso.",
            id: resultado.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: "Erro ao cadastrar veículo."
        });
    }
}

module.exports = {
    listarVeiculos,
    criarVeiculo
};