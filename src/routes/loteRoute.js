var express = require("express");
var route = express.Router();

var loteController = require("../controllers/loteController");

route.post("/", function (req, res) {
  loteController.criarLote(req, res);
});

route.get("/", function (req, res) {
  loteController.listarLotes(req, res);
});

route.get("/empresa/:idEmpresa", function (req, res) {
  loteController.listarLotesPorEmpresa(req, res);
});

route.get("/unidade/:idUnidade", function (req, res) {
  loteController.listarLotesPorUnidade(req, res);
});

route.get("/:loteId", function (req, res) {
  loteController.buscarLote(req, res);
});

route.put("/:loteId", function (req, res) {
  loteController.atualizarLote(req, res);
});

route.patch("/:loteId/finalizar", function (req, res) {
  loteController.finalizarLote(req, res);
});

route.patch("/:loteId/cancelar", function (req, res) {
  loteController.cancelarLote(req, res);
});

route.delete("/:loteId", function (req, res) {
  loteController.deletarLote(req, res);
});

module.exports = route;
