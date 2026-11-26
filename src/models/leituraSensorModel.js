var database = require("../database/config");

function buscarSensor(idSensor) {
  var instrucaoSql = `
        SELECT id, fk_tanque, status_sensor FROM sensor WHERE id = ${idSensor};
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

function listar(limite_linhas) {
  var instrucaoSql = `
        SELECT id, fk_sensor, temperatura, dt_medicao
        FROM leitura_sensor
        ORDER BY dt_medicao DESC LIMIT ${limite_linhas};
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

function historico(loteId) {
  var sql = `
    SELECT 
        l.id,
        CONCAT('Lote ', l.codigo) AS nome,
        c.nome AS tipo,
        tc.tipo AS estilo,
        CAST(c.temperatura_min AS DOUBLE) AS faixa_min,
        CAST(c.temperatura_max AS DOUBLE) AS faixa_max,
        c.tempo_fermentacao_dias AS duracao,
        COALESCE(
            (
                SELECT JSON_ARRAYAGG(d.temp_media)
                FROM (
                    SELECT ROUND(AVG(ls.temperatura), 1) AS temp_media
                    FROM leitura_sensor ls
                    WHERE ls.fk_lote = l.id
                    GROUP BY DATEDIFF(ls.dt_medicao, l.dt_inicio)
                    ORDER BY DATEDIFF(ls.dt_medicao, l.dt_inicio) ASC
                ) AS d
            ),
            JSON_ARRAY()
        ) AS data,
        COALESCE(
            (
                SELECT JSON_ARRAYAGG(h.temp_media)
                FROM (
                    SELECT ROUND(AVG(ls2.temperatura), 1) AS temp_media
                    FROM leitura_sensor ls2
                    WHERE ls2.fk_lote = l.id
                      AND ls2.dt_medicao >= DATE_SUB(
                          (SELECT MAX(ls3.dt_medicao) FROM leitura_sensor ls3 WHERE ls3.fk_lote = l.id),
                          INTERVAL 24 HOUR
                      )
                    GROUP BY DATE_FORMAT(ls2.dt_medicao, '%Y-%m-%d %H:00:00')
                    ORDER BY DATE_FORMAT(ls2.dt_medicao, '%Y-%m-%d %H:00:00') ASC
                ) AS h
            ),
            JSON_ARRAY()
        ) AS data_24h
    FROM lote l
        INNER JOIN cerveja c
            ON c.id = l.fk_cerveja
        INNER JOIN tipo_cerveja tc
            ON tc.id = c.fk_tipo_cerveja
    WHERE l.id = ${loteId};
  `;

  return database.executar(sql);
}

module.exports = {
  buscarSensor,
  buscarLote,
  buscarLoteAtivo,
  listar,
  listarPorLote,
  historico,
};
