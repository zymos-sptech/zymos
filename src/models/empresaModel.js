var database = require("../database/config");

async function buscarEmpresa(empresaId) {
  var sql = `SELECT id FROM empresa WHERE id = ${empresaId};`;

  return database.executar(sql);
}

module.exports = {
  buscarEmpresa,
};
