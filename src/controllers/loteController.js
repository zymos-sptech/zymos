var loteModel = require("../models/loteModel");

async function criarLote(req, res) {
  const data = req.body;

  const codigo = data.codigo;
  const volumeLitros = data.volumeLitros;
  const fkCerveja = data.fkCerveja;
  const fkUsuarioCriador = data.fkUsuarioCriador;

  if (
    codigo == undefined ||
    volumeLitros == undefined ||
    fkCerveja == undefined ||
    fkUsuarioCriador == undefined
  ) {
    return res.status(400).send("Valores undefined.");
  }

  if (volumeLitros <= 0) {
    return res.status(400).send("Volume do lote deve ser maior que zero.");
  }

  await loteModel
    .criarLote(codigo, volumeLitros, fkCerveja, fkUsuarioCriador)
    .then(function (response) {
      res.status(201).send("Lote criado com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);

      if (erro.code == "ER_DUP_ENTRY") {
        return res.status(409).send("Já existe um lote com esse código.");
      }

      if (erro.code == "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).send("Cerveja ou usuário criador não existe.");
      }

      res.status(500).send("Erro ao criar lote. Tente novamente mais tarde.");
    });
}

async function listarLotes(req, res) {
  await loteModel
    .listarLotes()
    .then(function (response) {
      res.status(200).json(response);
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).send("Erro ao listar lotes. Tente novamente mais tarde.");
    });
}

async function buscarLote(req, res) {
  const loteId = req.params.loteId;

  await loteModel
    .buscarLote(loteId)
    .then(function (response) {
      if (response.length <= 0) {
        return res.status(404).send("Lote não encontrado.");
      }

      res.status(200).json(response[0]);
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).send("Erro ao buscar lote. Tente novamente mais tarde.");
    });
}

async function atualizarLote(req, res) {
  const loteId = req.params.loteId;
  const data = req.body;

  const codigo = data.codigo;
  const volumeLitros = data.volumeLitros;
  const fkCerveja = data.fkCerveja;
  const fkStatusLote = data.fkStatusLote;

  if (
    codigo == undefined ||
    volumeLitros == undefined ||
    fkCerveja == undefined ||
    fkStatusLote == undefined
  ) {
    return res.status(400).send("Valores undefined.");
  }

  if (volumeLitros <= 0) {
    return res.status(400).send("Volume do lote deve ser maior que zero.");
  }

  const loteExiste = await loteModel.buscarLote(loteId);

  if (loteExiste.length <= 0) {
    return res.status(404).send("Lote não encontrado.");
  }

  await loteModel
    .atualizarLote(loteId, codigo, volumeLitros, fkCerveja, fkStatusLote)
    .then(function (response) {
      res.status(200).send("Lote atualizado com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);

      if (erro.code == "ER_DUP_ENTRY") {
        return res.status(409).send("Já existe um lote com esse código.");
      }

      res
        .status(500)
        .send("Ocorreu um erro ao atualizar lote. Tente novamente mais tarde.");
    });
}

async function finalizarLote(req, res) {
  const loteId = req.params.loteId;

  const loteExiste = await loteModel.buscarLote(loteId);

  if (loteExiste.length <= 0) {
    return res.status(404).send("Lote não encontrado.");
  }

  if (loteExiste[0].fk_status_lote == 2) {
    return res.status(400).send("Lote já está finalizado.");
  }

  await loteModel
    .finalizarLote(loteId)
    .then(function (response) {
      res.status(200).send("Lote finalizado com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send("Ocorreu um erro ao finalizar lote. Tente novamente mais tarde.");
    });
}

async function deletarLote(req, res) {
  const loteId = req.params.loteId;

  const loteExiste = await loteModel.buscarLote(loteId);

  if (loteExiste.length <= 0) {
    return res.status(404).send("Lote não encontrado.");
  }

  const producoes = await loteModel.contarProducoesDoLote(loteId);

  if (producoes[0].total > 0) {
    return res
      .status(409)
      .send(
        "Lote possui registros de produção e não pode ser deletado. Finalize ou cancele o lote.",
      );
  }

  await loteModel
    .deletarLote(loteId)
    .then(function (response) {
      res.status(200).send("Lote deletado com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send("Ocorreu um erro ao deletar o lote. Tente novamente mais tarde.");
    });
}

module.exports = {
  criarLote,
  listarLotes,
  buscarLote,
  atualizarLote,
  finalizarLote,
  deletarLote,
};
