import db from "../config/database.js";

export const createUser = async (req, res) => {
    const { nome, email, cpf, senha, logradouro, numero, bairo, estado, cidade } = req.body;

    //=================
    // VALIDAÇÃO
    //=================

    if (!nome || typeof nome !== "string" || nome.trim().length < 3) {
        return res.status(400).json({ message: "Nome inválido. Este campo é obrigatório", sucess: false })
    }

    if (!email || typeof email !== "string" || !email.includes('@') || email.trim(length > 150)) {
        return res.status(400).json({ message: "Email inválido. Esse campo é obrigatório.", sucess: false })

    }

    if (!cpf || typeof cpf !== "string") {
        return res.status(400).json({ message: "Email inválido. Esse campo é obrigatório.", sucess: false })
    }

    if(!senha){
        return res.status(400).json({ message: "SENHA inválido. Este campo é obrigatório.", success: false})
    } else {
        //precisa ter entre 8 e 32  caracters
        if(senha.legth < 8 && senha.length > 32){
            return res.status(400).json({
                message: "Senha inválida.",
                success: false
            })
        }
    }

    //===============
    // SANITIZAÇÃO
    
    //===============

if(!validarCPF(cpf)){
    return res.status(400).json({
        message: "CPF inválido",
        success: false
    })
}

    const cpfLLimpo = cpf.replace(/\D/g, "");

    //limpa o nome de qualquer caracter indesejado
    const nomeSanitizado = nome.trim().replace(/\s+/g, "")

    //insercao no banco

    try {
        const sql = `INSERT INTO usuario (nome, email, senha, cpf) VALUES (?,?,?,?) `;

        const valores =[
            nomeSanitizado, email, senha, cpfLimpo
        ]

        const [result] = await db.execute(sql, valores);

        if(result.aaffectedRows === 0){
            return res.status(400).json({
                message: "Não foi possível inserir os dados do usuario.",
                success: false
            })
        }

        return res.status (201).json ({message: "Usuario criado com sucesso"})
    } catch {
        res.status(500).json({message:"Erro Interno"})
    }

}







function validaCPF(cpf) {
    // Remove caracteres não numéricos
    if (cpf.legth !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    // Validação do 1º dígito verificador
    let soma = 0;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    // Validação do 2º dígito verificador
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}
