var database = require("../database/config");

function criarLote(
  codigo,
  volumeLitros,
  fkCerveja,
  fkUnidade,
  fkUsuarioCriador,
) {
  var sql = `
        INSERT INTO lote (codigo, volume_litros, fk_cerveja, fk_unidade, fk_usuario_criador) VALUES
        ("${codigo}", ${volumeLitros}, ${fkCerveja}, ${fkUnidade}, ${fkUsuarioCriador});
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
            c.fk_tipo_cerveja,
            tc.tipo AS estilo,
            c.fk_levedura,
            lv.nome AS levedura,
            CAST(c.temperatura_min AS DOUBLE) AS temperatura_min,
            CAST(c.temperatura_max AS DOUBLE) AS temperatura_max,
            c.tempo_fermentacao_dias,
            l.fk_unidade,
            un.nome AS nome_unidade,
            (
                SELECT p.fk_tanque
                FROM producao p
                WHERE p.fk_lote = l.id
                ORDER BY p.dt_saida IS NULL DESC, p.dt_entrada DESC
                LIMIT 1
            ) AS fk_tanque,
            (
                SELECT t.nome
                FROM producao p
                JOIN tanque t ON t.id = p.fk_tanque
                WHERE p.fk_lote = l.id
                ORDER BY p.dt_saida IS NULL DESC, p.dt_entrada DESC
                LIMIT 1
            ) AS nome_tanque,
            l.fk_usuario_criador,
            u.nome AS usuario_criador,
            l.fk_status_lote,
            sl.nome AS status_lote,
            l.dt_inicio,
            l.dt_fim,
            DATE_ADD(l.dt_inicio, INTERVAL c.tempo_fermentacao_dias DAY) AS dt_termino_previsto,
            (
                SELECT ROUND(
                    (SUM(CASE WHEN ls.temperatura BETWEEN c.temperatura_min AND c.temperatura_max THEN 1 ELSE 0 END) / COUNT(*)) * 100,
                    1
                )
                FROM leitura_sensor ls
                WHERE ls.fk_lote = l.id
            ) AS aderencia_termica
        FROM lote AS l
        JOIN cerveja AS c
            ON c.id = l.fk_cerveja
        JOIN tipo_cerveja AS tc
            ON tc.id = c.fk_tipo_cerveja
        JOIN levedura AS lv
            ON lv.id = c.fk_levedura
        JOIN unidade AS un
            ON un.id = l.fk_unidade
        JOIN usuario AS u
            ON u.id = l.fk_usuario_criador
        JOIN status_lote AS sl
            ON sl.id = l.fk_status_lote
        ORDER BY l.dt_inicio DESC;
    `;

  return database.executar(sql);
}

async function listarLotesPorEmpresa(idEmpresa) {
  var sql = `
        SELECT
            l.id,
            l.codigo,
            l.volume_litros,
            l.fk_cerveja,
            c.nome AS cerveja,
            c.fk_tipo_cerveja,
            tc.tipo AS estilo,
            c.fk_levedura,
            lv.nome AS levedura,
            CAST(c.temperatura_min AS DOUBLE) AS temperatura_min,
            CAST(c.temperatura_max AS DOUBLE) AS temperatura_max,
            c.tempo_fermentacao_dias,
            l.fk_unidade,
            un.nome AS nome_unidade,
            (
                SELECT p.fk_tanque
                FROM producao p
                WHERE p.fk_lote = l.id
                ORDER BY p.dt_saida IS NULL DESC, p.dt_entrada DESC
                LIMIT 1
            ) AS fk_tanque,
            (
                SELECT t.nome
                FROM producao p
                JOIN tanque t ON t.id = p.fk_tanque
                WHERE p.fk_lote = l.id
                ORDER BY p.dt_saida IS NULL DESC, p.dt_entrada DESC
                LIMIT 1
            ) AS nome_tanque,
            l.fk_usuario_criador,
            u.nome AS usuario_criador,
            l.fk_status_lote,
            sl.nome AS status_lote,
            l.dt_inicio,
            l.dt_fim,
            DATE_ADD(l.dt_inicio, INTERVAL c.tempo_fermentacao_dias DAY) AS dt_termino_previsto,
            (
                SELECT ROUND(
                    (SUM(CASE WHEN ls.temperatura BETWEEN c.temperatura_min AND c.temperatura_max THEN 1 ELSE 0 END) / COUNT(*)) * 100,
                    1
                )
                FROM leitura_sensor ls
                WHERE ls.fk_lote = l.id
            ) AS aderencia_termica
        FROM lote AS l
        JOIN cerveja AS c
            ON c.id = l.fk_cerveja
        JOIN tipo_cerveja AS tc
            ON tc.id = c.fk_tipo_cerveja
        JOIN levedura AS lv
            ON lv.id = c.fk_levedura
        JOIN unidade AS un
            ON un.id = l.fk_unidade
        JOIN usuario AS u
            ON u.id = l.fk_usuario_criador
        JOIN status_lote AS sl
            ON sl.id = l.fk_status_lote
        WHERE un.fk_empresa = ${idEmpresa}
        ORDER BY l.dt_inicio DESC;
    `;

  return database.executar(sql);
}

async function listarLotesPorUnidade(idUnidade) {
  var sql = `
        SELECT
            l.id,
            l.codigo,
            l.volume_litros,
            l.fk_cerveja,
            c.nome AS cerveja,
            c.fk_tipo_cerveja,
            tc.tipo AS estilo,
            c.fk_levedura,
            lv.nome AS levedura,
            CAST(c.temperatura_min AS DOUBLE) AS temperatura_min,
            CAST(c.temperatura_max AS DOUBLE) AS temperatura_max,
            c.tempo_fermentacao_dias,
            l.fk_unidade,
            un.nome AS nome_unidade,
            (
                SELECT p.fk_tanque
                FROM producao p
                WHERE p.fk_lote = l.id
                ORDER BY p.dt_saida IS NULL DESC, p.dt_entrada DESC
                LIMIT 1
            ) AS fk_tanque,
            (
                SELECT t.nome
                FROM producao p
                JOIN tanque t ON t.id = p.fk_tanque
                WHERE p.fk_lote = l.id
                ORDER BY p.dt_saida IS NULL DESC, p.dt_entrada DESC
                LIMIT 1
            ) AS nome_tanque,
            l.fk_usuario_criador,
            u.nome AS usuario_criador,
            l.fk_status_lote,
            sl.nome AS status_lote,
            l.dt_inicio,
            l.dt_fim,
            DATE_ADD(l.dt_inicio, INTERVAL c.tempo_fermentacao_dias DAY) AS dt_termino_previsto,
            (
                SELECT ROUND(
                    (SUM(CASE WHEN ls.temperatura BETWEEN c.temperatura_min AND c.temperatura_max THEN 1 ELSE 0 END) / COUNT(*)) * 100,
                    1
                )
                FROM leitura_sensor ls
                WHERE ls.fk_lote = l.id
            ) AS aderencia_termica
        FROM lote AS l
        JOIN cerveja AS c
            ON c.id = l.fk_cerveja
        JOIN tipo_cerveja AS tc
            ON tc.id = c.fk_tipo_cerveja
        JOIN levedura AS lv
            ON lv.id = c.fk_levedura
        JOIN unidade AS un
            ON un.id = l.fk_unidade
        JOIN usuario AS u
            ON u.id = l.fk_usuario_criador
        JOIN status_lote AS sl
            ON sl.id = l.fk_status_lote
        WHERE l.fk_unidade = ${idUnidade}
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
            c.fk_tipo_cerveja,
            tc.tipo AS estilo,
            c.fk_levedura,
            lv.nome AS levedura,
            CAST(c.temperatura_min AS DOUBLE) AS temperatura_min,
            CAST(c.temperatura_max AS DOUBLE) AS temperatura_max,
            c.tempo_fermentacao_dias,
            l.fk_unidade,
            un.nome AS nome_unidade,
            (
                SELECT p.fk_tanque
                FROM producao p
                WHERE p.fk_lote = l.id
                ORDER BY p.dt_saida IS NULL DESC, p.dt_entrada DESC
                LIMIT 1
            ) AS fk_tanque,
            (
                SELECT t.nome
                FROM producao p
                JOIN tanque t ON t.id = p.fk_tanque
                WHERE p.fk_lote = l.id
                ORDER BY p.dt_saida IS NULL DESC, p.dt_entrada DESC
                LIMIT 1
            ) AS nome_tanque,
            l.fk_usuario_criador,
            u.nome AS usuario_criador,
            l.fk_status_lote,
            sl.nome AS status_lote,
            l.dt_inicio,
            l.dt_fim,
            DATE_ADD(l.dt_inicio, INTERVAL c.tempo_fermentacao_dias DAY) AS dt_termino_previsto,
            (
                SELECT ROUND(
                    (SUM(CASE WHEN ls.temperatura BETWEEN c.temperatura_min AND c.temperatura_max THEN 1 ELSE 0 END) / COUNT(*)) * 100,
                    1
                )
                FROM leitura_sensor ls
                WHERE ls.fk_lote = l.id
            ) AS aderencia_termica
        FROM lote AS l
        JOIN cerveja AS c
            ON c.id = l.fk_cerveja
        JOIN tipo_cerveja AS tc
            ON tc.id = c.fk_tipo_cerveja
        JOIN levedura AS lv
            ON lv.id = c.fk_levedura
        JOIN unidade AS un
            ON un.id = l.fk_unidade
        JOIN usuario AS u
            ON u.id = l.fk_usuario_criador
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
  fkUnidade,
  fkStatusLote,
) {
  var sql = `
        UPDATE lote SET codigo = "${codigo}", volume_litros = ${volumeLitros},
        fk_cerveja = ${fkCerveja}, fk_unidade = ${fkUnidade}, fk_status_lote = ${fkStatusLote}
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

// fk_status_lote 3 = Cancelado (ver INSERT em status_lote)
async function cancelarLote(loteId) {
  var sql = `
        UPDATE lote SET fk_status_lote = 3, dt_fim = NOW()
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
  listarLotesPorEmpresa,
  listarLotesPorUnidade,
  buscarLote,
  atualizarLote,
  finalizarLote,
  cancelarLote,
  contarProducoesDoLote,
  deletarLote,
};
