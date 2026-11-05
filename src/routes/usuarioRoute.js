var express = require("express");
var route = express.Router();

var usuarioController = require("../controllers/usuarioController");

route.get("/", function (req, res) {
  usuarioController.listarUsuarios(req, res);
});
