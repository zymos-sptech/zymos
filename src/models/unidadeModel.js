var database = require("../database/config");

async function listarUnidadeEmpresa(empresaId) {
  var sql = `
    SELECT 
        u.id, u.fk_empresa, fk_usuario_criador, u.fk_status_unidade,
        u.quantidade_tanques, u.cnpj, u.nome, u.cidade, u.uf
    FROM unidade u
    WHERE u.fk_empresa = ${empresaId};
    `;

  return database.executar(sql);
}

module.exports = {
  listarUnidadeEmpresa,
};
