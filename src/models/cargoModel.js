var database = require("../database/config");

async function criarCargo(nome, permissao) {
  var sql = `
    INSERT INTO cargo (nome, permisionamento) VALUES
    ('${nome}', ${permissao});
    `;

  return database.executar(sql);
}

module.exports = {
  criarCargo,
};
