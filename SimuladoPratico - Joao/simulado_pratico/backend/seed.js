const pool = require("./config/database");
const bcrypt = require("bcryptjs");

async function seed() {
    try {
        const usuarios = [
            {
                nome: "Administrador",
                email: "admin@oficina.com",
                senha: "123456"
            },
            {
                nome: "João da Silva",
                email: "joao@oficina.com",
                senha: "123456"
            },
            {
                nome: "Maria Souza",
                email: "maria@oficina.com",
                senha: "123456"
            }
        ];

        for (const usuario of usuarios) {
            const senhaCriptografada = await bcrypt.hash(
                usuario.senha,
                10
            );

            await pool.execute(
                `
                INSERT INTO usuarios
                (nome, email, senha)
                VALUES (?, ?, ?)
                `,
                [
                    usuario.nome,
                    usuario.email,
                    senhaCriptografada
                ]
            );
        }

        console.log("Usuários cadastrados com sucesso!");

    } catch (error) {
        console.error("Erro ao cadastrar usuários:", error);

    } finally {
        await pool.end();
    }
}

seed();