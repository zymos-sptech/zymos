var database = require("../database/config");

function buscarUnidade(idUnidade) {
    var instrucaoSql = `
        SELECT
            u.id,
            u.fk_status_unidade,
            u.quantidade_tanques,
            p.tanques_max,
            (SELECT COUNT(*) FROM tanque WHERE fk_unidade = u.id) AS tanques_unidade,
            (SELECT COUNT(*)
                FROM tanque t
                    INNER JOIN unidade u2
                        ON u2.id = t.fk_unidade
                WHERE u2.fk_empresa = u.fk_empresa) AS tanques_empresa
        FROM unidade u
            INNER JOIN empresa e
                ON e.id = u.fk_empresa
            INNER JOIN plano p
                ON p.id = e.fk_plano
        WHERE u.id = ${idUnidade};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPorId(idTanque) {
    var instrucaoSql = `
        SELECT
            t.id,
            t.fk_unidade,
            (SELECT COUNT(*)
                FROM producao p
                    INNER JOIN lote l
                        ON l.id = p.fk_lote
                WHERE p.fk_tanque = t.id
                    AND p.dt_saida IS NULL
                    AND l.fk_status_lote = 1) AS lotes_ativos,
            (SELECT COUNT(*) FROM producao WHERE fk_tanque = t.id) AS producoes,
            (SELECT COUNT(*) FROM sensor WHERE fk_tanque = t.id) AS sensores
        FROM tanque t
        WHERE t.id = ${idTanque};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPorNome(idUnidade, nome, idTanqueIgnorado) {
    var instrucaoSql = `
        SELECT id FROM tanque
        WHERE fk_unidade = ${idUnidade} AND nome = '${nome}' AND id <> ${idTanqueIgnorado};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(idUnidade, nome, capacidade) {
    var instrucaoSql = `
        INSERT INTO tanque (fk_unidade, nome, capacidade) VALUES (${idUnidade}, '${nome}', ${capacidade});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarPorUnidade(idUnidade) {
    var instrucaoSql = `
        SELECT
            t.id AS idTanque,
            t.nome,
            t.capacidade,
            t.fk_status_tanque,
            st.nome AS status_tanque,
            l.codigo AS lote,
            c.nome AS cerveja
        FROM tanque t
            INNER JOIN status_tanque st
                ON st.id = t.fk_status_tanque
            LEFT JOIN producao p
                ON p.fk_tanque = t.id AND p.dt_saida IS NULL
            LEFT JOIN lote l
                ON l.id = p.fk_lote AND l.fk_status_lote = 1
            LEFT JOIN cerveja c
                ON c.id = l.fk_cerveja
        WHERE t.fk_unidade = ${idUnidade}
        ORDER BY t.nome;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function editar(idTanque, nome, capacidade, idStatusTanque) {
    var instrucaoSql = `
        UPDATE tanque
        SET nome = '${nome}', capacidade = ${capacidade}, fk_status_tanque = ${idStatusTanque}
        WHERE id = ${idTanque};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletar(idTanque) {
    var instrucaoSql = `
        DELETE FROM tanque WHERE id = ${idTanque};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarUnidade,
    buscarPorId,
    buscarPorNome,
    cadastrar,
    listarPorUnidade,
    editar,
    deletar
}
