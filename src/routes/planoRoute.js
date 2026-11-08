var express = require("express");
var route = express.Router();

var planoController = require("../controllers/planoController");

route.post("/", function (req, res) {
  planoController.criarPlano(req, res);
});

route.get("/", function (req, res) {
  planoController.listarPlanos(req, res);
});

route.delete("/:planoId", function (req, res) {
  planoController.deletarPlano(req, res);
});

module.exports = route;
