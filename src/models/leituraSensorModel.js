var database = require("../database/config");

function buscarSensor(idSensor) {
  var instrucaoSql = `
        SELECT id, fk_tanque, status_sensor FROM sensor WHERE id = ${idSensor};
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarTanque(idTanque) {
  var instrucaoSql = `
        SELECT id FROM tanque WHERE id = ${idTanque};
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarLote(idLote) {
  var instrucaoSql = `
        SELECT id FROM lote WHERE id = ${idLote};
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


function buscarLoteAtivo(idSensor, temperatura) {
  var instrucaoSql = `
        SELECT
            l.codigo AS lote,
            t.nome AS tanque,
            c.temperatura_min,
            c.temperatura_max,
            CASE
                WHEN ROUND(${temperatura}, 1) > c.temperatura_max THEN 1
                WHEN ROUND(${temperatura}, 1) < c.temperatura_min THEN 2
                ELSE 0
            END AS tipo_alerta
        FROM sensor s
            INNER JOIN tanque t
                ON t.id = s.fk_tanque
            INNER JOIN producao p
                ON p.fk_tanque = t.id
            INNER JOIN lote l
                ON l.id = p.fk_lote
            INNER JOIN cerveja c
                ON c.id = l.fk_cerveja
        WHERE s.id = ${idSensor}
            AND l.fk_status_lote = 1
            AND p.dt_entrada <= NOW()
            AND (p.dt_saida IS NULL OR p.dt_saida >= NOW())
        ORDER BY p.dt_entrada DESC LIMIT 1;
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


function cadastrar(idSensor, temperatura) {
  var instrucaoSql = `
        INSERT INTO leitura_sensor (fk_sensor, temperatura) VALUES (${idSensor}, ${temperatura});
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function cadastrarAlerta(idLeitura, tipoAlerta, descricao) {
  var instrucaoSql = `
        INSERT INTO alerta (fk_leitura, tipo_alerta, descricao) VALUES (${idLeitura}, ${tipoAlerta}, '${descricao}');
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function listar(limite_linhas) {
  var instrucaoSql = `
        SELECT id, fk_sensor, temperatura, dt_medicao
        FROM leitura_sensor
        ORDER BY dt_medicao DESC LIMIT ${limite_linhas};
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarPorId(idLeitura) {
  var instrucaoSql = `
        SELECT
            ls.id,
            ls.fk_sensor,
            ls.temperatura,
            ls.dt_medicao,
            a.id AS idAlerta,
            a.tipo_alerta,
            a.descricao,
            a.dt_resolucao
        FROM leitura_sensor ls
            LEFT JOIN alerta a
                ON a.fk_leitura = ls.id
        WHERE ls.id = ${idLeitura};
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function listarPorSensor(idSensor, limite_linhas) {
  var instrucaoSql = `
        SELECT id, fk_sensor, temperatura, dt_medicao
        FROM leitura_sensor
        WHERE fk_sensor = ${idSensor}
        ORDER BY dt_medicao DESC LIMIT ${limite_linhas};
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarUltimaPorSensor(idSensor) {
  var instrucaoSql = `
        SELECT id, fk_sensor, temperatura, dt_medicao
        FROM leitura_sensor
        WHERE fk_sensor = ${idSensor}
        ORDER BY dt_medicao DESC LIMIT 1;
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function listarPorTanque(idTanque, limite_linhas) {
  var instrucaoSql = `
        SELECT
            t.nome AS tanque,
            ls.id,
            ls.fk_sensor,
            ls.temperatura,
            ls.dt_medicao
        FROM leitura_sensor ls
            INNER JOIN sensor s
                ON s.id = ls.fk_sensor
            INNER JOIN tanque t
                ON t.id = s.fk_tanque
        WHERE t.id = ${idTanque}
        ORDER BY ls.dt_medicao DESC LIMIT ${limite_linhas};
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


function listarPorLote(idLote, limite_linhas) {
  var instrucaoSql = `
        SELECT
            l.codigo AS lote,
            c.nome AS cerveja,
            t.nome AS tanque,
            ls.id,
            ls.fk_sensor,
            ls.temperatura,
            ls.dt_medicao
        FROM lote l
            INNER JOIN cerveja c
                ON c.id = l.fk_cerveja
            INNER JOIN producao p
                ON p.fk_lote = l.id
            INNER JOIN tanque t
                ON t.id = p.fk_tanque
            INNER JOIN sensor s
                ON s.fk_tanque = t.id
            INNER JOIN leitura_sensor ls
                ON ls.fk_sensor = s.id
        WHERE l.id = ${idLote}
            AND ls.dt_medicao >= p.dt_entrada
            AND (p.dt_saida IS NULL OR ls.dt_medicao <= p.dt_saida)
        ORDER BY ls.dt_medicao DESC LIMIT ${limite_linhas};
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  buscarSensor,
  buscarTanque,
  buscarLote,
  buscarLoteAtivo,
  cadastrar,
  cadastrarAlerta,
  listar,
  buscarPorId,
  listarPorSensor,
  buscarUltimaPorSensor,
  listarPorTanque,
  listarPorLote
}
