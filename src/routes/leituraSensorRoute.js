var express = require("express");
var router = express.Router();

var leituraSensorController = require("../controllers/leituraSensorController");


router.post("/cadastrar", function (req, res) {
  leituraSensorController.cadastrar(req, res);
});

router.get("/listar", function (req, res) {
  leituraSensorController.listar(req, res);
});

router.get("/lote/:idLote", function (req, res) {
  leituraSensorController.listarPorLote(req, res);
});

module.exports = router;
