var cargoModel = require("../models/cargoModel");
var usuarioModel = require("../models/usuarioModel");
var empresaModel = require("../models/empresaModel");

async function criarUsuario(req, res) {
  const data = req.body;

  const nome = data.nome;
  const email = data.email;
  const senha = data.senha;
  const empresaId = data.empresaId;
  const cargoId = data.cargoId;

  if (nome.length < 3)
    return res.status(400).send("O nome precisa ter pelo menos 3 caracteres.");

  if (nome.length > 45)
    return res.status(400).send("O nome pode ter no máximo 45 caracteres.");

  const senhaForte = await senhaValida(senha);

  if (senhaForte == false) return res.status(400).send("A senha é fraca.");

  if (!email.includes("@") || !email.includes("."))
    return res.status(400).send("Email inválido.");

  const emailExiste = await usuarioModel.buscarUsuario(null, email, null);

  if (emailExiste.length > 0)
    return res.status(400).send("Erro ao criar conta.");

  const cargoExite = await cargoModel.buscarCargo(cargoId);

  if (cargoExite == 0) return res.status(404).send("Cargo não encontrado.");

  const empresaExiste = await empresaModel.buscarEmpresa(empresaId);

  if (empresaExiste == 0)
    return res.status(404).send("Empresa não encontrada.");

  usuarioModel
    .criarUsuario(nome, email, senha, cargoId, empresaId)
    .then(function (response) {
      res.status(201).send("Usuário criado com sucesso.");
    })
    .catch(function (erro) {
      console.log(erro);

      res
        .status(500)
        .send("Ocorreu um erro do lado servidor. Tente novamente mais tarde.");
    });
}

async function autenticar(req, res) {
  const data = req.body;
  const email = data.email;
  const senha = data.senha;

  if (email == undefined || senha == undefined)
    return res.status(400).send("Email ou senha undefined.");

  if (!email.includes("@") || !email.includes("."))
    return res.status(400).send("Email inválido.");

  usuarioModel
    .autenticar(email, senha)
    .then(function (response) {
      if (response !== false) {
        console.log(response)
        res.status(200).json(response);
      } else {
        res.status(400).send("Email ou senha inválido.");
      }
    })
    .catch(function (erro) {
      console.log(erro);
      res
        .status(500)
        .send("Ocorreu um erro do lado servidor. Tente novamente mais tarde.");
    });
}

// função para validar a senha referencia https://blog.dbins.com.br/validar-senhas-com-javascript
async function senhaValida(senha) {
  if (senha.length < 8) {
    return false;
  }

  var letrasMaiusculas = /[A-Z]/;
  var letrasMinusculas = /[a-z]/;
  var numeros = /[0-9]/;
  var caracteresEspeciais = /[!@#$%^&*()_+\-=.,;?]/;

  return (
    letrasMaiusculas.test(senha) &&
    letrasMinusculas.test(senha) &&
    numeros.test(senha) &&
    caracteresEspeciais.test(senha)
  );
}

module.exports = {
  criarUsuario,
  autenticar,
};
