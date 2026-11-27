var database = require("../database/config");

function buscarUnidade(idUnidade) {
    var instrucaoSql = `
        SELECT
            u.id,
            u.fk_status_unidade,
            u.quantidade_tanques
        FROM unidade u
        WHERE u.id = ${idUnidade};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarStatusSensor(fkStatusSensor) {
    var instrucaoSql = `
        SELECT id, nome
        FROM status_sensor
        WHERE id = ${fkStatusSensor};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPorId(idSensor) {
    var instrucaoSql = `
        SELECT
            s.id,
            s.fk_unidade,
            s.fk_status_sensor,
            (SELECT COUNT(*)
                FROM leitura_sensor ls
                INNER JOIN producao p
                    ON p.fk_lote = ls.fk_lote AND p.fk_tanque = ls.fk_tanque
                WHERE p.fk_sensor = s.id) AS leituras,
            (SELECT COUNT(*)
                FROM producao p
                WHERE p.fk_sensor = s.id AND p.dt_saida IS NULL) AS producoes_ativas,
            (SELECT COUNT(*)
                FROM producao p
                WHERE p.fk_sensor = s.id) AS producoes_historico
        FROM sensor s
        WHERE s.id = ${idSensor};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(idUnidade, modelo) {
    var modeloSensor = modelo || "LM35";
    var instrucaoSql = `
        INSERT INTO sensor (fk_unidade, fk_status_sensor, modelo)
        VALUES (${idUnidade}, 1, '${modeloSensor}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarPorUnidade(idUnidade) {
    var instrucaoSql = `
        SELECT
            s.id,
            s.id AS idSensor,
            s.fk_unidade,
            s.fk_status_sensor,
            ss.nome AS status_sensor,
            s.modelo,
            s.dt_instalacao,
            p.fk_tanque,
            t.nome AS tanque,
            p.fk_lote,
            l.codigo AS lote
        FROM sensor s
            INNER JOIN status_sensor ss
                ON ss.id = s.fk_status_sensor
            LEFT JOIN producao p
                ON p.fk_sensor = s.id AND p.dt_saida IS NULL
            LEFT JOIN tanque t
                ON t.id = p.fk_tanque
            LEFT JOIN lote l
                ON l.id = p.fk_lote AND l.fk_status_lote = 1
        WHERE s.fk_unidade = ${idUnidade}
        ORDER BY s.id;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarPorEmpresa(idEmpresa) {
    var instrucaoSql = `
        SELECT
            s.id,
            s.id AS idSensor,
            s.fk_unidade,
            s.fk_status_sensor,
            ss.nome AS status_sensor,
            s.modelo,
            s.dt_instalacao,
            p.fk_tanque,
            t.nome AS tanque,
            p.fk_lote,
            l.codigo AS lote
        FROM sensor s
            INNER JOIN unidade u
                ON u.id = s.fk_unidade
            INNER JOIN status_sensor ss
                ON ss.id = s.fk_status_sensor
            LEFT JOIN producao p
                ON p.fk_sensor = s.id AND p.dt_saida IS NULL
            LEFT JOIN tanque t
                ON t.id = p.fk_tanque
            LEFT JOIN lote l
                ON l.id = p.fk_lote AND l.fk_status_lote = 1
        WHERE u.fk_empresa = ${idEmpresa}
        ORDER BY s.fk_unidade, s.id;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function alterarStatus(idSensor, fkStatusSensor) {
    var instrucaoSql = `
        UPDATE sensor SET fk_status_sensor = ${fkStatusSensor} WHERE id = ${idSensor};
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
    buscarUnidade,
    buscarStatusSensor,
    buscarPorId,
    cadastrar,
    listarPorUnidade,
    listarPorEmpresa,
    alterarStatus,
    deletar
}
