var express = require("express");
var router = express.Router();

router.post("/", function (req, res) {});

router.get("/empresa/:idEmpresa", function (req, res) {});

router.get("/unidade/:idUnidade", function (req, res) {});

router.get("/lote/:idLote", function (req, res) {});

router.patch("/:idAlerta/resolver", function (req, res) {});

module.exports = router;
