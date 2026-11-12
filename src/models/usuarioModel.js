var database = require("../database/config");

async function criarUsuario(nome, email, senha, cargoId, empresaId) {
  var sql = `
    INSERT INTO usuario (nome, email, senha, fk_cargo, fk_empresa, status) VALUES
    ("${nome}", "${email}", "${senha}", ${cargoId}, ${empresaId}, 1)
    `;

  return database.executar(sql);
}

async function buscarUsuario(id, email, nome) {
  let valores = [];

  if (id !== null) {
    valores.push(`u.id = ${id}`);
  }

  if (email !== null) {
    valores.push(`u.email = "${email}"`);
  }

  if (nome !== null) {
    valores.push(`u.nome = "${nome}"`);
  }

  var sql = `
      SELECT u.id, u.nome, u.email, c.nome cargo
      FROM usuario u
        JOIN cargo c
      ON c.id = u.fk_cargo 
      WHERE ${valores};`;

  return database.executar(sql);
}

async function autenticar(email, senha) {
  console.log(email, senha, "ema senh");
  var sqlAutenticar = `
      SELECT id FROM usuario WHERE email = "${email}" AND senha = "${senha}";
      `;

  const validarUsuario = await database.executar(sqlAutenticar);
  console.log(validarUsuario, "validar usuario");
  if (validarUsuario.length > 0) {
    return buscarUsuario(validarUsuario[0].id, null, null);
  }

  return false;
}

module.exports = {
  criarUsuario,
  autenticar,
  buscarUsuario,
};
