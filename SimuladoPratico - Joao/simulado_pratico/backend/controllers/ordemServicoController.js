const pool = require("../config/database");

async function listarOrdens(req, res) {
    try {
        const [ordens] = await pool.execute(`
            SELECT
                os.id,
                os.data_agendamento,
                os.descricao,
                os.status,
                os.valor,

                c.nome AS cliente_nome,

                v.placa AS veiculo_placa,
                v.modelo AS veiculo_modelo

            FROM ordens_servico os

            INNER JOIN clientes c
                ON os.cliente_id = c.id

            INNER JOIN veiculos v
                ON os.veiculo_id = v.id

            ORDER BY os.data_agendamento ASC
        `);

        res.json(ordens);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: "Erro ao buscar ordens de serviço."
        });
    }
}

async function criarOrdem(req, res) {
    try {
        const {
            cliente_id,
            veiculo_id,
            data_agendamento,
            descricao,
            status,
            valor
        } = req.body;

        if (
            !cliente_id ||
            !veiculo_id ||
            !data_agendamento ||
            !descricao
        ) {
            return res.status(400).json({
                mensagem: "Preencha os campos obrigatórios."
            });
        }

        const [resultado] = await pool.execute(
            `
            INSERT INTO ordens_servico
            (
                cliente_id,
                veiculo_id,
                data_agendamento,
                descricao,
                status,
                valor
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                cliente_id,
                veiculo_id,
                data_agendamento,
                descricao,
                status || "Aberta",
                valor || 0
            ]
        );

        res.status(201).json({
            mensagem: "Ordem de serviço cadastrada.",
            id: resultado.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: "Erro ao cadastrar ordem de serviço."
        });
    }
}

module.exports = {
    listarOrdens,
    criarOrdem
};