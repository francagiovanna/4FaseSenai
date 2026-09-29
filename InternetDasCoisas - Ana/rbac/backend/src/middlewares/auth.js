import jwt from "jasonwebtoken";

export const authenticate = (req, res, next) => {
    const[scheme, token] = (req. headres.authorization || "").split(" ");

    if(scheme !== "Bearer" || !token) {
        return res.status(401).json({message: "LOgin necessario"});
    }

    try {
        //Verifica assinatura e validade; garada o perfil para proxima funcção
        req.user = jwt.verify(token, process.env.JWT_SECRET, {algorithms: ["HS256"]});
    }catch (error) {
        return res.status(401).json({message: "Sessão invalida ou expirada"})
    }

    next();

}

//Confere permição depois que o usuario foi autenticado
export const requireRole = () => {
    return (req, res, next) => {
        if(req.user?.role !== role)
            return res.status(403).json({message: "Acesso negado."})

            next();
    }

}