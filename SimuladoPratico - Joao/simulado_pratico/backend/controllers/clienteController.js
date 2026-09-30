const pool = require("../config/database");
const crypto = require("crypto");

const CHAVE = crypto
    .createHash("sha256")
    .update(process.env.JWT_SECRET)
    .digest();

function criptografar(texto) {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        CHAVE,
        iv
    );

    let encrypted = cipher.update(texto, "utf8", "hex");

    encrypted += cipher.final("hex");

    return `${iv.toString("hex")}:${encrypted}`;
}

async function listarClientes(req, res) {
    try {
        const [clientes] = await pool.execute(`
            SELECT id, nome, telefone, email
            FROM clientes
            ORDER BY nome
        `);

        res.json(clientes);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: "Erro ao buscar clientes."
        });
    }
}

async function buscarClientes(req, res) {
    try {
        const { termo } = req.query;

        const [clientes] = await pool.execute(
            `
            SELECT id, nome, telefone, email
            FROM clientes
            WHERE nome LIKE ?
               OR telefone LIKE ?
               OR email LIKE ?
            ORDER BY nome
            `,
            [
                `%${termo}%`,
                `%${termo}%`,
                `%${termo}%`
            ]
        );

        res.json(clientes);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: "Erro ao realizar busca."
        });
    }
}

async function criarCliente(req, res) {
    try {
        const {
            nome,
            cpf,
            telefone,
            email,
            endereco
        } = req.body;

        if (!nome || !cpf) {
            return res.status(400).json({
                mensagem: "Nome e CPF são obrigatórios."
            });
        }

        const cpfCriptografado = criptografar(cpf);

        const [resultado] = await pool.execute(
            `
            INSERT INTO clientes
            (nome, cpf, telefone, email, endereco)
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                nome,
                cpfCriptografado,
                telefone,
                email,
                endereco
            ]
        );

        res.status(201).json({
            mensagem: "Cliente cadastrado com sucesso.",
            id: resultado.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: "Erro ao cadastrar cliente."
        });
    }
}

module.exports = {
    listarClientes,
    buscarClientes,
    criarCliente
};