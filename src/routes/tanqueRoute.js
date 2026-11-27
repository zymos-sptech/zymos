var express = require("express");
var router = express.Router();

var tanqueController = require("../controllers/tanqueController");

router.post("/", function (req, res) {
  tanqueController.cadastrar(req, res);
});

router.get("/empresa/:empresaId", function (req, res) {
  tanqueController.listarTanqueEmpresa(req, res);
});

router.get("/:idUnidade", function (req, res) {
  tanqueController.listarPorUnidade(req, res);
});

router.get("/:idUnidade/:idTanque", function (req, res) {
  tanqueController.listarPorTanque(req, res);
});

router.put("/:idTanque", function (req, res) {
  tanqueController.editar(req, res);
});

router.delete("/:idTanque", function (req, res) {
  tanqueController.deletar(req, res);
});

module.exports = router;
