var database = require("../database/config");

function buscarTanque(idTanque) {
    var instrucaoSql = `
        SELECT
            t.id,
            t.fk_unidade,
            (SELECT COUNT(*) FROM sensor WHERE fk_tanque = t.id AND status_sensor = 1) AS sensores_ativos
        FROM tanque t
        WHERE t.id = ${idTanque};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPorId(idSensor) {
    var instrucaoSql = `
        SELECT
            s.id,
            (SELECT COUNT(*)
                FROM sensor
                WHERE fk_tanque = s.fk_tanque AND status_sensor = 1 AND id <> s.id) AS outros_ativos,
            (SELECT COUNT(*) FROM leitura_sensor WHERE fk_sensor = s.id) AS leituras,
            (SELECT COUNT(*) FROM tanque WHERE fk_sensor = s.id) AS tanques_vinculados
        FROM sensor s
        WHERE s.id = ${idSensor};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(idUnidade, idTanque) {
    var instrucaoSql = `
        INSERT INTO sensor (fk_unidade, fk_tanque, status_sensor) VALUES (${idUnidade}, ${idTanque}, 1);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarPorUnidade(idUnidade) {
    var instrucaoSql = `
        SELECT
            s.id AS idSensor,
            s.fk_tanque,
            t.nome AS tanque,
            s.status_sensor,
            s.modelo,
            s.dt_instalacao
        FROM sensor s
            INNER JOIN tanque t
                ON t.id = s.fk_tanque
        WHERE s.fk_unidade = ${idUnidade}
        ORDER BY t.nome, s.id;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function alterarStatus(idSensor, statusSensor) {
    var instrucaoSql = `
        UPDATE sensor SET status_sensor = ${statusSensor} WHERE id = ${idSensor};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletar(idSensor) {
    var instrucaoSql = `
        DELETE FROM sensor WHERE id = ${idSensor};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarTanque,
    buscarPorId,
    cadastrar,
    listarPorUnidade,
    alterarStatus,
    deletar
}
