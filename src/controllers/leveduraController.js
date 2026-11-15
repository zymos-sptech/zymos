var leveduraModel = require("../models/leveduraModel");

async function criarLevedura(req, res) {
  const nome = req.body.nome;

  if (nome == undefined) {
    return res.status(400).send("Valores undefined.");
  }

  if (nome.length > 100) {
    return res.status(400).send("Nome deve ter no máximo 100 caracteres.");
  }

  await leveduraModel
    .criarLevedura(nome)
    .then(function () {
      res.status(201).send("Levedura criada com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send("Erro ao criar levedura. Tente novamente mais tarde.");
    });
}

async function listarLeveduras(req, res) {
  await leveduraModel
    .listarLeveduras()
    .then(function (response) {
      res.status(200).json(response);
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send("Erro ao listar leveduras. Tente novamente mais tarde.");
    });
}

async function buscarLevedura(req, res) {
  const leveduraId = req.params.leveduraId;

  await leveduraModel
    .buscarLevedura(leveduraId)
    .then(function (response) {
      if (response.length <= 0) {
        return res.status(404).send("Levedura não encontrada.");
      }

      res.status(200).json(response[0]);
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send("Erro ao buscar levedura. Tente novamente mais tarde.");
    });
}

async function atualizarLevedura(req, res) {
  const leveduraId = req.params.leveduraId;
  const nome = req.body.nome;

  if (nome == undefined) {
    return res.status(400).send("Valores undefined.");
  }

  if (nome.length > 100) {
    return res.status(400).send("Nome deve ter no máximo 100 caracteres.");
  }

  const leveduraExiste = await leveduraModel.buscarLevedura(leveduraId);

  if (leveduraExiste.length <= 0) {
    return res.status(404).send("Levedura não encontrada.");
  }

  await leveduraModel
    .atualizarLevedura(leveduraId, nome)
    .then(function () {
      res.status(200).send("Levedura atualizada com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send(
          "Ocorreu um erro ao atualizar levedura. Tente novamente mais tarde.",
        );
    });
}

async function deletarLevedura(req, res) {
  const leveduraId = req.params.leveduraId;

  const leveduraExiste = await leveduraModel.buscarLevedura(leveduraId);

  if (leveduraExiste.length <= 0) {
    return res.status(404).send("Levedura não encontrada.");
  }

  await leveduraModel
    .deletarLevedura(leveduraId)
    .then(function () {
      res.status(200).send("Levedura deletada com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);

      if (erro.code == "ER_ROW_IS_REFERENCED_2") {
        return res
          .status(409)
          .send(
            "Levedura está em uso por alguma cerveja e não pode ser deletada.",
          );
      }

      res
        .status(500)
        .send(
          "Ocorreu um erro ao deletar levedura. Tente novamente mais tarde.",
        );
    });
}

module.exports = {
  criarLevedura,
  listarLeveduras,
  buscarLevedura,
  atualizarLevedura,
  deletarLevedura,
};
