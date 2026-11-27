var express = require("express");
var router = express.Router();

var sensorController = require("../controllers/sensorController");

router.post("/cadastrar", function (req, res) {
    sensorController.cadastrar(req, res);
});

router.get("/listar/:idUnidade", function (req, res) {
    sensorController.listarPorUnidade(req, res);
});

router.get("/empresa/:idEmpresa", function (req, res) {
    sensorController.listarPorEmpresa(req, res);
});

router.patch("/status/:idSensor", function (req, res) {
    sensorController.alterarStatus(req, res);
});

router.delete("/deletar/:idSensor", function (req, res) {
    sensorController.deletar(req, res);
});

module.exports = router;
