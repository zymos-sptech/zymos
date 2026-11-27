var producaoModel = require("../models/producaoModel");
var sensorModel = require("../models/sensorModel");

async function criarProducao(req, res) {
  const data = req.body;

  const loteId = data.loteId;
  const sensorId = data.sensorId;
  const tanqueId = data.tanqueId;

  if (loteId == undefined || tanqueId == undefined || sensorId == undefined) {
    return res.status(400).send("Valores undefined.");
  }

  const loteExiste = await producaoModel.buscarLote(loteId);

  if (loteExiste.length <= 0) {
    return res.status(404).send("Lote não encontrado.");
  }

  const sensorExiste = await sensorModel.buscarPorId(sensorId);

  if (sensorExiste.length <= 0) {
    return res.status(404).send("Sensor não encontrado.");
  }

  const tanqueExiste = await producaoModel.buscarTanque(tanqueId);

  if (tanqueExiste.length <= 0) {
    return res.status(404).send("Tanque não encontrado.");
  }

  await producaoModel
    .criarProducao(loteId, tanqueId, sensorId)
    .then(function (response) {
      res.status(201).send("Produção registrada com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);

      if (erro.code == "ER_DUP_ENTRY") {
        return res
          .status(409)
          .send("Esse lote já possui registro de produção nesse tanque.");
      }

      res
        .status(500)
        .send("Erro ao registrar produção. Tente novamente mais tarde.");
    });
}

async function listarProducoes(req, res) {
  await producaoModel
    .listarProducoes()
    .then(function (response) {
      res.status(200).json(response);
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send("Erro ao listar produções. Tente novamente mais tarde.");
    });
}

async function listarProducoesPorLote(req, res) {
  const loteId = req.params.loteId;

  await producaoModel
    .listarProducoesPorLote(loteId)
    .then(function (response) {
      res.status(200).json(response);
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send("Erro ao listar produções do lote. Tente novamente mais tarde.");
    });
}

async function finalizarProducao(req, res) {
  const loteId = req.params.loteId;
  const tanqueId = req.params.tanqueId;
  const dtSaida = req.body.dtSaida;

  const producaoExiste = await producaoModel.buscarProducao(loteId, tanqueId);

  if (producaoExiste.length <= 0) {
    return res.status(404).send("Produção não encontrada.");
  }

  if (producaoExiste[0].dt_saida != null) {
    return res.status(400).send("Essa produção já teve a saída registrada.");
  }

  await producaoModel
    .finalizarProducao(loteId, tanqueId, dtSaida)
    .then(function (response) {
      res.status(200).send("Saída do tanque registrada com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send("Erro ao registrar saída. Tente novamente mais tarde.");
    });
}

async function deletarProducao(req, res) {
  const loteId = req.params.loteId;
  const tanqueId = req.params.tanqueId;

  const producaoExiste = await producaoModel.buscarProducao(loteId, tanqueId);

  if (producaoExiste.length <= 0) {
    return res.status(404).send("Produção não encontrada.");
  }

  await producaoModel
    .deletarProducao(loteId, tanqueId)
    .then(function (response) {
      res.status(200).send("Produção deletada com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send(
          "Ocorreu um erro ao deletar a produção. Tente novamente mais tarde.",
        );
    });
}

module.exports = {
  criarProducao,
  listarProducoes,
  listarProducoesPorLote,
  finalizarProducao,
  deletarProducao,
};
