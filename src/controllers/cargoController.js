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

module.exports = {
  criarCargo,
};
