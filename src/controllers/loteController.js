var loteModel = require("../models/loteModel");

function naoENumero(valor) {
  return valor === "" || valor * 1 != valor;
}

async function criarLote(req, res) {
  const data = req.body;

  const codigo = data.codigo;
  const volumeLitros = data.volumeLitros;
  const fkCerveja = data.fkCerveja;
  const fkUnidade = data.fkUnidade;
  const fkUsuarioCriador = data.fkUsuarioCriador;

  if (
    codigo == undefined ||
    volumeLitros == undefined ||
    fkCerveja == undefined ||
    fkUnidade == undefined ||
    fkUsuarioCriador == undefined
  ) {
    return res.status(400).send("Valores undefined.");
  }

  if (String(codigo).trim().length === 0 || String(codigo).trim().length > 20) {
    return res
      .status(400)
      .send("O código do lote deve ter entre 1 e 20 caracteres.");
  }

  if (naoENumero(volumeLitros) || volumeLitros <= 0) {
    return res.status(400).send("Volume do lote deve ser maior que zero.");
  }

  await loteModel
    .criarLote(codigo, volumeLitros, fkCerveja, fkUnidade, fkUsuarioCriador)
    .then(function (response) {
      res.status(201).json({
        mensagem: "Lote criado com sucesso.",
        idLote: response.insertId,
      });
    })
    .catch(function (erro) {
      console.log(erro);

      if (erro.code == "ER_DUP_ENTRY") {
        return res.status(409).send("Já existe um lote com esse código.");
      }

      if (erro.code == "ER_NO_REFERENCED_ROW_2") {
        return res
          .status(400)
          .send("Cerveja, unidade ou usuário criador não existe.");
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

async function listarLotesPorEmpresa(req, res) {
  const idEmpresa = req.params.idEmpresa;

  if (naoENumero(idEmpresa)) {
    return res.status(400).send("O id da empresa é inválido.");
  }

  await loteModel
    .listarLotesPorEmpresa(idEmpresa)
    .then(function (response) {
      res.status(200).json(response);
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send("Erro ao listar lotes da empresa. Tente novamente mais tarde.");
    });
}

async function listarLotesPorUnidade(req, res) {
  const idUnidade = req.params.idUnidade;

  if (naoENumero(idUnidade)) {
    return res.status(400).send("O id da unidade é inválido.");
  }

  await loteModel
    .listarLotesPorUnidade(idUnidade)
    .then(function (response) {
      res.status(200).json(response);
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send("Erro ao listar lotes da unidade. Tente novamente mais tarde.");
    });
}

async function buscarLote(req, res) {
  const loteId = req.params.loteId;

  if (naoENumero(loteId)) {
    return res.status(400).send("O id do lote é inválido.");
  }

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

  if (naoENumero(loteId)) {
    return res.status(400).send("O id do lote é inválido.");
  }

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

  if (naoENumero(volumeLitros) || volumeLitros <= 0) {
    return res.status(400).send("Volume do lote deve ser maior que zero.");
  }

  const loteExiste = await loteModel.buscarLote(loteId);

  if (loteExiste.length <= 0) {
    return res.status(404).send("Lote não encontrado.");
  }

  const fkUnidade =
    data.fkUnidade != undefined ? data.fkUnidade : loteExiste[0].fk_unidade;

  await loteModel
    .atualizarLote(
      loteId,
      codigo,
      volumeLitros,
      fkCerveja,
      fkUnidade,
      fkStatusLote,
    )
    .then(function (response) {
      res.status(200).send("Lote atualizado com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);

      if (erro.code == "ER_DUP_ENTRY") {
        return res.status(409).send("Já existe um lote com esse código.");
      }

      if (erro.code == "ER_NO_REFERENCED_ROW_2") {
        return res
          .status(400)
          .send("Cerveja, unidade ou status do lote inválido.");
      }

      res
        .status(500)
        .send("Ocorreu um erro ao atualizar lote. Tente novamente mais tarde.");
    });
}

async function finalizarLote(req, res) {
  const loteId = req.params.loteId;

  if (naoENumero(loteId)) {
    return res.status(400).send("O id do lote é inválido.");
  }

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

async function cancelarLote(req, res) {
  const loteId = req.params.loteId;

  if (naoENumero(loteId)) {
    return res.status(400).send("O id do lote é inválido.");
  }

  const loteExiste = await loteModel.buscarLote(loteId);

  if (loteExiste.length <= 0) {
    return res.status(404).send("Lote não encontrado.");
  }

  if (loteExiste[0].fk_status_lote == 3) {
    return res.status(400).send("Lote já está cancelado.");
  }

  await loteModel
    .cancelarLote(loteId)
    .then(function (response) {
      res.status(200).send("Lote cancelado com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send("Ocorreu um erro ao cancelar lote. Tente novamente mais tarde.");
    });
}

async function deletarLote(req, res) {
  const loteId = req.params.loteId;

  if (naoENumero(loteId)) {
    return res.status(400).send("O id do lote é inválido.");
  }

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
  listarLotesPorEmpresa,
  listarLotesPorUnidade,
  buscarLote,
  atualizarLote,
  finalizarLote,
  cancelarLote,
  deletarLote,
};
