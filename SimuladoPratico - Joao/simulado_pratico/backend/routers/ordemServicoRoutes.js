const express = require("express");

const router = express.Router();

const autenticar = require("../middlewares/authMiddleware");

const {
    listarOrdens,
    criarOrdem
} = require("../controllers/ordemServicoController");

router.get("/", autenticar, listarOrdens);

router.post("/", autenticar, criarOrdem);

module.exports = router;