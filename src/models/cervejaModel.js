var database = require("../database/config");

async function listarCervejaEmpresa(empresaId) {
  var sql = `
    SELECT 
        c.id, c.fk_tipo_cerveja, c.fk_levedura, fk_usuario_criador,
        c.nome, c.temperatura_min, c.temperatura_max, c.tempo_fermentacao_dias
    FROM cerveja c
        JOIN usuario u ON u.id = c.fk_usuario_criador
    WHERE u.fk_empresa = ${empresaId}
    `;

  return database.executar(sql);
}

module.exports = {
  listarCervejaEmpresa,
};
