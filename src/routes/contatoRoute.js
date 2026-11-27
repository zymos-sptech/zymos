var express = require("express");
var route = express.Router();

var contatoController = require("../controllers/contatoController");

route.post("/", function (req, res) {
  contatoController.criarContato(req, res);
});

module.exports = route;
