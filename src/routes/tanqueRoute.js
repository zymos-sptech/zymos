var express = require("express");
var router = express.Router();

var tanqueController = require("../controllers/tanqueController");

router.post("/cadastrar", function (req, res) {
    tanqueController.cadastrar(req, res);
});

router.get("/listar/:idUnidade", function (req, res) {
    tanqueController.listarPorUnidade(req, res);
});

router.put("/editar/:idTanque", function (req, res) {
    tanqueController.editar(req, res);
});

router.delete("/deletar/:idTanque", function (req, res) {
    tanqueController.deletar(req, res);
});

module.exports = router;
