var express = require("express");
var router = express.Router();

var leituraSensorController = require("../controllers/leituraSensorController");

router.get("/listar", function (req, res) {
  leituraSensorController.listar(req, res);
});

router.get("/lote/:idLote", function (req, res) {
  leituraSensorController.listarPorLote(req, res);
});

router.get("/lote/:idLote/historico", function (req, res) {
  leituraSensorController.historico(req, res);
});

module.exports = router;
