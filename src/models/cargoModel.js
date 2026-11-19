var database = require("../database/config");

async function criarCargo(nome, permissao) {
  var sql = `
    INSERT INTO cargo (nome, permisionamento) VALUES
    ('${nome}', ${permissao});
    `;

  return database.executar(sql);
}

async function listarCargo() {
  var sql = `SELECT id, nome, permisionamento FROM cargo;`;

  return database.executar(sql);
}

async function buscarCargo(cargoId) {
  var sql = `
  SELECT id FROM cargo WHERE id = ${cargoId};
  `;

  return database.executar(sql);
}

async function atualizarCargo(cargoId, nome, permisionamento) {
  var sql = `
    UPDATE cargo SET nome = '${nome}', permisionamento = ${permisionamento} WHERE id = ${cargoId};
  `;

  return database.executar(sql);
}

async function deletarCargo(cargoId) {
  var sql = `DELETE FROM cargo WHERE id = ${cargoId}`;

  return database.executar(sql);
}

module.exports = {
  criarCargo,
  buscarCargo,
  listarCargo,
  atualizarCargo,
  deletarCargo,
};
