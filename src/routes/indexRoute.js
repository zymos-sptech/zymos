var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  res.render("Bem vindo ao servidor Zymos.");
});

module.exports = router;
