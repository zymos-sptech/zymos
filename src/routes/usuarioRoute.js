var express = require("express");
var route = express.Router();

var usuarioController = require("../controllers/usuarioController");

route.post("/cadastrar", function (req, res) {
  usuarioController.criarUsuario(req, res);
});

route.post("/autenticar", function (req, res) {
  usuarioController.autenticar(req, res);
});

route.put("/:usuarioId", function (req, res) {
  usuarioController.atualizarUsuario(req, res);
});

module.exports = route;
