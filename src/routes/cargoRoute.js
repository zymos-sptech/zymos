var express = require("express");
var route = express.Router();

var cargoController = require("../controllers/cargoController");

route.post("/", function (req, res) {
  cargoController.criarCargo(req, res);
});

route.get("/", function (req, res) {
  cargoController.listarCargo(req, res);
});

route.get("/:cargoId", function (req, res) {
  cargoController.buscarCargo(req, res);
});

route.put("/:cargoId", function (req, res) {
  cargoController.atualizarCargo(req, res);
});

route.delete("/:cargoId", function (req, res) {
  cargoController.deletarCargo(req, res);
});

module.exports = route;
