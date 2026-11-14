var database = require("../database/config");

function criarPlano(
  nome,
  tanqueMin,
  tanquesMax,
  valorSetup,
  valorMensalTanque,
) {
  var sql = `
        INSERT INTO plano (nome, tanques_min, tanques_max, valor_setup_tanque, valor_mensal_tanque) VALUES 
        ("${nome}", ${tanqueMin}, ${tanquesMax}, ${valorSetup}, ${valorMensalTanque});
    `;
  return database.executar(sql);
}

async function listarPlanos() {
  var sql = `
        SELECT id, nome, tanques_min, tanques_max, valor_setup_tanque, valor_mensal_tanque
        FROM plano;
    `;

  return database.executar(sql);
}

async function buscarPlano(planoId) {
  var sql = `SELECT id FROM plano WHERE id = ${planoId}`;

  return database.executar(sql);
}

async function atualizarPlano(
  planoId,
  nome,
  tanqueMin,
  tanquesMax,
  valorSetup,
  valorMensalTanque,
) {
  var sql = `
        UPDATE plano SET nome = ${nome}, tanques_min = ${tanquesMax}, 
        tanques_max = ${tanquesMax}, valor_setup_tanque = ${valorSetup}, 
        valor_mensal_tanque = ${valorMensalTanque} WHERE id = ${planoId};
    `;

  return database.executar(sql);
}

async function deletarPlano(planoId) {
  console.log(planoId, "id para delete");
  var sql = `DELETE FROM plano WHERE id = ${planoId};`;

  return database.executar(sql);
}

module.exports = {
  criarPlano,
  listarPlanos,
  buscarPlano,
  atualizarPlano,
  deletarPlano,
};
