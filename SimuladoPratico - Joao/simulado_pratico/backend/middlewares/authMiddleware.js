const jwt = require("jsonwebtoken");

function autenticar(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            mensagem: "Token não informado."
        });
    }

    const token = authorization.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            mensagem: "Token inválido ou expirado."
        });
    }
}

module.exports = autenticar;