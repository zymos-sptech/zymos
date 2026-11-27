var database = require("../database/config");

async function listarAlertaEmpresa(empresaId) {
  var sql = `
    SELECT
        a.id,
        a.fk_leitura,
        a.fk_tipo_alerta,
        ta.nome AS tipo_alerta,
        a.descricao,
        a.dt_alerta,
        a.dt_resolucao,
        CASE
            WHEN a.dt_resolucao IS NULL THEN 'Aberto'
            ELSE 'Resolvido'
        END AS status_alerta,
        CAST(ls.temperatura AS DOUBLE) AS temperatura,
        ls.fk_lote,
        l.codigo AS codigo_lote,
        l.volume_litros,
        ls.fk_tanque,
        t.nome AS nome_tanque,
        t.fk_unidade,
        un.nome AS nome_unidade
    FROM alerta AS a
        INNER JOIN tipo_alerta AS ta
            ON ta.id = a.fk_tipo_alerta
        INNER JOIN leitura_sensor AS ls
            ON ls.id = a.fk_leitura
        INNER JOIN lote AS l
            ON l.id = ls.fk_lote
        INNER JOIN tanque AS t
            ON t.id = ls.fk_tanque
        INNER JOIN unidade AS un
            ON un.id = t.fk_unidade
    WHERE un.fk_empresa = ${empresaId}
    ORDER BY a.dt_alerta DESC;
  `;

  return database.executar(sql);
}

async function listarAlertaUnidade(unidadeId) {
  var sql = `
    SELECT
        a.id,
        a.fk_leitura,
        a.fk_tipo_alerta,
        ta.nome AS tipo_alerta,
        a.descricao,
        a.dt_alerta,
        a.dt_resolucao,
        CASE
            WHEN a.dt_resolucao IS NULL THEN 'Aberto'
            ELSE 'Resolvido'
        END AS status_alerta,
        CAST(ls.temperatura AS DOUBLE) AS temperatura,
        ls.fk_lote,
        l.codigo AS codigo_lote,
        l.volume_litros,
        ls.fk_tanque,
        t.nome AS nome_tanque,
        t.fk_unidade,
        un.nome AS nome_unidade
    FROM alerta AS a
        INNER JOIN tipo_alerta AS ta
            ON ta.id = a.fk_tipo_alerta
        INNER JOIN leitura_sensor AS ls
            ON ls.id = a.fk_leitura
        INNER JOIN lote AS l
            ON l.id = ls.fk_lote
        INNER JOIN tanque AS t
            ON t.id = ls.fk_tanque
        INNER JOIN unidade AS un
            ON un.id = t.fk_unidade
    WHERE t.fk_unidade = ${unidadeId}
    ORDER BY a.dt_alerta DESC;
  `;

  return database.executar(sql);
}

async function listarAlertaLote(loteId) {
  var sql = `
    SELECT
        a.id,
        a.fk_leitura,
        ls.fk_lote,
        l.codigo AS codigo_lote,
        ls.fk_tanque,
        t.nome AS nome_tanque,
        a.fk_tipo_alerta,
        CASE
            WHEN a.fk_tipo_alerta = 2 THEN 'Temperatura acima do ideal'
            ELSE 'Temperatura abaixo do ideal'
        END AS tipo_alerta,
        a.descricao,
        CAST(ls.temperatura AS DOUBLE) AS temperatura,
        CAST(c.temperatura_min AS DOUBLE) AS temperatura_min,
        CAST(c.temperatura_max AS DOUBLE) AS temperatura_max,
        CAST(
            CASE
                WHEN a.fk_tipo_alerta = 2 THEN ROUND(ls.temperatura - c.temperatura_max, 1)
                WHEN a.fk_tipo_alerta = 1 THEN ROUND(c.temperatura_min - ls.temperatura, 1)
                ELSE 0
            END AS DOUBLE
        ) AS desvio_graus,
        a.dt_alerta,
        a.dt_resolucao,
        TIMESTAMPDIFF(MINUTE, a.dt_alerta, a.dt_resolucao) AS duracao_minutos,
        CASE
            WHEN a.dt_resolucao IS NULL THEN 'Aberto'
            ELSE 'Resolvido'
        END AS status_alerta
    FROM alerta AS a
        INNER JOIN leitura_sensor AS ls
            ON ls.id = a.fk_leitura
        INNER JOIN lote AS l
            ON l.id = ls.fk_lote
        INNER JOIN cerveja AS c
            ON c.id = l.fk_cerveja
        INNER JOIN tanque AS t
            ON t.id = ls.fk_tanque
    WHERE ls.fk_lote = ${loteId}
    ORDER BY a.dt_alerta DESC;
  `;

  return database.executar(sql);
}

module.exports = {
  listarAlertaEmpresa,
  listarAlertaUnidade,
  listarAlertaLote,
};
