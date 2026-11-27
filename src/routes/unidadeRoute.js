var express = require("express");
var router = express.Router();

var unidadeController = require("../controllers/unidadeController");

router.get("/empresa/:empresaId", function (req, res) {
  unidadeController.listarUnidadeEmpresa(req, res);
});

module.exports = router;
