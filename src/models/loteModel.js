var database = require("../database/config");

function criarLote(codigo, volumeLitros, fkCerveja, fkUsuarioCriador) {
  var sql = `
        INSERT INTO lote (codigo, volume_litros, fk_cerveja, fk_usuario_criador) VALUES
        ("${codigo}", ${volumeLitros}, ${fkCerveja}, ${fkUsuarioCriador});
    `;

  return database.executar(sql);
}

async function listarLotes() {
  var sql = `
        SELECT
            l.id,
            l.codigo,
            l.volume_litros,
            l.fk_cerveja,
            c.nome AS cerveja,
            l.fk_usuario_criador,
            u.nome AS usuario_criador,
            l.fk_status_lote,
            sl.nome AS status_lote,
            l.dt_inicio,
            l.dt_fim
        FROM lote AS l
        JOIN cerveja AS c
            ON c.id = l.fk_cerveja
        JOIN usuario AS u
            ON u.id = l.fk_usuario_criador
        JOIN status_lote AS sl
            ON sl.id = l.fk_status_lote
        ORDER BY l.dt_inicio DESC;
    `;

  return database.executar(sql);
}

async function buscarLote(loteId) {
  var sql = `
        SELECT
            l.id,
            l.codigo,
            l.volume_litros,
            l.fk_cerveja,
            c.nome AS cerveja,
            l.fk_usuario_criador,
            l.fk_status_lote,
            sl.nome AS status_lote,
            l.dt_inicio,
            l.dt_fim
        FROM lote AS l
        JOIN cerveja AS c
            ON c.id = l.fk_cerveja
        JOIN status_lote AS sl
            ON sl.id = l.fk_status_lote
        WHERE l.id = ${loteId};
    `;

  return database.executar(sql);
}

async function atualizarLote(
  loteId,
  codigo,
  volumeLitros,
  fkCerveja,
  fkStatusLote,
) {
  var sql = `
        UPDATE lote SET codigo = "${codigo}", volume_litros = ${volumeLitros},
        fk_cerveja = ${fkCerveja}, fk_status_lote = ${fkStatusLote}
        WHERE id = ${loteId};
    `;

  return database.executar(sql);
}

// fk_status_lote 2 = Finalizado (ver INSERT em status_lote)
async function finalizarLote(loteId) {
  var sql = `
        UPDATE lote SET fk_status_lote = 2, dt_fim = NOW()
        WHERE id = ${loteId};
    `;

  return database.executar(sql);
}

async function contarProducoesDoLote(loteId) {
  var sql = `SELECT COUNT(*) AS total FROM producao WHERE fk_lote = ${loteId};`;

  return database.executar(sql);
}

async function deletarLote(loteId) {
  var sql = `DELETE FROM lote WHERE id = ${loteId};`;

  return database.executar(sql);
}

module.exports = {
  criarLote,
  listarLotes,
  buscarLote,
  atualizarLote,
  finalizarLote,
  contarProducoesDoLote,
  deletarLote,
};
