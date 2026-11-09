var express = require("express");
var route = express.Router();

var cargoController = require("../controllers/cargoController");

route.post("/", function (req, res) {
  cargoController.criarCargo(req, res);
});

module.exports = route;
