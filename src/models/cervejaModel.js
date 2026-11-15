var database = require("../database/config");

function criarCerveja(
  nome,
  fkTipoCerveja,
  fkLevedura,
  temperaturaMin,
  temperaturaMax,
  tempoFermentacaoDias,
) {
  var sql = `
        INSERT INTO cerveja (nome, fk_tipo_cerveja, fk_levedura, temperatura_min, temperatura_max, tempo_fermentacao_dias) VALUES
        ("${nome}", ${fkTipoCerveja}, ${fkLevedura}, ${temperaturaMin}, ${temperaturaMax}, ${tempoFermentacaoDias});
    `;

  return database.executar(sql);
}

async function listarCervejas() {
  var sql = `
        SELECT
            c.id,
            c.nome,
            c.fk_tipo_cerveja,
            t.tipo tipo_cerveja,
            c.fk_levedura,
            l.nome levedura,
            c.temperatura_min,
            c.temperatura_max,
            c.tempo_fermentacao_dias
        FROM cerveja c
        JOIN tipo_cerveja t
            ON t.id = c.fk_tipo_cerveja
        JOIN levedura l
            ON l.id = c.fk_levedura
        ORDER BY c.nome;
    `;

  return database.executar(sql);
}

async function buscarCerveja(cervejaId) {
  var sql = `
        SELECT
            c.id,
            c.nome,
            c.fk_tipo_cerveja,
            t.tipo tipo_cerveja,
            c.fk_levedura,
            l.nome levedura,
            c.temperatura_min,
            c.temperatura_max,
            c.tempo_fermentacao_dias
        FROM cerveja c
        JOIN tipo_cerveja t
            ON t.id = c.fk_tipo_cerveja
        JOIN levedura l
            ON l.id = c.fk_levedura
        WHERE c.id = ${cervejaId};
    `;

  return database.executar(sql);
}

async function atualizarCerveja(
  cervejaId,
  nome,
  fkTipoCerveja,
  fkLevedura,
  temperaturaMin,
  temperaturaMax,
  tempoFermentacaoDias,
) {
  var sql = `
        UPDATE cerveja SET nome = "${nome}", fk_tipo_cerveja = ${fkTipoCerveja},
        fk_levedura = ${fkLevedura}, temperatura_min = ${temperaturaMin},
        temperatura_max = ${temperaturaMax}, tempo_fermentacao_dias = ${tempoFermentacaoDias}
        WHERE id = ${cervejaId};
    `;

  return database.executar(sql);
}

async function deletarCerveja(cervejaId) {
  var sql = `DELETE FROM cerveja WHERE id = ${cervejaId};`;

  return database.executar(sql);
}

module.exports = {
  criarCerveja,
  listarCervejas,
  buscarCerveja,
  atualizarCerveja,
  deletarCerveja,
};
