var database = require("../database/config");

function criarTipoCerveja(tipo) {
  var sql = `
        INSERT INTO tipo_cerveja (tipo) VALUES
        ("${tipo}");
    `;

  return database.executar(sql);
}

async function listarTiposCerveja() {
  var sql = `
        SELECT id, tipo
        FROM tipo_cerveja
        ORDER BY tipo;
    `;

  return database.executar(sql);
}

async function buscarTipoCerveja(tipoCervejaId) {
  var sql = `
        SELECT id, tipo
        FROM tipo_cerveja
        WHERE id = ${tipoCervejaId};
    `;

  return database.executar(sql);
}

async function atualizarTipoCerveja(tipoCervejaId, tipo) {
  var sql = `
        UPDATE tipo_cerveja SET tipo = "${tipo}"
        WHERE id = ${tipoCervejaId};
    `;

  return database.executar(sql);
}

async function deletarTipoCerveja(tipoCervejaId) {
  var sql = `DELETE FROM tipo_cerveja WHERE id = ${tipoCervejaId};`;

  return database.executar(sql);
}

module.exports = {
  criarTipoCerveja,
  listarTiposCerveja,
  buscarTipoCerveja,
  atualizarTipoCerveja,
  deletarTipoCerveja,
};
