var express = require("express");
var router = express.Router();

var alertaController = require("../controllers/alertaController");

router.get("/empresa/:idEmpresa", function (req, res) {
  alertaController.listarAlertaEmpresa(req, res);
});

router.get("/unidade/:idUnidade", function (req, res) {
  alertaController.listarAlertaUnidade(req, res);
});

router.get("/lote/:idLote", function (req, res) {
  alertaController.listarAlertaLote(req, res);
});

module.exports = router;
