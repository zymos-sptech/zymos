var express = require("express");
var router = express.Router();
var cervejaController = require("../controllers/cervejaController");

router.get("/empresa/:empresaId", function (req, res) {
  cervejaController.listarCervejaEmpresa(req, res);
});

module.exports = router;
