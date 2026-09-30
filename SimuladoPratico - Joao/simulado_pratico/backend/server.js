const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const veiculoRoutes = require("./routes/veiculoRoutes");
const ordemServicoRoutes = require("./routes/ordemServicoRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensagem: "API da oficina mecânica funcionando."
    });
});

app.use("/api/auth", authRoutes);

app.use("/api/clientes", clienteRoutes);

app.use("/api/veiculos", veiculoRoutes);

app.use("/api/ordens-servico", ordemServicoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});