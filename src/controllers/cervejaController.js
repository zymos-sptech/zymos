var cervejaModel = require("../models/cervejaModel");

async function criarCerveja(req, res) {
  const data = req.body;

  const nome = data.nome;
  const fkTipoCerveja = data.fkTipoCerveja;
  const fkLevedura = data.fkLevedura;
  const temperaturaMin = data.temperaturaMin;
  const temperaturaMax = data.temperaturaMax;
  const tempoFermentacaoDias = data.tempoFermentacaoDias;

  if (
    nome == undefined ||
    fkTipoCerveja == undefined ||
    fkLevedura == undefined ||
    temperaturaMin == undefined ||
    temperaturaMax == undefined ||
    tempoFermentacaoDias == undefined
  ) {
    return res.status(400).send("Valores undefined.");
  }

  if (nome.length > 50) {
    return res.status(400).send("Nome deve ter no máximo 50 caracteres.");
  }

  if (temperaturaMin >= temperaturaMax) {
    return res
      .status(400)
      .send("Temperatura mínima deve ser menor que a temperatura máxima.");
  }

  if (tempoFermentacaoDias <= 0) {
    return res
      .status(400)
      .send("Tempo de fermentação deve ser maior que zero.");
  }

  await cervejaModel
    .criarCerveja(
      nome,
      fkTipoCerveja,
      fkLevedura,
      temperaturaMin,
      temperaturaMax,
      tempoFermentacaoDias,
    )
    .then(function () {
      res.status(201).send("Cerveja criada com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);

      // tipo de cerveja ou levedura não existe (FK)
      if (erro.code == "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).send("Tipo de cerveja ou levedura não existe.");
      }

      res
        .status(500)
        .send("Erro ao criar cerveja. Tente novamente mais tarde.");
    });
}

async function listarCervejas(req, res) {
  await cervejaModel
    .listarCervejas()
    .then(function (response) {
      res.status(200).json(response);
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send("Erro ao listar cervejas. Tente novamente mais tarde.");
    });
}

async function buscarCerveja(req, res) {
  const cervejaId = req.params.cervejaId;

  await cervejaModel
    .buscarCerveja(cervejaId)
    .then(function (response) {
      if (response.length <= 0) {
        return res.status(404).send("Cerveja não encontrada.");
      }

      res.status(200).json(response[0]);
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send("Erro ao buscar cerveja. Tente novamente mais tarde.");
    });
}

async function atualizarCerveja(req, res) {
  const cervejaId = req.params.cervejaId;
  const data = req.body;

  const nome = data.nome;
  const fkTipoCerveja = data.fkTipoCerveja;
  const fkLevedura = data.fkLevedura;
  const temperaturaMin = data.temperaturaMin;
  const temperaturaMax = data.temperaturaMax;
  const tempoFermentacaoDias = data.tempoFermentacaoDias;

  if (
    nome == undefined ||
    fkTipoCerveja == undefined ||
    fkLevedura == undefined ||
    temperaturaMin == undefined ||
    temperaturaMax == undefined ||
    tempoFermentacaoDias == undefined
  ) {
    return res.status(400).send("Valores undefined.");
  }

  if (nome.length > 50) {
    return res.status(400).send("Nome deve ter no máximo 50 caracteres.");
  }

  if (temperaturaMin >= temperaturaMax) {
    return res
      .status(400)
      .send("Temperatura mínima deve ser menor que a temperatura máxima.");
  }

  if (tempoFermentacaoDias <= 0) {
    return res
      .status(400)
      .send("Tempo de fermentação deve ser maior que zero.");
  }

  const cervejaExiste = await cervejaModel.buscarCerveja(cervejaId);

  if (cervejaExiste.length <= 0) {
    return res.status(404).send("Cerveja não encontrada.");
  }

  await cervejaModel
    .atualizarCerveja(
      cervejaId,
      nome,
      fkTipoCerveja,
      fkLevedura,
      temperaturaMin,
      temperaturaMax,
      tempoFermentacaoDias,
    )
    .then(function () {
      res.status(200).send("Cerveja atualizada com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);

      if (erro.code == "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).send("Tipo de cerveja ou levedura não existe.");
      }

      res
        .status(500)
        .send(
          "Ocorreu um erro ao atualizar cerveja. Tente novamente mais tarde.",
        );
    });
}

async function deletarCerveja(req, res) {
  const cervejaId = req.params.cervejaId;

  const cervejaExiste = await cervejaModel.buscarCerveja(cervejaId);

  if (cervejaExiste.length <= 0) {
    return res.status(404).send("Cerveja não encontrada.");
  }

  await cervejaModel
    .deletarCerveja(cervejaId)
    .then(function () {
      res.status(200).send("Cerveja deletada com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);

      // algum lote ainda usa essa cerveja (FK)
      if (erro.code == "ER_ROW_IS_REFERENCED_2") {
        return res
          .status(409)
          .send("Cerveja está em uso por algum lote e não pode ser deletada.");
      }

      res
        .status(500)
        .send(
          "Ocorreu um erro ao deletar cerveja. Tente novamente mais tarde.",
        );
    });
}

module.exports = {
  criarCerveja,
  listarCervejas,
  buscarCerveja,
  atualizarCerveja,
  deletarCerveja,
};
