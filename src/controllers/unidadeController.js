var unidadeModel = require("../models/unidadeModel");

async function listarUnidadeEmpresa(req, res) {
  const empresaId = req.params.empresaId;
  if (empresaId == undefined) {
    return res.status(400).send("Empresa inválida");
  }
  unidadeModel
    .listarUnidadeEmpresa(empresaId)
    .then(function (response) {
      console.log(response);
      if (response.length > 0) {
        res.status(200).json(response);
      } else {
        res.status(204).send("Nenhuma unidade encontrada");
      }
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).send("Erro interno");
    });
}

module.exports = {
  listarUnidadeEmpresa,
};
