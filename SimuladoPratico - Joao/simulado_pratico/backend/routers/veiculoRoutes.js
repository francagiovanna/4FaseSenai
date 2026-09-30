const express = require("express");

const router = express.Router();

const autenticar = require("../middlewares/authMiddleware");

const {
    listarVeiculos,
    criarVeiculo
} = require("../controllers/veiculoController");

router.get("/", autenticar, listarVeiculos);

router.post("/", autenticar, criarVeiculo);

module.exports = router;