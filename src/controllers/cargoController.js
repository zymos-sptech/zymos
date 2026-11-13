var cargoModel = require("../models/cargoModel");

async function criarCargo(req, res) {
  const nome = req.body.nome;
  const permissao = req.body.permissao;

  if (nome == undefined || nome == null) {
    return res.status(400).send("O nome não pode ser undefined ou null.");
  }

  if (nome.length < 3 || nome.length > 15) {
    return res
      .status(400)
      .send("O cargo não pode ter menos de 3 ou mais de 15 caracteres.");
  }

  if (permissao == undefined || permissao == null) {
    return res.status(400).send("O nível de permissão não pode ser null.");
  }

  await cargoModel
    .criarCargo(nome, permissao)
    .then(function (response) {
      console.log(response);

      res.status(200).send("Cargo criado com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);

      res
        .status(500)
        .send("Erro ao tentar criar cargo. Tente novamente mais tarde.");
    });
}

async function listarCargo(req, res) {
  await cargoModel.listarCargo().then(function (response) {
    console.log(response);
    res.status(200).json(response);
  });
}

async function buscarCargo(req, res) {
  const cargoId = req.params.cargoId;

  if (cargoId == null || cargoId == undefined)
    return res.status(400).send("cargoId inválido.");

  cargoModel
    .buscarCargo(cargoId)
    .then(function (response) {
      res.status(200).json(response);
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(404).send("Cargo não encontrado.");
    });
}

async function atualizarCargo(req, res) {
  const data = req.body;
  const cargoId = req.params.cargoId;
  const nome = data.nome;
  const permissao = data.permissao;

  if (nome == undefined || nome == null) {
    return res.status(400).send("O nome não pode ser undefined ou null.");
  }

  if (nome.length < 3 || nome.length > 15) {
    return res
      .status(400)
      .send("O cargo não pode ter menos de 3 ou mais de 15 caracteres.");
  }

  if (permissao == undefined || permissao == null) {
    return res.status(400).send("O nível de permissão não pode ser null.");
  }

  await cargoModel
    .atualizarCargo(cargoId, nome, permissao)
    .then(function (response) {
      if (response.affectedRows > 0) {
        res.status(200).send("Cargo atualizado com sucesso.");
      } else {
        res.status(400).send("Erro ao atualizar cargo.");
      }
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send("Ocorreu um erro na parte servidor. Tente novamente mais tarde.");
    });
}

async function deletarCargo(req, res) {
  const cargoId = req.params.cargoId;

  const cargoExiste = await cargoModel.buscarCargo(cargoId);
  console.log(cargoExiste, "cargo existe");
  if (cargoExiste == 0) {
    return res.status(404).send("Cargo não encontrado.");
  }

  await cargoModel
    .deletarCargo(cargoId)
    .then(function () {
      res.status(200).send("Cargo deletado com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send("Erro ao deletar cargo. Tente novamente mais tarde.");
    });
}

module.exports = {
  criarCargo,
  listarCargo,
  atualizarCargo,
  deletarCargo,
};
