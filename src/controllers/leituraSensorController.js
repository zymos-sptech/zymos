var leituraSensorModel = require("../models/leituraSensorModel");

const limite_linhas = 100;

function naoENumero(valor) {
  return valor === "" || valor * 1 != valor;
}

function listar(req, res) {
  leituraSensorModel
    .listar(limite_linhas)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado);
      } else {
        res.status(204).send("Nenhum resultado encontrado!");
      }
    })
    .catch(function (erro) {
      console.log(erro);
      console.log("Houve um erro ao buscar as leituras: ", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

function listarPorLote(req, res) {
  var idLote = req.params.idLote;

  if (naoENumero(idLote)) {
    res.status(400).send("O id do lote é inválido!");
  } else {
    leituraSensorModel
      .buscarLote(idLote)
      .then(function (lote) {
        if (lote.length == 0) {
          res.status(404).send("Lote não encontrado!");
        } else {
          return leituraSensorModel
            .listarPorLote(idLote, limite_linhas)
            .then(function (resultado) {
              if (resultado.length > 0) {
                res.status(200).json(resultado);
              } else {
                res.status(204).send("Nenhum resultado encontrado!");
              }
            });
        }
      })
      .catch(function (erro) {
        console.log(erro);
        console.log(
          "Houve um erro ao buscar as leituras do lote: ",
          erro.sqlMessage,
        );
        res.status(500).json(erro.sqlMessage);
      });
  }
}

async function historico(req, res) {
  const idLote = req.params.idLote;

  const loteExiste = await leituraSensorModel.buscarLote(idLote);
  console.log(loteExiste, "lote existe");
  if (loteExiste.length == 0)
    return res.status(404).send("Lote não encontrado");

  leituraSensorModel
    .historico(idLote)
    .then(function (response) {
      res.status(200).json(response[0]);
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).send("Erro no servidor");
    });
}

module.exports = {
  listar,
  listarPorLote,
  historico,
};
