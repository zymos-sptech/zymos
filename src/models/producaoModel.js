var database = require("../database/config");

function criarProducao(loteId, tanqueId, sensorId) {
  var sql = `
        INSERT INTO producao (fk_lote, fk_tanque, fk_sensor) VALUES
        (${loteId}, ${tanqueId}, ${sensorId});
    `;

  return database.executar(sql);
}

async function listarProducoes() {
  var sql = `
        SELECT
            p.fk_lote,
            p.fk_sensor,
            l.codigo AS lote,
            p.fk_tanque,
            t.nome AS tanque,
            c.nome AS cerveja,
            p.dt_entrada,
            p.dt_saida
        FROM producao AS p
        JOIN lote AS l
            ON l.id = p.fk_lote
        JOIN tanque AS t
            ON t.id = p.fk_tanque
        JOIN sensor s 
            ON s.id = p.fk_sensor
        JOIN cerveja AS c
            ON c.id = l.fk_cerveja
        ORDER BY p.dt_entrada DESC;
    `;

  return database.executar(sql);
}

async function listarProducoesPorLote(loteId) {
  var sql = `
        SELECT
            p.fk_lote,
            p.fk_sensor,
            l.codigo AS lote,
            p.fk_tanque,
            t.nome AS tanque,
            p.dt_entrada,
            p.dt_saida
        FROM producao AS p
        JOIN lote AS l
            ON l.id = p.fk_lote
        JOIN tanque AS t
            ON t.id = p.fk_tanque
        JOIN sensor s
            ON s.id = p.fk_sensor
        WHERE p.fk_lote = ${loteId}
        ORDER BY p.dt_entrada DESC;
    `;

  return database.executar(sql);
}

async function buscarProducao(loteId, tanqueId) {
  var sql = `
        SELECT fk_lote, fk_tanque, dt_entrada, dt_saida
        FROM producao
        WHERE fk_lote = ${loteId} AND fk_tanque = ${tanqueId};
    `;

  return database.executar(sql);
}

async function buscarTanque(tanqueId) {
  var sql = `SELECT id FROM tanque WHERE id = ${tanqueId};`;

  return database.executar(sql);
}

async function buscarLote(loteId) {
  var sql = `SELECT id FROM lote WHERE id = ${loteId};`;

  return database.executar(sql);
}

async function finalizarProducao(loteId, tanqueId, dtSaida) {
  var sql = `
        UPDATE producao SET dt_saida = "${dtSaida}"
        WHERE fk_lote = ${loteId} AND fk_tanque = ${tanqueId};
    `;

  if (dtSaida == undefined) {
    sql = `
        UPDATE producao SET dt_saida = NOW()
        WHERE fk_lote = ${loteId} AND fk_tanque = ${tanqueId};
    `;
  }

  return database.executar(sql);
}

async function deletarProducao(loteId, tanqueId) {
  var sql = `
        DELETE FROM producao
        WHERE fk_lote = ${loteId} AND fk_tanque = ${tanqueId};
    `;

  return database.executar(sql);
}

module.exports = {
  criarProducao,
  listarProducoes,
  listarProducoesPorLote,
  buscarProducao,
  buscarTanque,
  buscarLote,
  finalizarProducao,
  deletarProducao,
};
