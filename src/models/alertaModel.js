var database = require("../database/config");

async function registrarAlerta(leituraId, tipoAlertaId, descricao) {
  var sql = `
        INSERT INTO alerta (fk_leitura, fk_tipo_alerta, descricao) VALUES
        (${leituraId}, ${tipoAlertaId}, '${descricao}');
    `;

  return database.executar(sql);
}

module.exports = {
  registrarAlerta,
};
