var planoModel = require("../models/planoModel");

async function criarPlano(req, res) {
  const data = req.body;

  const nome = data.nome;
  const tanquesMin = data.tanquesMin;
  const tanquesMax = data.tanquesMax;
  const valorSetup = data.valorSetup;
  const valorMensalTanque = data.valorMensalTanque;

  if (
    nome == undefined ||
    tanquesMin == undefined ||
    tanquesMax == undefined ||
    valorSetup == undefined ||
    valorMensalTanque == undefined
  ) {
    return res.status(400).send("Valores undefined.");
  }

  await planoModel
    .criarPlano(nome, tanquesMin, tanquesMax, valorSetup, valorMensalTanque)
    .then(function (response) {
      console.log(response);
      res.status(201).send("Plano criado com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).send("Erro ao criar planos. Tente novamente mais tarde.");
    });
}

async function listarPlanos(req, res) {
  await planoModel.listarPlanos().then(function (response) {
    if (response.length > 0) {
      console.log(response);

      res.status(200).json(response);
    }
  });
}

async function deletarPlano(req, res) {
  const planoId = req.params.planoId;

  const planoExiste = await planoModel.buscarPlano(planoId);

  if (planoExiste.length <= 0) {
    return res.status(404).send("Plano não encontrado.");
  }
  
  await planoModel
    .deletarPlano(planoExiste[0].id)
    .then(function (response) {
      console.log(response);
      res.status(200).send("Plano deletado com sucesso.");
    })
    .catch(function (erro) {
      res
        .status(500)
        .send(
          "Ocorreu um erro ao deletar o plano. Tente novamente  mais tarde.",
        );
    });
}

module.exports = {
  criarPlano,
  listarPlanos,
  deletarPlano,
};
