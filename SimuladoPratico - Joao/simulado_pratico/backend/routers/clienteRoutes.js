const express = require("express");

const router = express.Router();

const autenticar = require("../middlewares/authMiddleware");

const {
    listarClientes,
    buscarClientes,
    criarCliente
} = require("../controllers/clienteController");

router.get("/", autenticar, listarClientes);

router.get("/buscar", autenticar, buscarClientes);

router.post("/", autenticar, criarCliente);

module.exports = router;