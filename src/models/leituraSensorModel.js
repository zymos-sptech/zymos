var database = require("../database/config");


function criarLeituraSensor(
  temperatura,
  dt_medicao,
) {
    var sql = `
            INSERT INTO leitura_sensor (temperatura, dt_medicao) VALUES
            ("${temperatura}", ${dt_medicao});
        `;
    return database.executar(sql);

}

