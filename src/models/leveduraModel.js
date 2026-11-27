var database = require("../database/config");

function criarLevedura(nome) {
  var sql = `
        INSERT INTO levedura (nome) VALUES
        ("${nome}");
    `;

  return database.executar(sql);
}

async function listarLeveduras() {
  var sql = `
        SELECT id, nome
        FROM levedura
        ORDER BY nome;
    `;

  return database.executar(sql);
}

async function buscarLevedura(leveduraId) {
  var sql = `
        SELECT id, nome
        FROM levedura
        WHERE id = ${leveduraId};
    `;

  return database.executar(sql);
}

async function atualizarLevedura(leveduraId, nome) {
  var sql = `
        UPDATE levedura SET nome = "${nome}"
        WHERE id = ${leveduraId};
    `;

  return database.executar(sql);
}

async function deletarLevedura(leveduraId) {
  var sql = `DELETE FROM levedura WHERE id = ${leveduraId};`;

  return database.executar(sql);
}

module.exports = {
  criarLevedura,
  listarLeveduras,
  buscarLevedura,
  atualizarLevedura,
  deletarLevedura,
};
