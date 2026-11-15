var express = require("express");
var route = express.Router();

var cervejaController = require("../controllers/cervejaController");

route.post("/", function (req, res) {
  cervejaController.criarCerveja(req, res);
});

route.get("/", function (req, res) {
  cervejaController.listarCervejas(req, res);
});

route.get("/:cervejaId", function (req, res) {
  cervejaController.buscarCerveja(req, res);
});

route.put("/:cervejaId", function (req, res) {
  cervejaController.atualizarCerveja(req, res);
});

route.delete("/:cervejaId", function (req, res) {
  cervejaController.deletarCerveja(req, res);
});

module.exports = route;
