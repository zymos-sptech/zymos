var express = require("express");
var router = express.Router();

var leituraSensorController = require("../controllers/leituraSensorController");


router.post("/cadastrar", function (req, res) {
  leituraSensorController.cadastrar(req, res);
});

router.get("/listar", function (req, res) {
  leituraSensorController.listar(req, res);
});

router.get("/buscar/:idLeitura", function (req, res) {
  leituraSensorController.buscarPorId(req, res);
});

router.get("/sensor/:idSensor", function (req, res) {
  leituraSensorController.listarPorSensor(req, res);
});

router.get("/ultima/:idSensor", function (req, res) {
  leituraSensorController.buscarUltimaPorSensor(req, res);
});

router.get("/tanque/:idTanque", function (req, res) {
  leituraSensorController.listarPorTanque(req, res);
});

router.get("/lote/:idLote", function (req, res) {
  leituraSensorController.listarPorLote(req, res);
});

module.exports = router;
