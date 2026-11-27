var express = require("express");
var route = express.Router();

var tipoCervejaController = require("../controllers/tipoCervejaController");

route.post("/", function (req, res) {
  tipoCervejaController.criarTipoCerveja(req, res);
});

route.get("/", function (req, res) {
  tipoCervejaController.listarTiposCerveja(req, res);
});

route.get("/:tipoCervejaId", function (req, res) {
  tipoCervejaController.buscarTipoCerveja(req, res);
});

route.put("/:tipoCervejaId", function (req, res) {
  tipoCervejaController.atualizarTipoCerveja(req, res);
});

route.delete("/:tipoCervejaId", function (req, res) {
  tipoCervejaController.deletarTipoCerveja(req, res);
});

module.exports = route;
