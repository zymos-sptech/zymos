var cervejaModel = require("../models/cervejaModel");

async function listarCervejaEmpresa(req, res) {
  const empresaId = req.params.empresaId;

  if (empresaId === undefined || empresaId === null)
    return res.status(400).send("Id inválido");

  cervejaModel
    .listarCervejaEmpresa(empresaId)
    .then(function (resultado) {
      console.log(resultado);
      res.status(200).json(resultado);
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).send("Erro interno no servidor.");
    });
}

module.exports = {
  listarCervejaEmpresa,
};
