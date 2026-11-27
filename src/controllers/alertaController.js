var alertaModel = require("../models/alertaModel");
var loteModel = require("../models/loteModel");

async function listarAlertaEmpresa(req, res) {
  const idEmpresa = req.params.idEmpresa;

  // validar o id da empresa se existe
  alertaModel
    .listarAlertaEmpresa(idEmpresa)
    .then(function (response) {
      res.status(200).json(response);
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).send("Ocorreu um erro do lado servidor.");
    });
}

async function listarAlertaUnidade(req, res) {
  const idUnidade = req.params.idUnidade;
  // validar unidade
  alertaModel
    .listarAlertaUnidade(idUnidade)
    .then(function (response) {
      res.status(200).json(response);
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).send("Ocorreu um erro do lado servidor.");
    });
}

async function listarAlertaLote(req, res) {
  const idLote = req.params.idLote;

  const loteExiste = await loteModel.buscarLote(idLote);

  if (loteExiste.length === 0)
    return res.status(404).send("Lote não encontrado.");

  alertaModel
    .listarAlertaLote(idLote)
    .then(function (response) {
      res.status(200).json(response);
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).send("Ocorreu um erro do lado servidor.");
    });
}

module.exports = {
  listarAlertaEmpresa,
  listarAlertaUnidade,
  listarAlertaLote,
};
