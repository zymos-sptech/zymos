var tipoCervejaModel = require("../models/tipoCervejaModel");

async function criarTipoCerveja(req, res) {
  const tipo = req.body.tipo;

  if (tipo == undefined) {
    return res.status(400).send("Valores undefined.");
  }

  if (tipo.length > 20) {
    return res.status(400).send("Tipo deve ter no máximo 20 caracteres.");
  }

  await tipoCervejaModel
    .criarTipoCerveja(tipo)
    .then(function () {
      res.status(201).send("Tipo de cerveja criado com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send("Erro ao criar tipo de cerveja. Tente novamente mais tarde.");
    });
}

async function listarTiposCerveja(req, res) {
  await tipoCervejaModel
    .listarTiposCerveja()
    .then(function (response) {
      res.status(200).json(response);
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send("Erro ao listar tipos de cerveja. Tente novamente mais tarde.");
    });
}

async function buscarTipoCerveja(req, res) {
  const tipoCervejaId = req.params.tipoCervejaId;

  await tipoCervejaModel
    .buscarTipoCerveja(tipoCervejaId)
    .then(function (response) {
      if (response.length <= 0) {
        return res.status(404).send("Tipo de cerveja não encontrado.");
      }

      res.status(200).json(response[0]);
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send("Erro ao buscar tipo de cerveja. Tente novamente mais tarde.");
    });
}

async function atualizarTipoCerveja(req, res) {
  const tipoCervejaId = req.params.tipoCervejaId;
  const tipo = req.body.tipo;

  if (tipo == undefined) {
    return res.status(400).send("Valores undefined.");
  }

  if (tipo.length > 20) {
    return res.status(400).send("Tipo deve ter no máximo 20 caracteres.");
  }

  const tipoExiste = await tipoCervejaModel.buscarTipoCerveja(tipoCervejaId);

  if (tipoExiste.length <= 0) {
    return res.status(404).send("Tipo de cerveja não encontrado.");
  }

  await tipoCervejaModel
    .atualizarTipoCerveja(tipoCervejaId, tipo)
    .then(function () {
      res.status(200).send("Tipo de cerveja atualizado com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send(
          "Ocorreu um erro ao atualizar tipo de cerveja. Tente novamente mais tarde.",
        );
    });
}

async function deletarTipoCerveja(req, res) {
  const tipoCervejaId = req.params.tipoCervejaId;

  const tipoExiste = await tipoCervejaModel.buscarTipoCerveja(tipoCervejaId);

  if (tipoExiste.length <= 0) {
    return res.status(404).send("Tipo de cerveja não encontrado.");
  }

  await tipoCervejaModel
    .deletarTipoCerveja(tipoCervejaId)
    .then(function () {
      res.status(200).send("Tipo de cerveja deletado com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);

      if (erro.code == "ER_ROW_IS_REFERENCED_2") {
        return res
          .status(409)
          .send(
            "Tipo de cerveja está em uso por alguma cerveja e não pode ser deletado.",
          );
      }

      res
        .status(500)
        .send(
          "Ocorreu um erro ao deletar tipo de cerveja. Tente novamente mais tarde.",
        );
    });
}

module.exports = {
  criarTipoCerveja,
  listarTiposCerveja,
  buscarTipoCerveja,
  atualizarTipoCerveja,
  deletarTipoCerveja,
};
