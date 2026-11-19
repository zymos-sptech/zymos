var express = require("express");
var route = express.Router();

var producaoController = require("../controllers/producaoController");

route.post("/", function (req, res) {
  producaoController.criarProducao(req, res);
});

route.get("/", function (req, res) {
  producaoController.listarProducoes(req, res);
});

route.get("/lote/:loteId", function (req, res) {
  producaoController.listarProducoesPorLote(req, res);
});

route.patch("/:loteId/:tanqueId/saida", function (req, res) {
  producaoController.finalizarProducao(req, res);
});

route.delete("/:loteId/:tanqueId", function (req, res) {
  producaoController.deletarProducao(req, res);
});

module.exports = route;
