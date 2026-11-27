var express = require("express");
var route = express.Router();

var leveduraController = require("../controllers/leveduraController");

route.post("/", function (req, res) {
  leveduraController.criarLevedura(req, res);
});

route.get("/", function (req, res) {
  leveduraController.listarLeveduras(req, res);
});

route.get("/:leveduraId", function (req, res) {
  leveduraController.buscarLevedura(req, res);
});

route.put("/:leveduraId", function (req, res) {
  leveduraController.atualizarLevedura(req, res);
});

route.delete("/:leveduraId", function (req, res) {
  leveduraController.deletarLevedura(req, res);
});

module.exports = route;
